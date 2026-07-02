import { Router } from 'express';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { createUser, deleteUser, findUserById, updateUser } from './user.controller.js';
import { createUserDto, updateUserDto } from './user.dto.js';
import { authenticate } from '../auth/auth.middleware.js';

export const userRoutes = Router();

userRoutes.post('/', validateBody(createUserDto), createUser);
userRoutes.get('/:id', authenticate, findUserById);
userRoutes.patch('/:id', authenticate, validateBody(updateUserDto), updateUser);
userRoutes.delete('/:id', authenticate, deleteUser);
