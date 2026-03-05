const { v4: uuidv4 } = require('uuid');

/**
 * Express middleware that attaches a correlation ID to each request
 * and emits structured request/response log entries.
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const requestLogger = (req, res, next) => {
  const correlationId = uuidv4();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);

  const start = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    console.log(JSON.stringify({
      correlationId,
      method:     req.method,
      path:       req.path,
      statusCode: res.statusCode,
      durationMs,
    }));
  });

  next();
};

module.exports = { requestLogger };
