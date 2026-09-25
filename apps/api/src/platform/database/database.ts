import { Pool } from 'pg';

export interface CreateDatabasePoolOptions {
  connectionString: string;
}

export function createDatabasePool(options: CreateDatabasePoolOptions): Pool {
  return new Pool({
    connectionString: options.connectionString,

    max: 10,

    idleTimeoutMillis: 30_000,

    connectionTimeoutMillis: 5_000,
  });
}

export async function checkDatabaseReadiness(pool: Pool): Promise<void> {
  await pool.query('SELECT 1');
}
