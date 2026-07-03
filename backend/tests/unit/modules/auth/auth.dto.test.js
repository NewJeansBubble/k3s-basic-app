import { describe, expect, test } from 'bun:test';
import { loginDto } from '../../../../src/modules/auth/auth.dto.js';

describe('loginDto', () => {
  test('accepts valid credentials and normalizes the email', () => {
    const result = loginDto.safeParse({
      email: 'TEST@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('rejects an invalid email', () => {
    const result = loginDto.safeParse({
      email: 'invalid-email',
      password: 'password123',
    });

    expect(result.success).toBe(false);
  });

  test('rejects an empty password', () => {
    const result = loginDto.safeParse({
      email: 'test@example.com',
      password: '',
    });

    expect(result.success).toBe(false);
  });

  test('rejects unknown fields', () => {
    const result = loginDto.safeParse({
      email: 'test@example.com',
      password: 'password123',
      role: 'ADMIN',
    });

    expect(result.success).toBe(false);
  });
});
