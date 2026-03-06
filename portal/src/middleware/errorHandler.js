'use strict';

/**
 * Express error-handling middleware.
 * Maps err.statusCode to HTTP response status.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? 'Internal Server Error';

  res.status(statusCode).render('error', {
    title: `Error ${statusCode}`,
    statusCode,
    message,
  });
};

module.exports = { errorHandler };
