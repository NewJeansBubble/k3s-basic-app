import { UserEmailAlreadyExistsError, UserNotFoundError } from './user.errors.js';
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

export async function findUserById(id) {
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

export async function updateUserById(id, changes) {
  const currentUser = await userRepository.findUserById(id);

  if (!currentUser) {
    throw new UserNotFoundError();
  }

  if (changes.email) {
    const userWithEmail = await userRepository.findUserByEmail(changes.email);

    if (userWithEmail && userWithEmail.id !== id) {
      throw new UserEmailAlreadyExistsError();
    }
  }

  return userRepository.updateUserById(id, changes);
}

export async function deleteUserById(id) {
  const deletedUser = await userRepository.deleteUserById(id);

  if (!deletedUser) {
    throw new UserNotFoundError();
  }
}
