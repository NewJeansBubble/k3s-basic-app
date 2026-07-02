import { Router } from 'express';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { createUser, deleteUser, findUserById, updateUser } from './user.controller.js';
import { createUserDto, updateUserDto } from './user.dto.js';

export const userRoutes = Router();

userRoutes.post('/', validateBody(createUserDto), createUser);
userRoutes.get('/:id', findUserById);
userRoutes.patch('/:id', validateBody(updateUserDto), updateUser);
userRoutes.delete('/:id', deleteUser);
