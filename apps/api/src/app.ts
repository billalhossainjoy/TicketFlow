import express from 'express';
import { Logger } from 'pino';
import { requestContext } from './platform/http/request-context.js';
import { createRequestLogger } from './platform/http/request-logger.js';
import { checkDatabaseReadiness } from './platform/database/database.js';
import { Pool } from 'pg';
import { Auth } from './modules/auth/auth.js';
import cors from 'cors';
import helmet from 'helmet';
import { createBetterAuthRoutes } from './modules/auth/better-auth.routes.js';
import { createAuthRoutes } from './modules/auth/auth.routes.js';
import { createErrorHandler } from './platform/http/error-handler.js';
import { notFoundHandler } from './platform/http/not-found-handler.js';

export interface CreateAppDependencies {
  logger: Logger;
  databasePool: Pool;
  auth: Auth;
  webOrigin: string;
}

export function createApp({ logger, databasePool, auth, webOrigin }: CreateAppDependencies) {
  const app = express();
  app.use(helmet());

  app.disable('x-powered-by');
  app.use(requestContext);
  app.use(createRequestLogger(logger));

  app.use(
    cors({
      origin: webOrigin,
      credentials: true,
    }),
  );

  app.use(createBetterAuthRoutes(auth));

  app.use(express.json());

  app.use('/api/v1', createAuthRoutes(auth));

  app.get('/health/live', (_request, response) => {
    response.status(200).json({
      status: 'ok',
    });
  });

  app.get('/health/ready', async (_request, response) => {
    try {
      await checkDatabaseReadiness(databasePool);

      response.status(200).json({
        status: 'ready',
      });
    } catch (error) {
      logger.error(
        {
          err: error,
        },
        'Database readiness check failed',
      );

      response.status(503).json({
        status: 'not_ready',
      });
    }
  });

  app.use(notFoundHandler);
  app.use(createErrorHandler(logger));

  return app;
}
