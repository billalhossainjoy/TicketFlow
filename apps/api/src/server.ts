
import { loadApiConfig } from '@ticketflow/config/api';
import { createApp } from './app.js';

const config = loadApiConfig();

const app = createApp();

const server = app.listen(config.PORT, () => {
  console.log(`API listening on port ${config.PORT}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received. Starting graceful shutdown.`);

  server.close((error) => {
    if (error) {
      console.error('Failed to close HTTP server cleanly.', error);
      process.exit(1);
    }

    console.log('HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});