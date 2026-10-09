import { loadApiConfig } from '@ticketflow/config/api';
import { createApp } from './app.js';
import { createLogger } from '@ticketflow/logger';
import { createDatabase } from './platform/database/database.js';
import { createAuth } from './modules/auth/auth.js';
import { ConsoleEmailSender } from './platform/email/console-email-sender.js';

const config = loadApiConfig();

const logger = createLogger({
  level: config.LOG_LEVEL,
  service: 'api',
});

const database = createDatabase({
  connectionString: config.DATABASE_URL,
});

const emailSender = new ConsoleEmailSender();

const auth = createAuth({
  db: database.db,
  config,
  emailSender,
});

const app = createApp({
  logger,
  databasePool: database.pool,
  auth,
  webOrigin: config.WEB_ORIGIN,
});

const server = app.listen(config.PORT, () => {
  logger.info(
    {
      port: config.PORT,
      environment: config.NODE_ENV,
    },
    'API started',
  );
});

function shutdown(signal: string): void {
  logger.info(
    {
      signal,
    },
    'Graceful shutdown started',
  );

  server.close((error) => {
    if (error) {
      logger.error(
        {
          err: error,
        },
        'Failed to close HTTP server',
      );

      process.exit(1);
    }

    logger.info('HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});
