import { z } from 'zod';

const workerEnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  WORKER_HEALTH_PORT: z.coerce.number().default(4001),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export type WorkerConfig = z.infer<typeof workerEnvironmentSchema>;

export function loadWorkerConfig(environment: NodeJS.ProcessEnv = process.env): WorkerConfig {
  return workerEnvironmentSchema.parse(environment);
}
