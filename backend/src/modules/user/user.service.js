import {
  UserEmailAlreadyExistsError,
  UserNotFoundError,
  UserAccessDeniedError,
} from './user.errors.js';
import * as userRepository from './user.repository.js';

export async function createUser({ name, email, password }) {
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new UserEmailAlreadyExistsError();
  }

  const passwordHash = await Bun.password.hash(password, {
    algorithm: 'argon2id',
  });

  return userRepository.createUser({
    name,
    email,
    passwordHash,
  });
}

export async function findUserById(id, authenticatedUser) {
  ensureUserAccess(id, authenticatedUser);

  const user = await userRepository.findUserById(id);

  if (!user) {
    throw new UserNotFoundError();
  }

  return user;
}

export async function findUserByEmail(email) {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new UserNotFoundError();
  }

  return user;
}

export async function updateUserById(id, changes, authenticatedUser) {
  ensureUserAccess(id, authenticatedUser);

  if (changes.email !== undefined) {
    const userWithEmail = await userRepository.findUserByEmail(changes.email);

    if (userWithEmail && userWithEmail.id !== id) {
      throw new UserEmailAlreadyExistsError();
    }
  }

  const updatedUser = await userRepository.updateUserById(id, changes);

  if (!updatedUser) {
    throw new UserNotFoundError();
  }

  return updatedUser;
}

export async function deleteUserById(id, authenticatedUser) {
  ensureUserAccess(id, authenticatedUser);

  const deletedUser = await userRepository.deleteUserById(id);

  if (!deletedUser) {
    throw new UserNotFoundError();
  }
}

function ensureUserAccess(targetUserId, authenticatedUser) {
  const isOwner = authenticatedUser?.userId === targetUserId;
  const isAdmin = authenticatedUser?.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    throw new UserAccessDeniedError();
  }
}
