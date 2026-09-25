import { z } from 'zod';

const apiEnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.coerce.number().int().positive().max(65535).default(4000),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),

  DATABASE_URL: z
    .string()
    .min(1)
    .refine((value) => value.startsWith('postgresql://') || value.startsWith('postgres://'), {
      message: 'DATABASE_URL must be a PostgreSQL connection URL',
    }),
});

export type ApiConfig = z.infer<typeof apiEnvironmentSchema>;

export function loadApiConfig(environment: NodeJS.ProcessEnv = process.env): ApiConfig {
  return apiEnvironmentSchema.parse(environment);
}
