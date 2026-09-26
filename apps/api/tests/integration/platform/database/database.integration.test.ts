import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { Pool } from 'pg';

import {
  checkDatabaseReadiness,
  createDatabase,
} from '../../../../src/platform/database/database.js';

describe('database infrastructure', () => {
  let container: StartedPostgreSqlContainer;
  let pool: Pool;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:17-alpine').start();

    const database = createDatabase({
      connectionString: container.getConnectionUri(),
    });

    pool = database.pool;
  });

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  it('connects to a real PostgreSQL database', async () => {
    await expect(checkDatabaseReadiness(pool)).resolves.toBeUndefined();
  });
});
