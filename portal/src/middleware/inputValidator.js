const { InvalidLanguageError, InvalidModuleIdError } = require('../errors/errors');

const VALID_LANGUAGES = new Set(['java', 'javascript']);
const MODULE_ID_REGEX = /^module-\d{2}-[a-z0-9-]+$/;

/**
 * Validates and normalises a language query parameter.
 * @param {string|undefined} language
 * @returns {string|undefined}
 * @throws {InvalidLanguageError}
 */
const validateLanguage = (language) => {
  if (language === undefined || language === '') return undefined;
  const normalized = language.toLowerCase();
  if (!VALID_LANGUAGES.has(normalized)) throw new InvalidLanguageError(language);
  return normalized;
};

/**
 * Validates a moduleId path parameter.
 * @param {string} moduleId
 * @throws {InvalidModuleIdError}
 */
const validateModuleId = (moduleId) => {
  if (!MODULE_ID_REGEX.test(moduleId)) throw new InvalidModuleIdError(moduleId);
};

module.exports = { validateLanguage, validateModuleId };
