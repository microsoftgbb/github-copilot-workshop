jest.mock('../../../src/services/moduleService');

const request = require('supertest');
const { createApp } = require('../../../src/app');
const { listModules, getModule } = require('../../../src/services/moduleService');
const { ModuleNotFoundError } = require('../../../src/errors/errors');

const MOCK_MODULE = {
  id: 'module-00-welcome',
  order: 0,
  title: 'Welcome & Foundations',
  duration: '15 minutes',
  format: 'Presentation',
  description: 'Intro',
  languages: [],
  hasJava: false,
  hasJavaScript: false,
  readmeHtml: '<p>html</p>',
  codeFiles: [],
};

describe('GET /api/modules', () => {
  let app;
  beforeEach(() => { app = createApp(); jest.clearAllMocks(); });

  it('should return 200 with modules array', async () => {
    listModules.mockResolvedValue([MOCK_MODULE]);
    const res = await request(app).get('/api/modules');
    expect(res.status).toBe(200);
    expect(res.body.modules).toHaveLength(1);
    expect(res.body.modules[0].id).toBe('module-00-welcome');
  });

  it('should pass language filter to listModules', async () => {
    listModules.mockResolvedValue([]);
    await request(app).get('/api/modules?language=java');
    expect(listModules).toHaveBeenCalledWith('java');
  });

  it('should return 400 for an invalid language', async () => {
    const res = await request(app).get('/api/modules?language=cobol');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('InvalidLanguageError');
  });
});

describe('GET /api/modules/:moduleId', () => {
  let app;
  beforeEach(() => { app = createApp(); jest.clearAllMocks(); });

  it('should return 200 with module detail', async () => {
    getModule.mockResolvedValue(MOCK_MODULE);
    const res = await request(app).get('/api/modules/module-00-welcome');
    expect(res.status).toBe(200);
    expect(res.body.module.id).toBe('module-00-welcome');
  });

  it('should return 400 for an invalid moduleId format', async () => {
    const res = await request(app).get('/api/modules/INVALID_ID');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('InvalidModuleIdError');
  });

  it('should return 404 when module does not exist', async () => {
    getModule.mockRejectedValue(new ModuleNotFoundError('module-99-nope'));
    const res = await request(app).get('/api/modules/module-99-nope');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('ModuleNotFoundError');
  });

  it('should return 400 for invalid language filter on module detail', async () => {
    const res = await request(app).get('/api/modules/module-00-welcome?language=ruby');
    expect(res.status).toBe(400);
  });
});
