import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import * as schema from '../../platform/database/schema/index.js';

import type { ApiConfig } from '@ticketflow/config/api';

import type { createDatabase } from '../../platform/database/database.js';

export type Database = ReturnType<typeof createDatabase>['db'];

export interface CreateAuthDependencies {
  db: Database;
  config: ApiConfig;
}

export function createAuth(dependencies: CreateAuthDependencies) {
  const { db, config } = dependencies;

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),

    secret: config.BETTER_AUTH_SECRET,

    baseURL: config.BETTER_AUTH_URL,

    trustedOrigins: [config.WEB_ORIGIN],

    emailAndPassword: {
      enabled: true,
    },
  });
}
