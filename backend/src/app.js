import express from 'express';
import { userRoutes } from './modules/user/user.routes.js';
import { errorHandler } from './shared/middleware/error.handler.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { systemRoutes } from './modules/system/system.routes.js';
import { corsMiddleware } from './shared/middleware/cors.middleware.js';

const app = express();
const port = process.env.PORT;

app.use(corsMiddleware);
app.use(express.json());

app.get('/', (_req, res) => {
  return res.json({ message: 'Hello World' });
});

app.use('/api/auth', authRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`API is running at port ${port}`);
});
