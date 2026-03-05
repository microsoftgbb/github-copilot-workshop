/**
 * Express error-handling middleware.
 * Maps domain errors to HTTP responses using their statusCode property.
 * Never exposes stack traces to clients.
 * @param {Error} err
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.name, message: err.message });
  }
  console.error(JSON.stringify({
    correlationId: req.correlationId,
    error: err.message,
    stack: err.stack,
  }));
  return res.status(500).json({ error: 'InternalServerError', message: 'An unexpected error occurred' });
};

module.exports = { errorHandler };
