import { Router } from 'express';
import { Auth } from './auth.js';
import { toNodeHandler } from 'better-auth/node';

export function createBetterAuthRoutes(auth: Auth) {
  const router = Router();
  router.all('/api/auth/*splat', toNodeHandler(auth));
  return router;
}
