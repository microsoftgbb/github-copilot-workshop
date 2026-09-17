'use strict';

/**
 * Error thrown when a requested resource is not found.
 */
class NotFoundError extends Error {
  /**
   * @param {string} message - Human-readable error message
   */
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when request validation fails.
 */
class ValidationError extends Error {
  /**
   * @param {string} message - Human-readable error message
   */
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = { NotFoundError, ValidationError };
