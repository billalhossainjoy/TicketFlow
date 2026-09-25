import { createServer } from 'node:http';

import { loadWorkerConfig } from '@ticketflow/config/worker';
import { createLogger } from '@ticketflow/logger';

const config = loadWorkerConfig();

const logger = createLogger({
  level: config.LOG_LEVEL,
  service: 'worker',
});

let shuttingDown = false;

const healthServer = createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/health/live') {
    response.writeHead(200, {
      'content-type': 'application/json',
    });

    response.end(
      JSON.stringify({
        status: 'ok',
      }),
    );

    return;
  }

  response.writeHead(404, {
    'content-type': 'application/json',
  });

  response.end(
    JSON.stringify({
      status: 'not_found',
    }),
  );
});

healthServer.listen(config.WORKER_HEALTH_PORT, () => {
  logger.info(
    {
      environment: config.NODE_ENV,
      healthPort: config.WORKER_HEALTH_PORT,
    },
    'Worker started',
  );
});

function shutdown(signal: string): void {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  logger.info(
    {
      signal,
    },
    'Worker graceful shutdown started',
  );

  healthServer.close((error) => {
    if (error) {
      logger.error(
        {
          err: error,
        },
        'Failed to close worker health server',
      );

      process.exit(1);
    }

    logger.info('Worker stopped');

    process.exit(0);
  });
}

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});
