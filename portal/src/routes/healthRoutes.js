const express = require('express');

const healthRouter = express.Router();

/**
 * GET /api/health
 * Returns service liveness status.
 */
healthRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = { healthRouter };
