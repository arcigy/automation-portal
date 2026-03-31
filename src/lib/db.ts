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
export async function query<T>(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  return res;
}

/**
 * Helper to execute a query and return rows typed.
 */
export async function select<T>(text: string, params?: any[]): Promise<T[]> {
  const res = await query(text, params);
  return res.rows as T[];
}
