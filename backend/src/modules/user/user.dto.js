import * as z from 'zod';

const nameSchema = z.string().trim().min(2).max(100);

const emailSchema = z.email().transform((email) => email.toLowerCase());

const passwordSchema = z.string().min(8).max(128);

export const createUserDto = z.strictObject({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const updateUserDto = z
  .strictObject({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided',
  });
