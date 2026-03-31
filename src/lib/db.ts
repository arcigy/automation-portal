import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Execute a common SQL query using the pool.
 */
export async function query(_text: string, _params?: unknown[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await pool.query(_text, _params as any[]);
}

/**
 * Helper to execute a query and return rows typed.
 */
export async function select<T>(text: string, params?: unknown[]): Promise<T[]> {
  const res = await query(text, params);
  return res.rows as T[];
}
