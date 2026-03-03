jest.mock('fs/promises');
jest.mock('../../../src/utils/markdownParser');

const fs             = require('fs/promises');
const path           = require('path');
const { renderMarkdown } = require('../../../src/utils/markdownParser');
const { listModules, getModule, parseReadmeMetadata } = require('../../../src/services/moduleService');
const { ModuleNotFoundError } = require('../../../src/errors/errors');
const { MODULES_DIR } = require('../../../src/config/config');

const WELCOME_README = [
  '# Welcome & Foundations',
  '',
  '> **Duration:** 15 minutes | **Format:** Presentation',
  '',
  'Some description text here.',
].join('\n');

describe('parseReadmeMetadata', () => {
  it('should parse title, duration, format and description from a full README', () => {
    const result = parseReadmeMetadata(WELCOME_README);
    expect(result.title).toBe('Welcome & Foundations');
    expect(result.duration).toBe('15 minutes');
    expect(result.format).toBe('Presentation');
    expect(result.description).toBe('Some description text here.');
  });

  it('should return fallback values for a minimal README', () => {
    const result = parseReadmeMetadata('# Just a title');
    expect(result.title).toBe('Just a title');
    expect(result.duration).toBe('');
    expect(result.format).toBe('');
  });

  it('should return Untitled Module when there is no heading', () => {
    const result = parseReadmeMetadata('Some plain text');
    expect(result.title).toBe('Untitled Module');
    expect(result.description).toBe('Some plain text');
  });

  it('should return empty description when content has only headings and blockquotes', () => {
    const result = parseReadmeMetadata('# Title\n> blockquote only');
    expect(result.description).toBe('');
  });
});

describe('listModules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderMarkdown.mockReturnValue('<p>html</p>');
  });

  it('should return all modules sorted by order when no language filter is given', async () => {
    fs.readdir.mockImplementation(async (dir) => {
      if (dir === MODULES_DIR) {
        return [
          { name: 'module-01-core-experience', isDirectory: () => true },
          { name: 'module-00-welcome',          isDirectory: () => true },
        ];
      }
      return [];
    });
    fs.readFile.mockResolvedValue(WELCOME_README);
    fs.access.mockRejectedValue(new Error('ENOENT'));

    const modules = await listModules(undefined);
    expect(modules).toHaveLength(2);
    expect(modules[0].id).toBe('module-00-welcome');
    expect(modules[1].id).toBe('module-01-core-experience');
  });

  it('should filter modules by language', async () => {
    fs.readdir.mockImplementation(async (dir) => {
      if (dir === MODULES_DIR) {
        return [
          { name: 'module-00-welcome',          isDirectory: () => true },
          { name: 'module-01-core-experience', isDirectory: () => true },
        ];
      }
      if (dir.includes('module-01') && dir.includes('exercises')) {
        return ['orderService.js'];
      }
      return [];
    });
    fs.readFile.mockResolvedValue(WELCOME_README);
    fs.access.mockImplementation(async (p) => {
      if (p.includes('module-01') && p.includes('exercises')) return;
      throw new Error('ENOENT');
    });

    const modules = await listModules('javascript');
    expect(modules).toHaveLength(1);
    expect(modules[0].id).toBe('module-01-core-experience');
  });

  it('should return an empty array when no module directories exist', async () => {
    fs.readdir.mockResolvedValue([]);
    const modules = await listModules(undefined);
    expect(modules).toEqual([]);
  });
});

describe('getModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderMarkdown.mockReturnValue('<p>html</p>');
  });

  it('should return module detail for a valid moduleId', async () => {
    fs.access.mockResolvedValue(undefined);
    fs.readFile.mockResolvedValue(WELCOME_README);
    fs.readdir.mockResolvedValue([]);

    const mod = await getModule('module-00-welcome', undefined);
    expect(mod.id).toBe('module-00-welcome');
    expect(mod.title).toBe('Welcome & Foundations');
    expect(mod.readmeHtml).toBe('<p>html</p>');
  });

  it('should throw ModuleNotFoundError when the module directory does not exist', async () => {
    fs.access.mockRejectedValue(new Error('ENOENT'));

    await expect(getModule('module-00-welcome', undefined))
      .rejects.toBeInstanceOf(ModuleNotFoundError);
  });

  it('should throw ModuleNotFoundError for path traversal attempts', async () => {
    await expect(getModule('module-00-welcome/../../etc/passwd', undefined))
      .rejects.toBeInstanceOf(ModuleNotFoundError);
  });
});
