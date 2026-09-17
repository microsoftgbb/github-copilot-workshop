'use strict';

const { validateLanguage, validateModuleId } = require('../../../src/middleware/inputValidator');
const { InvalidLanguageError, InvalidModuleIdError } = require('../../../src/errors/errors');

describe('validateModuleId', () => {
  describe('when given a well-formed moduleId', () => {
    it('should not throw for a standard module ID', () => {
      expect(() => validateModuleId('module-01-core-experience')).not.toThrow();
    });

    it('should not throw for a zero-prefixed module ID', () => {
      expect(() => validateModuleId('module-00-welcome')).not.toThrow();
    });

    it('should not throw for a module ID with numbers in the slug', () => {
      expect(() => validateModuleId('module-06-wrapup')).not.toThrow();
    });
  });

  describe('when given an invalid moduleId', () => {
    it('should throw InvalidModuleIdError for a path traversal attempt', () => {
      expect(() => validateModuleId('../etc/passwd')).toThrow(InvalidModuleIdError);
    });

    it('should throw InvalidModuleIdError for uppercase characters', () => {
      expect(() => validateModuleId('Module-01-core')).toThrow(InvalidModuleIdError);
    });

    it('should throw InvalidModuleIdError for an empty string', () => {
      expect(() => validateModuleId('')).toThrow(InvalidModuleIdError);
    });

    it('should throw InvalidModuleIdError for a plain string without prefix', () => {
      expect(() => validateModuleId('core-experience')).toThrow(InvalidModuleIdError);
    });

    it('should throw InvalidModuleIdError for IDs with special characters', () => {
      expect(() => validateModuleId('module-01-core<script>')).toThrow(InvalidModuleIdError);
    });

    it('should throw InvalidModuleIdError for IDs with spaces', () => {
      expect(() => validateModuleId('module-01 core')).toThrow(InvalidModuleIdError);
    });
  });
});

describe('validateLanguage', () => {
  describe('when given valid input', () => {
    it('should return undefined for undefined input', () => {
      expect(validateLanguage(undefined)).toBeUndefined();
    });

    it('should return undefined for an empty string', () => {
      expect(validateLanguage('')).toBeUndefined();
    });

    it('should return "java" for lowercase input', () => {
      expect(validateLanguage('java')).toBe('java');
    });

    it('should return "javascript" for lowercase input', () => {
      expect(validateLanguage('javascript')).toBe('javascript');
    });

    it('should normalise "JAVA" to "java"', () => {
      expect(validateLanguage('JAVA')).toBe('java');
    });

    it('should normalise "JavaScript" to "javascript"', () => {
      expect(validateLanguage('JavaScript')).toBe('javascript');
    });
  });

  describe('when given an unsupported language', () => {
    it('should throw InvalidLanguageError for an unknown language', () => {
      expect(() => validateLanguage('cobol')).toThrow(InvalidLanguageError);
    });

    it('should throw InvalidLanguageError for a numeric string', () => {
      expect(() => validateLanguage('123')).toThrow(InvalidLanguageError);
    });

    it('should include the invalid language in the error', () => {
      const err = (() => {
        try { validateLanguage('python'); } catch (e) { return e; }
      })();
      expect(err).toBeInstanceOf(InvalidLanguageError);
      expect(err.language).toBe('python');
    });
  });
});
