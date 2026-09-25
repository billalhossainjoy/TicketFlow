import type { Logger } from 'pino';
import type {
  NextFunction,
  Request,
  Response,
} from 'express';

export function createRequestLogger(logger: Logger) {
  return function requestLogger(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    const startedAt = process.hrtime.bigint();

    response.on('finish', () => {
      const finishedAt = process.hrtime.bigint();

      const durationMs =
        Number(finishedAt - startedAt) / 1_000_000;

      logger.info(
        {
          requestId: response.locals.requestId,
          method: request.method,
          path: request.path,
          statusCode: response.statusCode,
          durationMs,
        },
        'HTTP request completed',
      );
    });

    next();
  };
}