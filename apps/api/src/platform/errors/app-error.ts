import { StatusCodes } from 'http-status-codes';

export type ClientErrorStatus =
  | StatusCodes.BAD_REQUEST
  | StatusCodes.UNAUTHORIZED
  | StatusCodes.FORBIDDEN
  | StatusCodes.NOT_FOUND
  | StatusCodes.CONFLICT
  | StatusCodes.UNPROCESSABLE_ENTITY;

export interface AppErrorOptions {
  statusCode: ClientErrorStatus;
  type: string;
  title: string;
  detail: string;
}

export class AppError extends Error {
  readonly statusCode: ClientErrorStatus;
  readonly type: string;
  readonly title: string;
  readonly detail: string;

  constructor(options: AppErrorOptions) {
    super(options.detail);

    this.name = 'AppError';
    this.statusCode = options.statusCode;
    this.type = options.type;
    this.title = options.title;
    this.detail = options.detail;
  }
}
