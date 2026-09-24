import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 4000);

const app = createApp();

const server = app.listen(port, () => {
  console.log(`API listening on port ${port}`);
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