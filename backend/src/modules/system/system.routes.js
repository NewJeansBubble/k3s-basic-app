import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import { getSystemInfo } from './system.controller.js';

export const systemRoutes = Router();

systemRoutes.get('/info', authenticate, getSystemInfo);
