'use strict';

const request = require('supertest');
const { app } = require('../src/app');

describe('routes', () => {
  test('GET / should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET /modules should return 200', async () => {
    const res = await request(app).get('/modules');
    expect(res.statusCode).toBe(200);
  });

  test('GET /modules/module-01-core-experience should return 200', async () => {
    const res = await request(app).get('/modules/module-01-core-experience');
    expect(res.statusCode).toBe(200);
  });

  test('GET /modules/nonexistent should return 404', async () => {
    const res = await request(app).get('/modules/nonexistent');
    expect(res.statusCode).toBe(404);
  });

  test('GET /agenda with query params should return 200', async () => {
    const res = await request(app)
      .get('/agenda')
      .query({ selectedModules: 'module-01-core-experience', language: 'javascript' });
    expect(res.statusCode).toBe(200);
  });

  test('POST /agenda should redirect to GET /agenda', async () => {
    // First fetch the home page to obtain the CSRF cookie and token
    const agent = request.agent(app);
    const getRes = await agent.get('/');
    expect(getRes.statusCode).toBe(200);

    // Extract CSRF token from the rendered form
    const tokenMatch = getRes.text.match(/name="_csrf"\s+value="([^"]+)"/);
    const csrfToken = tokenMatch?.[1] ?? '';

    const res = await agent
      .post('/agenda')
      .send(`language=java&selectedModules=module-01-core-experience&_csrf=${encodeURIComponent(csrfToken)}`)
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toContain('/agenda');
    expect(res.headers.location).toContain('language=java');
    expect(res.headers.location).toContain('selectedModules=module-01-core-experience');
  });
});
