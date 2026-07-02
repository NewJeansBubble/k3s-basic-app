import * as z from 'zod';

export const loginDto = z.strictObject({
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(255),
});
