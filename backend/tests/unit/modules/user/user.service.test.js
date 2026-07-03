import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import {
  UserAccessDeniedError,
  UserEmailAlreadyExistsError,
  UserNotFoundError,
} from '../../../../src/modules/user/user.errors.js';

const repositoryMocks = {
  findUserByEmail: mock(),
  findUserById: mock(),
  createUser: mock(),
  updateUserById: mock(),
  deleteUserById: mock(),
};

mock.module('../../../../src/modules/user/user.repository.js', () => repositoryMocks);

const { createUser, deleteUserById, findUserByEmail, findUserById, updateUserById } =
  await import('../../../../src/modules/user/user.service.js');

const user = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER',
};

const owner = {
  userId: user.id,
  role: 'USER',
};

const admin = {
  userId: 99,
  role: 'ADMIN',
};

const otherUser = {
  userId: 2,
  role: 'USER',
};

let passwordHashSpy;

beforeEach(() => {
  for (const repositoryMock of Object.values(repositoryMocks)) {
    repositoryMock.mockReset();
  }

  passwordHashSpy = spyOn(Bun.password, 'hash').mockResolvedValue('hashed-password');
});

afterEach(() => {
  passwordHashSpy.mockRestore();
});

describe('createUser', () => {
  const input = {
    name: user.name,
    email: user.email,
    password: 'password123',
  };

  test('creates a user with a hashed password', async () => {
    repositoryMocks.findUserByEmail.mockResolvedValue(null);
    repositoryMocks.createUser.mockResolvedValue(user);

    const result = await createUser(input);

    expect(repositoryMocks.findUserByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordHashSpy).toHaveBeenCalledWith(input.password, {
      algorithm: 'argon2id',
    });
    expect(repositoryMocks.createUser).toHaveBeenCalledWith({
      name: input.name,
      email: input.email,
      passwordHash: 'hashed-password',
    });
    expect(result).toEqual(user);
  });

  test('rejects an email that is already in use', async () => {
    repositoryMocks.findUserByEmail.mockResolvedValue(user);

    await expect(createUser(input)).rejects.toBeInstanceOf(UserEmailAlreadyExistsError);

    expect(passwordHashSpy).not.toHaveBeenCalled();
    expect(repositoryMocks.createUser).not.toHaveBeenCalled();
  });
});

describe('findUserById', () => {
  test('returns the user to its owner', async () => {
    repositoryMocks.findUserById.mockResolvedValue(user);

    await expect(findUserById(user.id, owner)).resolves.toEqual(user);
    expect(repositoryMocks.findUserById).toHaveBeenCalledWith(user.id);
  });

  test('allows an admin to find another user', async () => {
    repositoryMocks.findUserById.mockResolvedValue(user);

    await expect(findUserById(user.id, admin)).resolves.toEqual(user);
  });

  test('rejects access from another user', async () => {
    await expect(findUserById(user.id, otherUser)).rejects.toBeInstanceOf(UserAccessDeniedError);

    expect(repositoryMocks.findUserById).not.toHaveBeenCalled();
  });

  test('throws when the user does not exist', async () => {
    repositoryMocks.findUserById.mockResolvedValue(null);

    await expect(findUserById(user.id, owner)).rejects.toBeInstanceOf(UserNotFoundError);
  });
});

describe('findUserByEmail', () => {
  test('returns a user by email', async () => {
    repositoryMocks.findUserByEmail.mockResolvedValue(user);

    await expect(findUserByEmail(user.email)).resolves.toEqual(user);
  });

  test('throws when the email does not exist', async () => {
    repositoryMocks.findUserByEmail.mockResolvedValue(null);

    await expect(findUserByEmail(user.email)).rejects.toBeInstanceOf(UserNotFoundError);
  });
});

describe('updateUserById', () => {
  test('allows the owner to update its name', async () => {
    const changes = { name: 'Updated User' };
    const updatedUser = { ...user, ...changes };

    repositoryMocks.updateUserById.mockResolvedValue(updatedUser);

    const result = await updateUserById(user.id, changes, owner);

    expect(repositoryMocks.findUserByEmail).not.toHaveBeenCalled();
    expect(repositoryMocks.updateUserById).toHaveBeenCalledWith(user.id, changes);
    expect(result).toEqual(updatedUser);
  });

  test('allows an admin to update another user', async () => {
    const changes = { name: 'Updated by Admin' };
    const updatedUser = { ...user, ...changes };

    repositoryMocks.updateUserById.mockResolvedValue(updatedUser);

    await expect(updateUserById(user.id, changes, admin)).resolves.toEqual(updatedUser);
  });

  test('rejects an update from another user', async () => {
    await expect(updateUserById(user.id, { name: 'Blocked' }, otherUser)).rejects.toBeInstanceOf(
      UserAccessDeniedError,
    );

    expect(repositoryMocks.updateUserById).not.toHaveBeenCalled();
  });

  test('rejects an email used by another user', async () => {
    const changes = { email: 'used@example.com' };

    repositoryMocks.findUserByEmail.mockResolvedValue({
      ...user,
      id: 2,
      email: changes.email,
    });

    await expect(updateUserById(user.id, changes, owner)).rejects.toBeInstanceOf(
      UserEmailAlreadyExistsError,
    );

    expect(repositoryMocks.updateUserById).not.toHaveBeenCalled();
  });

  test('allows the user to keep its current email', async () => {
    const changes = { email: user.email };

    repositoryMocks.findUserByEmail.mockResolvedValue(user);
    repositoryMocks.updateUserById.mockResolvedValue(user);

    await expect(updateUserById(user.id, changes, owner)).resolves.toEqual(user);
    expect(repositoryMocks.updateUserById).toHaveBeenCalledWith(user.id, changes);
  });

  test('throws when the user to update does not exist', async () => {
    repositoryMocks.updateUserById.mockResolvedValue(null);

    await expect(updateUserById(user.id, { name: 'Updated User' }, owner)).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
  });
});

describe('deleteUserById', () => {
  test('allows the owner to delete itself', async () => {
    repositoryMocks.deleteUserById.mockResolvedValue({ id: user.id });

    await expect(deleteUserById(user.id, owner)).resolves.toBeUndefined();
    expect(repositoryMocks.deleteUserById).toHaveBeenCalledWith(user.id);
  });

  test('rejects deletion from another user', async () => {
    await expect(deleteUserById(user.id, otherUser)).rejects.toBeInstanceOf(UserAccessDeniedError);

    expect(repositoryMocks.deleteUserById).not.toHaveBeenCalled();
  });

  test('throws when the user to delete does not exist', async () => {
    repositoryMocks.deleteUserById.mockResolvedValue(null);

    await expect(deleteUserById(user.id, owner)).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
