import { afterEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { AppError } from '../../../src/shared/errors/app.error.js';
import { errorHandler } from '../../../src/shared/middleware/error.handler.js';

function createResponse(headersSent = false) {
  const res = {
    headersSent,
    status: mock(),
    json: mock(),
  };

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  return res;
}

let consoleErrorSpy;

afterEach(() => {
  consoleErrorSpy?.mockRestore();
});

describe('errorHandler', () => {
  test('returns a structured application error', () => {
    const error = new AppError('Not allowed', 403, 'FORBIDDEN', {
      reason: 'test',
    });
    const res = createResponse();
    const next = mock();

    errorHandler(error, {}, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'FORBIDDEN',
        message: 'Not allowed',
        details: {
          reason: 'test',
        },
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns a generic response for unexpected errors', () => {
    const error = new Error('Database unavailable');
    const res = createResponse();
    const next = mock();
    consoleErrorSpy = spyOn(console, 'error').mockImplementation(() => {});

    errorHandler(error, {}, res, next);

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    });
  });

  test('delegates when response headers were already sent', () => {
    const error = new Error('Late error');
    const res = createResponse(true);
    const next = mock();

    errorHandler(error, {}, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});
