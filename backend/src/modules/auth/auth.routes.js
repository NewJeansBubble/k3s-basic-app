import { Router } from 'express';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { login } from './auth.controller.js';
import { loginDto } from './auth.dto.js';

export const authRoutes = Router();

authRoutes.post('/login', validateBody(loginDto), login);
