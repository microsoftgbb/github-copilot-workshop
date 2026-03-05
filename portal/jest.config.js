/** @type {import('jest').Config} */
const config = {
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
  testEnvironment: 'node',
};
module.exports = config;
