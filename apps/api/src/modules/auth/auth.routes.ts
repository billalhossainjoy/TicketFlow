import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';

import type { Auth } from './auth.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

export function createAuthRoutes(auth: Auth) {
  const router = Router();

  const authService = new AuthService(auth);
  const authController = new AuthController(authService);

  router.all('/api/auth/*splat', toNodeHandler(auth));
  router.get('/api/v1/me', authController.getCurrentUser);

  return router;
}
