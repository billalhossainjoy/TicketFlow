import { randomUUID } from 'node:crypto';

import type {
  NextFunction,
  Request,
  Response,
} from 'express';

const REQUEST_ID_HEADER = 'x-request-id';
const MAX_REQUEST_ID_LENGTH = 128;

export function requestContext(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const incomingRequestId = request.header(REQUEST_ID_HEADER);

  const requestId =
    incomingRequestId &&
    incomingRequestId.length <= MAX_REQUEST_ID_LENGTH
      ? incomingRequestId
      : randomUUID();

  response.locals.requestId = requestId;

  response.setHeader(
    REQUEST_ID_HEADER,
    requestId,
  );

  next();
}