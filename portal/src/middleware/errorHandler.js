'use strict';

/**
 * Express error-handling middleware.
 * Maps err.statusCode to HTTP response status.
 * Only exposes error messages for known/intentional errors (those with statusCode).
 * Always logs errors server-side.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;

  // Always log - never swallow errors silently
  console.error(`[${new Date().toISOString()}] ${statusCode} ${req.method} ${req.path}`, err);

  // Only expose message for known, intentional errors (with explicit statusCode)
  const isTrusted = err.statusCode != null;
  const message = isTrusted ? err.message : 'An unexpected error occurred. Please try again.';

  res.status(statusCode).render('error', {
    title: `Error ${statusCode}`,
    statusCode,
    message,
  });
};

module.exports = { errorHandler };
