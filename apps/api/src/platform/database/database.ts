import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';

export interface CreateDatabasePoolOptions {
  connectionString: string;
}

export function createDatabase(options: CreateDatabasePoolOptions) {
  const poolConfig: PoolConfig = {
    connectionString: options.connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  };

  const pool = new Pool(poolConfig);
  const db = drizzle({
    client: pool,
  });
  return {
    pool,
    db,
  };
}

export async function checkDatabaseReadiness(pool: Pool): Promise<void> {
  await pool.query('SELECT 1');
}
