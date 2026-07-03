import cors from 'cors';

const corsOrigin = process.env.CORS_ORIGIN;

if (!corsOrigin) {
  throw new Error('CORS_ORIGIN is required');
}

export const corsMiddleware = cors({
  origin: corsOrigin,
  methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});