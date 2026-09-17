const { createApp } = require('./app');
const { PORT }      = require('./config/config');

const app = createApp();
const server = app.listen(PORT, () => {
  console.log(JSON.stringify({ event: 'server_start', port: PORT }));
});

/**
 * Gracefully shuts down the HTTP server on the given signal.
 * @param {string} signal
 */
const shutdown = (signal) => {
  console.log(JSON.stringify({ event: 'shutdown', signal }));
  server.close(() => process.exit(0));
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error(JSON.stringify({ event: 'unhandledRejection', reason: String(reason) }));
  process.exit(1);
});
