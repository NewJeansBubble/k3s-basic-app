import { describe, expect, mock, test } from 'bun:test';
import * as z from 'zod';
import { ValidationError } from '../../../src/shared/errors/validation.error.js';
import { validateBody } from '../../../src/shared/middleware/validate.middleware.js';

const schema = z.strictObject({
  name: z.string().trim().min(2),
});

describe('validateBody', () => {
  test('replaces the body with validated data', () => {
    const req = {
      body: {
        name: '  Test User  ',
      },
    };
    const next = mock();

    validateBody(schema)(req, {}, next);

    expect(req.body).toEqual({
      name: 'Test User',
    });
    expect(next).toHaveBeenCalledWith();
  });

  test('passes validation errors to the next middleware', () => {
    const req = {
      body: {
        name: '',
      },
    };
    const next = mock();

    validateBody(schema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.details[0].field).toBe('name');
  });
});
