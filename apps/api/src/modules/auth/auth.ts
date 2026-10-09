import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import * as schema from '../../platform/database/schema/index.js';

import type { ApiConfig } from '@ticketflow/config/api';

import type { createDatabase } from '../../platform/database/database.js';
import { EmailSender } from '../../platform/email/email-sender.js';

export type Database = ReturnType<typeof createDatabase>['db'];

export interface CreateAuthDependencies {
  db: Database;
  config: ApiConfig;
  emailSender: EmailSender;
}

export function createAuth(dependencies: CreateAuthDependencies) {
  const { db, config, emailSender } = dependencies;

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
      requireEmailVerification: true,
      autoSignIn: false,
    },

    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,

      sendVerificationEmail: async ({ user, url }) => {
        void emailSender.send({
          to: user.email,
          subject: 'Email Verification',
          text: `Please verify your email address by clicking the link: ${url}`,
        });
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
