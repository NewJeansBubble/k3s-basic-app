import { describe, expect, test } from 'bun:test';
import { createUserDto, updateUserDto } from '../../../../src/modules/user/user.dto.js';

describe('createUserDto', () => {
  test('accepts and transforms valid user data', () => {
    const input = {
      name: '  Test User  ',
      email: 'TEST@example.com',
      password: 'password123',
    };

    const result = createUserDto.safeParse(input);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('rejects an invalid email', () => {
    const result = createUserDto.safeParse({
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    });

    expect(result.success).toBe(false);
  });

  test('rejects a short password', () => {
    const result = createUserDto.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: '123',
    });

    expect(result.success).toBe(false);
  });

  test('rejects unknown fields', () => {
    const result = createUserDto.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'ADMIN',
    });

    expect(result.success).toBe(false);
  });
});

describe('updateUserDto', () => {
  test('accepts a partial update', () => {
    const result = updateUserDto.safeParse({
      name: 'Updated User',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      name: 'Updated User',
    });
  });

  test('normalizes an updated email', () => {
    const result = updateUserDto.safeParse({
      email: 'UPDATED@example.com',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      email: 'updated@example.com',
    });
  });

  test('rejects an empty update', () => {
    const result = updateUserDto.safeParse({});

    expect(result.success).toBe(false);
  });

  test('rejects fields that cannot be updated', () => {
    const result = updateUserDto.safeParse({
      role: 'ADMIN',
    });

    expect(result.success).toBe(false);
  });
});
