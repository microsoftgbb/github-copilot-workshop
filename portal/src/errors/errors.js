class ModuleNotFoundError extends Error {
  constructor(moduleId) {
    super(`Module '${moduleId}' not found`);
    this.name = 'ModuleNotFoundError';
    this.moduleId = moduleId;
    this.statusCode = 404;
  }
}

class InvalidLanguageError extends Error {
  constructor(language) {
    super(`language must be 'java' or 'javascript', got: '${language}'`);
    this.name = 'InvalidLanguageError';
    this.language = language;
    this.statusCode = 400;
  }
}

class InvalidModuleIdError extends Error {
  constructor(moduleId) {
    super(`Invalid moduleId format: '${moduleId}'`);
    this.name = 'InvalidModuleIdError';
    this.moduleId = moduleId;
    this.statusCode = 400;
  }
}

module.exports = { ModuleNotFoundError, InvalidLanguageError, InvalidModuleIdError };
