import { describe, expect, test } from 'bun:test';

process.env.JWT_SECRET ??= 'unit-test-secret-with-at-least-32-characters';
process.env.JWT_EXPIRES_IN ??= '1h';

const { createAccessToken, verifyAccessToken } =
  await import('../../../../src/modules/auth/token.service.js');

describe('token service', () => {
  test('creates and verifies an access token', async () => {
    const token = await createAccessToken({
      id: 1,
      role: 'USER',
    });

    await expect(verifyAccessToken(token)).resolves.toEqual({
      userId: 1,
      role: 'USER',
    });
  });

  test('rejects a token with an invalid signature', async () => {
    const token = await createAccessToken({
      id: 1,
      role: 'USER',
    });

    const [header, payload, signature] = token.split('.');
    const changedCharacter = signature[0] === 'a' ? 'b' : 'a';
    const tamperedToken = `${header}.${payload}.${changedCharacter}${signature.slice(1)}`;

    await expect(verifyAccessToken(tamperedToken)).rejects.toBeInstanceOf(Error);
  });

  test('rejects a token with an invalid user ID', async () => {
    const token = await createAccessToken({
      id: 0,
      role: 'USER',
    });

    await expect(verifyAccessToken(token)).rejects.toThrow('Invalid access token payload');
  });

  test('rejects a token with an invalid role', async () => {
    const token = await createAccessToken({
      id: 1,
      role: 'UNKNOWN',
    });

    await expect(verifyAccessToken(token)).rejects.toThrow('Invalid access token payload');
  });
});
