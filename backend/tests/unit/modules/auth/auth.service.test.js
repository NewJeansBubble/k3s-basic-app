import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { InvalidCredentialsError } from '../../../../src/modules/auth/auth.errors.js';

const findCredentialsByEmailMock = mock();

mock.module('../../../../src/modules/auth/auth.repository.js', () => ({
  findCredentialsByEmail: findCredentialsByEmailMock,
}));

process.env.JWT_SECRET ??= 'unit-test-secret-with-at-least-32-characters';

const tokenService = await import('../../../../src/modules/auth/token.service.js');

const { login } = await import('../../../../src/modules/auth/auth.service.js');

const credentials = {
  email: 'test@example.com',
  password: 'password123',
};

const userWithCredentials = {
  id: 1,
  name: 'Test User',
  email: credentials.email,
  passwordHash: 'hashed-password',
  role: 'USER',
};

let passwordVerifySpy;
let createAccessTokenSpy;

beforeEach(() => {
  findCredentialsByEmailMock.mockReset();
  passwordVerifySpy = spyOn(Bun.password, 'verify').mockResolvedValue(true);
  createAccessTokenSpy = spyOn(tokenService, 'createAccessToken').mockResolvedValue('access-token');
});

afterEach(() => {
  passwordVerifySpy.mockRestore();
  createAccessTokenSpy.mockRestore();
});

describe('login', () => {
  test('returns an access token and a public user', async () => {
    findCredentialsByEmailMock.mockResolvedValue(userWithCredentials);

    const result = await login(credentials);

    expect(findCredentialsByEmailMock).toHaveBeenCalledWith(credentials.email);
    expect(passwordVerifySpy).toHaveBeenCalledWith(
      credentials.password,
      userWithCredentials.passwordHash,
    );
    expect(createAccessTokenSpy).toHaveBeenCalledWith({
      id: userWithCredentials.id,
      role: userWithCredentials.role,
    });
    expect(result).toEqual({
      accessToken: 'access-token',
      user: {
        id: userWithCredentials.id,
        name: userWithCredentials.name,
        email: userWithCredentials.email,
        role: userWithCredentials.role,
      },
    });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  test('rejects an unknown email', async () => {
    findCredentialsByEmailMock.mockResolvedValue(null);

    await expect(login(credentials)).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(passwordVerifySpy).not.toHaveBeenCalled();
    expect(createAccessTokenSpy).not.toHaveBeenCalled();
  });

  test('rejects an invalid password', async () => {
    findCredentialsByEmailMock.mockResolvedValue(userWithCredentials);
    passwordVerifySpy.mockResolvedValue(false);

    await expect(login(credentials)).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(createAccessTokenSpy).not.toHaveBeenCalled();
  });
});
