import { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import { Logger } from 'pino';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

interface ErrorDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  requestId?: string | undefined;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

function ResponseError(response: Parameters<ErrorRequestHandler>[2], errorDetails: ErrorDetails) {
  response.status(errorDetails.status).type('application/problem+json').json(errorDetails);
}

function hasErrorType(error: unknown, expectedType: string): boolean {
  return (
    typeof error === 'object' && error !== null && 'type' in error && error.type === expectedType
  );
}

export function createErrorHandler(logger: Logger): ErrorRequestHandler {
  return (err, req, res, next) => {
    if (res.headersSent) {
      next(err);
      return;
    }

    const requestId = res.locals.requestId as string | undefined;

    if (err instanceof AppError) {
      logger.warn(
        {
          requestId,
          method: req.method,
          path: req.path,
          statusCode: err.statusCode,
          problemType: err.type,
        },
        'Request Rejected',
      );

      ResponseError(res, {
        type: err.type,
        title: err.title,
        status: err.statusCode,
        detail: err.detail,
        requestId,
      });

      return;
    }

    if (err instanceof ZodError) {
      ResponseError(res, {
        type: 'https://ticketflow.dev/errors/validation',
        title: 'Validation failed',
        status: StatusCodes.BAD_REQUEST,
        detail: 'One or more request fields are invalid.',
        requestId,
        errors: err.issues.map((issue) => ({
          path: issue.path.map(String).join('.'),
          message: issue.message,
        })),
      });

      return;
    }

    if (hasErrorType(err, 'entity.parse.failed')) {
      ResponseError(res, {
        type: `about:blank`,
        title: 'Invalid JSON',
        status: StatusCodes.BAD_REQUEST,
        detail: 'The request body must contain valid JSON.',
        requestId,
      });

      return;
    }

    logger.error(
      {
        requestId,
        method: req.method,
        path: req.path,
        errorName: err instanceof Error ? err.name : typeof err,
        stack: err instanceof Error ? err.stack : undefined,
      },
      'Internal Server Error',
    );

    ResponseError(res, {
      type: 'about:blank',
      title: 'Internal Server Error',
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      detail: 'An unexpected error occurred.',
      requestId,
    });
  };
}
