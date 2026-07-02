import { InvalidCredentialsError } from './auth.errors.js';
import * as authRepository from './auth.repository.js';
import { createAccessToken } from './token.service.js';

export async function login({ email, password }) {
  const user = await authRepository.findCredentialsByEmail(email);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const passwordMatches = await Bun.password.verify(password, user.passwordHash);

  if (!passwordMatches) {
    throw new InvalidCredentialsError();
  }

  const accessToken = await createAccessToken({
    id: user.id,
    role: user.role,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
