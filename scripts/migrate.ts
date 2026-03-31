import fs from 'fs';
import path from 'path';
import { pool } from '../src/lib/db';

async function migrate() {
  const migrationsDir = path.join(process.cwd(), 'db', 'migrations');
  
  try {
    const files = fs.readdirSync(migrationsDir).sort();
    console.log(`Found ${files.length} migrations.`);

    for (const file of files) {
      if (!file.endsWith('.sql')) continue;
      
      console.log(`Executing migration: ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await pool.query(sql);
      console.log(`Success: ${file}`);
    }

    console.log('All migrations executed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
