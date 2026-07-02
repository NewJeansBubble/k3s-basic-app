import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { users } from '../user/user.model.js';

const authUserFields = {
  id: users.id,
  name: users.name,
  email: users.email,
  passwordHash: users.passwordHash,
  role: users.role,
};

export async function findCredentialsByEmail(email) {
  const [user] = await db.select(authUserFields).from(users).where(eq(users.email, email)).limit(1);

  return user ?? null;
}
