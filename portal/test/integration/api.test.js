const request = require('supertest');
const { createApp } = require('../../src/app');

describe('Integration: API endpoints against real modules directory', () => {
  let app;
  beforeAll(() => { app = createApp(); });

  describe('GET /api/health', () => {
    it('should return 200 ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('GET /api/modules', () => {
    it('should return the real workshop modules', async () => {
      const res = await request(app).get('/api/modules');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.modules)).toBe(true);
      expect(res.body.modules.length).toBeGreaterThan(0);
    });

    it('each module should have id, title and languages fields', async () => {
      const res = await request(app).get('/api/modules');
      res.body.modules.forEach(mod => {
        expect(mod).toHaveProperty('id');
        expect(mod).toHaveProperty('title');
        expect(mod).toHaveProperty('languages');
      });
    });

    it('should filter by java language', async () => {
      const res = await request(app).get('/api/modules?language=java');
      expect(res.status).toBe(200);
      res.body.modules.forEach(mod => expect(mod.hasJava).toBe(true));
    });

    it('should filter by javascript language', async () => {
      const res = await request(app).get('/api/modules?language=javascript');
      expect(res.status).toBe(200);
      res.body.modules.forEach(mod => expect(mod.hasJavaScript).toBe(true));
    });
  });

  describe('GET /api/modules/module-00-welcome', () => {
    it('should return the welcome module with readmeHtml', async () => {
      const res = await request(app).get('/api/modules/module-00-welcome');
      expect(res.status).toBe(200);
      expect(res.body.module.id).toBe('module-00-welcome');
      expect(res.body.module.readmeHtml).toContain('<h1>');
    });
  });

  describe('error handling', () => {
    it('should return 404 for a non-existent module', async () => {
      const res = await request(app).get('/api/modules/module-99-nonexistent');
      expect(res.status).toBe(404);
    });

    it('should return 400 for an invalid moduleId', async () => {
      const res = await request(app).get('/api/modules/INVALID_ID');
      expect(res.status).toBe(400);
    });

    it('should return 400 for an invalid language', async () => {
      const res = await request(app).get('/api/modules?language=cobol');
      expect(res.status).toBe(400);
    });
  });
});
