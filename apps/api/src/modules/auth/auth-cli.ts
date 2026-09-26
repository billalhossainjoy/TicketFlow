import { loadApiConfig } from '@ticketflow/config/api';

import { createDatabase } from '../../platform/database/database.js';

import { createAuth } from './auth.js';

const config = loadApiConfig();

const database = createDatabase({
  connectionString: config.DATABASE_URL,
});

export const auth = createAuth({
  db: database.db,
  config,
});
