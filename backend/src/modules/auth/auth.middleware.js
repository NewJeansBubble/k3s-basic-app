import { UnauthorizedError } from './auth.errors.js';
import { verifyAccessToken } from './token.service.js';

export async function authenticate(req, _res, next) {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(' ') ?? [];

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return next(new UnauthorizedError());
  }

  try {
    req.auth = await verifyAccessToken(token);
    return next();
  } catch {
    return next(new UnauthorizedError());
  }
}
