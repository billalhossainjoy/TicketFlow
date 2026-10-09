import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(StatusCodes.NOT_FOUND).type('application/problem+json').json({
    type: 'https://ticketflow.dev/errors/not-found',
    title: 'Not Found',
    status: StatusCodes.NOT_FOUND,
    detail: 'The requested resource was not found.',
    requestId: response.locals.requestId,
  });
};
