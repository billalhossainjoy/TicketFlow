import pino, { type Logger } from 'pino';

export type LogLevel =
  | 'fatal'
  | 'error'
  | 'warn'
  | 'info'
  | 'debug'
  | 'trace'
  | 'silent';

export type LoggerType = Logger;

export interface LoggerOptions {
  level: LogLevel;
  service: string;
}

export function createLogger(options: LoggerOptions): Logger {
  return pino({
    level: options.level,

    base: {
      service: options.service,
    },

    redact: {
      paths: [
        'password',
        '*.password',

        'authorization',
        '*.authorization',

        'cookie',
        '*.cookie',

        'token',
        '*.token',

        'secret',
        '*.secret',
      ],

      censor: '[REDACTED]',
    },
  });
}