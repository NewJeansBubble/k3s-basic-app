import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { users } from './user.model.js';

const publicUserFields = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt,
};

export async function findUserByEmail(email) {
  const [user] = await db
    .select(publicUserFields)
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}

export async function findUserById(id) {
  const [user] = await db.select(publicUserFields).from(users).where(eq(users.id, id)).limit(1);

  return user ?? null;
}

export async function createUser({ name, email, passwordHash }) {
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
    })
    .returning(publicUserFields);

  return user;
}

export async function updateUserById(id, { name, email }) {
  const changes = {};

  if (name !== undefined) {
    changes.name = name;
  }
  if (email !== undefined) {
    changes.email = email;
  }

  const [user] = await db
    .update(users)
    .set(changes)
    .where(eq(users.id, id))
    .returning(publicUserFields);

  return user ?? null;
}

export async function deleteUserById(id) {
  const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });

  return deletedUser ?? null;
}
