import express from 'express';
import { Logger } from 'pino';
import { requestContext } from './platform/http/request-context.js';
import { createRequestLogger } from './platform/http/request-logger.js';

export function createApp(logger: Logger) {
  const app = express();

  app.disable('x-powered-by');

  app.use(requestContext);
  app.use(createRequestLogger(logger));

  app.use(express.json());

  app.get('/health/live', (_request, response) => {
    response.status(200).json({
      status: 'ok',
    });
  });

  return app;
}
