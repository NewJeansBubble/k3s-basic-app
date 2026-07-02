import { SignJWT, jwtVerify } from 'jose';

const secretValue = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN ?? '1h';

if (!secretValue || secretValue.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters');
}

const secret = new TextEncoder().encode(secretValue);

export async function createAccessToken({ id, role }) {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(id))
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyAccessToken(token) {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ['HS256'],
  });

  const userId = Number(payload.sub);
  const role = payload.role;

  if (!Number.isInteger(userId) || userId <= 0 || !['USER', 'ADMIN'].includes(role)) {
    throw new Error('Invalid access token payload');
  }

  return { userId, role };
}
