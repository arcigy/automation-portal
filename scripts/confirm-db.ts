import { pool } from '../src/lib/db';

async function check() {
  console.log('--- DB CONNECTION TEST ---');
  console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
  
  try {
    const res = await pool.query('SELECT current_database(), current_user, version()');
    console.log('✅ Connected successfully!');
    console.log('Database:', res.rows[0].current_database);
    console.log('User:', res.rows[0].current_user);
    console.log('Version:', res.rows[0].version.substring(0, 30));
    process.exit(0);
  } catch (err: any) {
    console.error('❌ DB CONNECTION FAILED!');
    console.error('Error Code:', err.code);
    console.error('Message:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

check();
