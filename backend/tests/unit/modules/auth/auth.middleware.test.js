import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { UnauthorizedError } from '../../../../src/modules/auth/auth.errors.js';

process.env.JWT_SECRET ??= 'unit-test-secret-with-at-least-32-characters';

const tokenService = await import('../../../../src/modules/auth/token.service.js');
const { authenticate } = await import('../../../../src/modules/auth/auth.middleware.js');

let verifyAccessTokenSpy;

beforeEach(() => {
  verifyAccessTokenSpy = spyOn(tokenService, 'verifyAccessToken');
});

afterEach(() => {
  verifyAccessTokenSpy.mockRestore();
});

describe('authenticate', () => {
  test('adds the authenticated user to the request', async () => {
    const req = {
      headers: {
        authorization: 'Bearer access-token',
      },
    };
    const next = mock();

    verifyAccessTokenSpy.mockResolvedValue({
      userId: 1,
      role: 'USER',
    });

    await authenticate(req, {}, next);

    expect(verifyAccessTokenSpy).toHaveBeenCalledWith('access-token');
    expect(req.auth).toEqual({
      userId: 1,
      role: 'USER',
    });
    expect(next).toHaveBeenCalledWith();
  });

  test('rejects a request without a Bearer token', async () => {
    const req = { headers: {} };
    const next = mock();

    await authenticate(req, {}, next);

    expect(verifyAccessTokenSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
  });

  test('rejects an invalid or expired token', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    };
    const next = mock();

    verifyAccessTokenSpy.mockRejectedValue(new Error('Invalid token'));

    await authenticate(req, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
  });
});
