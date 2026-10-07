import express from 'express';
import { Logger } from 'pino';
import { requestContext } from './platform/http/request-context.js';
import { createRequestLogger } from './platform/http/request-logger.js';
import { checkDatabaseReadiness } from './platform/database/database.js';
import { Pool } from 'pg';
import { Auth } from './modules/auth/auth.js';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import helmet from 'helmet';

export interface CreateAppDependencies {
  logger: Logger;
  databasePool: Pool;
  auth: Auth;
  webOrigin: string;
}

export function createApp({ logger, databasePool, auth, webOrigin }: CreateAppDependencies) {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());
  app.use(requestContext);
  app.use(createRequestLogger(logger));

  app.use(
    cors({
      origin: webOrigin,
      credentials: true,
    }),
  );

  app.all('/api/auth/*splat', toNodeHandler(auth));

  app.use(express.json());

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

  return app;
}
