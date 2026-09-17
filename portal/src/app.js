const express = require('express');
const path    = require('path');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler }  = require('./middleware/errorHandler');
const { healthRouter }  = require('./routes/healthRoutes');
const { moduleRouter }  = require('./routes/moduleRoutes');

/**
 * Creates and configures the Express application.
 * Exported as a factory function for testability with supertest.
 * @returns {import('express').Application}
 */
const createApp = () => {
  const app = express();
  app.use(requestLogger);
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/api', healthRouter);
  app.use('/api', moduleRouter);
  app.use(errorHandler);
  return app;
};

module.exports = { createApp };
