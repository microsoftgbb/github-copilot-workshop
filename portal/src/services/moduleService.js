const fs   = require('fs/promises');
const path = require('path');
const { MODULES_DIR } = require('../config/config');
const { ModuleNotFoundError } = require('../errors/errors');
const { renderMarkdown } = require('../utils/markdownParser');

const MODULE_DIR_REGEX = /^module-(\d{2})-/;

/**
 * @typedef {Object} ModuleMetadata
 * @property {string}   id
 * @property {number}   order
 * @property {string}   title
 * @property {string}   duration
 * @property {string}   format
 * @property {string}   description
 * @property {string[]} languages
 * @property {boolean}  hasJava
 * @property {boolean}  hasJavaScript
 */

/**
 * @typedef {Object} CodeFile
 * @property {string} filename
 * @property {string} language
 * @property {string} relativePath
 * @property {string} content
 */

/**
 * Parses metadata from a README.md string.
 * @param {string} content
 * @returns {{ title: string, duration: string, format: string, description: string }}
 */
const parseReadmeMetadata = (content) => {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled Module';

  const durationMatch = content.match(/\*\*Duration:\*\*\s*([^|\n<]+)/);
  const duration = durationMatch ? durationMatch[1].trim() : '';

  const formatMatch = content.match(/\*\*Format:\*\*\s*([^\n<|]+)/);
  const format = formatMatch ? formatMatch[1].trim() : '';

  const lines = content.split('\n');
  let description = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('>') &&
        !trimmed.startsWith('|') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
      description = trimmed;
      break;
    }
  }

  return { title, duration, format, description };
};

/**
 * Checks if a path exists on the filesystem.
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
const pathExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Detects which languages are available for a module.
 * @param {string} moduleDir - Absolute path to module directory
 * @returns {Promise<{ hasJava: boolean, hasJavaScript: boolean }>}
 */
const detectAvailableLanguages = async (moduleDir) => {
  let hasJava = false;
  let hasJavaScript = false;

  const exercisesDir = path.join(moduleDir, 'exercises');
  if (await pathExists(exercisesDir)) {
    const files = await fs.readdir(exercisesDir);
    if (files.some(f => f.endsWith('.java'))) hasJava = true;
    if (files.some(f => f.endsWith('.js'))) hasJavaScript = true;
  }

  const samplesJavaDir = path.join(moduleDir, 'samples', 'java');
  const samplesJsDir   = path.join(moduleDir, 'samples', 'javascript');
  if (await pathExists(samplesJavaDir)) hasJava = true;
  if (await pathExists(samplesJsDir))   hasJavaScript = true;

  return { hasJava, hasJavaScript };
};

/**
 * Recursively collects files with given extensions from a directory.
 * @param {string} dir
 * @param {string[]} extensions
 * @param {string} baseDir - Used to compute relative paths
 * @returns {Promise<Array<{ relativePath: string, filename: string }>>}
 */
const collectFilesRecursively = async (dir, extensions, baseDir) => {
  const results = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const nested = await collectFilesRecursively(fullPath, extensions, baseDir);
        results.push(...nested);
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        results.push({
          relativePath: path.relative(baseDir, fullPath),
          filename: entry.name,
        });
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    // directory does not exist — return empty
  }
  return results;
};

/**
 * Collects code files for a module, optionally filtered by language.
 * @param {string} moduleDir
 * @param {string|undefined} language
 * @returns {Promise<CodeFile[]>}
 */
const collectCodeFiles = async (moduleDir, language) => {
  const files = [];

  const addFiles = async (dir, extensions, lang) => {
    const collected = await collectFilesRecursively(dir, extensions, moduleDir);
    for (const { relativePath, filename } of collected) {
      const fullPath = path.join(moduleDir, relativePath);
      const content  = await fs.readFile(fullPath, 'utf-8');
      files.push({ filename, language: lang, relativePath, content });
    }
  };

  if (!language || language === 'java') {
    await addFiles(path.join(moduleDir, 'exercises'),              ['.java'], 'java');
    await addFiles(path.join(moduleDir, 'samples', 'java'),        ['.java'], 'java');
  }
  if (!language || language === 'javascript') {
    await addFiles(path.join(moduleDir, 'exercises'),              ['.js'], 'javascript');
    await addFiles(path.join(moduleDir, 'samples', 'javascript'),  ['.js'], 'javascript');
  }

  return files;
};

/**
 * Scans the modules directory and returns sorted module directory names.
 * @returns {Promise<string[]>}
 */
const scanModuleDirectories = async () => {
  const entries = await fs.readdir(MODULES_DIR, { withFileTypes: true });
  return entries
    .filter(e => e.isDirectory() && MODULE_DIR_REGEX.test(e.name))
    .map(e => e.name)
    .sort();
};

/**
 * Returns metadata for all workshop modules.
 * @param {string|undefined} language - Optional language filter
 * @returns {Promise<ModuleMetadata[]>}
 */
const listModules = async (language) => {
  const dirNames = await scanModuleDirectories();

  const modules = await Promise.all(dirNames.map(async (dirName) => {
    const moduleDir = path.join(MODULES_DIR, dirName);
    const match     = dirName.match(MODULE_DIR_REGEX);
    const order     = parseInt(match[1], 10);

    let title = dirName, duration = '', format = '', description = '';
    try {
      const readmeContent = await fs.readFile(path.join(moduleDir, 'README.md'), 'utf-8');
      ({ title, duration, format, description } = parseReadmeMetadata(readmeContent));
    } catch { /* README may not exist */ }

    const { hasJava, hasJavaScript } = await detectAvailableLanguages(moduleDir);
    const languages = [];
    if (hasJava)       languages.push('java');
    if (hasJavaScript) languages.push('javascript');

    return { id: dirName, order, title, duration, format, description,
             languages, hasJava, hasJavaScript };
  }));

  if (language) return modules.filter(m => m.languages.includes(language));
  return modules;
};

/**
 * Returns full detail for one module.
 * @param {string} moduleId
 * @param {string|undefined} language
 * @returns {Promise<ModuleDetail>}
 * @throws {ModuleNotFoundError}
 */
const getModule = async (moduleId, language) => {
  const moduleDir    = path.join(MODULES_DIR, moduleId);
  const resolvedDir  = path.resolve(moduleDir);
  const resolvedBase = path.resolve(MODULES_DIR);

  if (!resolvedDir.startsWith(resolvedBase + path.sep)) {
    throw new ModuleNotFoundError(moduleId);
  }
  if (!(await pathExists(moduleDir))) {
    throw new ModuleNotFoundError(moduleId);
  }

  const match = moduleId.match(MODULE_DIR_REGEX);
  const order = match ? parseInt(match[1], 10) : 0;

  let title = moduleId, duration = '', format = '', description = '', readmeHtml = '';
  try {
    const readmeContent = await fs.readFile(path.join(moduleDir, 'README.md'), 'utf-8');
    ({ title, duration, format, description } = parseReadmeMetadata(readmeContent));
    readmeHtml = renderMarkdown(readmeContent);
  } catch { /* README may not exist */ }

  const { hasJava, hasJavaScript } = await detectAvailableLanguages(moduleDir);
  const languages = [];
  if (hasJava)       languages.push('java');
  if (hasJavaScript) languages.push('javascript');

  const codeFiles = await collectCodeFiles(moduleDir, language);

  return { id: moduleId, order, title, duration, format, description,
           languages, hasJava, hasJavaScript, readmeHtml, codeFiles };
};

module.exports = { listModules, getModule, parseReadmeMetadata };
