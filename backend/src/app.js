import express from 'express';
import { userRoutes } from './modules/user/user.routes.js';
import { errorHandler } from './shared/middleware/error.handler.js';
import { authRoutes } from './modules/auth/auth.routes.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (_req, res) => {
  return res.json({ message: 'Hello World' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Hello World, API is running at port ${port}`);
});
