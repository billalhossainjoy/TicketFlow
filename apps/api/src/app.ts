import express from 'express';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(express.json());

  app.get('/health/live', (_request, response) => {
    response.status(200).json({
      status: 'ok',
    });
  });

  return app;
}