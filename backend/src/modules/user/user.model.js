import { integer, pgTable, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  role: userRoleEnum('role').default('USER').notNull(),
  passwordHash: varchar('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
