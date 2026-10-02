const { errorHandler } = require('../../../src/middleware/errorHandler');
const { ModuleNotFoundError, InvalidLanguageError, InvalidModuleIdError } = require('../../../src/errors/errors');

// Minimal express-like mocks
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};
const mockReq = (id = 'test-id') => ({ correlationId: id });
const mockNext = () => jest.fn();

describe('errorHandler', () => {
  it('should return 404 for ModuleNotFoundError', () => {
    const res = mockRes();
    const err = new ModuleNotFoundError('module-01-test');
    errorHandler(err, mockReq(), res, mockNext());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'ModuleNotFoundError' }));
  });

  it('should return 400 for InvalidLanguageError', () => {
    const res = mockRes();
    const err = new InvalidLanguageError('cobol');
    errorHandler(err, mockReq(), res, mockNext());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'InvalidLanguageError' }));
  });

  it('should return 400 for InvalidModuleIdError', () => {
    const res = mockRes();
    const err = new InvalidModuleIdError('../../etc/passwd');
    errorHandler(err, mockReq(), res, mockNext());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'InvalidModuleIdError' }));
  });

  it('should return 500 with generic message for unknown errors', () => {
    const res = mockRes();
    const err = new Error('Something blew up');
    errorHandler(err, mockReq(), res, mockNext());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'InternalServerError' }));
  });

  it('should not expose stack traces in the response body', () => {
    const res = mockRes();
    const err = new Error('internal');
    errorHandler(err, mockReq(), res, mockNext());
    const body = res.json.mock.calls[0][0];
    expect(JSON.stringify(body)).not.toContain('stack');
  });
});
