const request = require('supertest');
const { createApp } = require('../../../src/app');

describe('GET /api/health', () => {
  let app;
  beforeEach(() => { app = createApp(); });

  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should include a timestamp in ISO format', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should return a X-Correlation-ID header', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-correlation-id']).toBeDefined();
  });
});
