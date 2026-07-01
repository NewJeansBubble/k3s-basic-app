import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { lenght: 100 }).notNull(),
  email: varchar('email', { lenght: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
