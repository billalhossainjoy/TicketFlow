import { loadApiConfig } from '@ticketflow/config/api';

import { createDatabase } from '../../platform/database/database.js';

import { createAuth } from './auth.js';
import { ConsoleEmailSender } from '../../platform/email/console-email-sender.js';

const config = loadApiConfig();

const database = createDatabase({
  connectionString: config.DATABASE_URL,
});

const emailSender = new ConsoleEmailSender();

export const auth = createAuth({
  db: database.db,
  config,
  emailSender,
});
