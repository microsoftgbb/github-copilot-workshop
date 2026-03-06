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
  }
}

module.exports = { NotFoundError, ValidationError };
