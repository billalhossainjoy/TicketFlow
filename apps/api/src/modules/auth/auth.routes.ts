import { Router } from 'express';

import type { Auth } from './auth.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

export function createAuthRoutes(auth: Auth) {
  const router = Router();

  const authService = new AuthService(auth);
  const authController = new AuthController(authService);

  router.get('/me', authController.getCurrentUser);

  return router;
}
