import React from 'react';
import { promises as fs } from 'fs';
import { join } from 'path';
import { pool } from '../config/database';

async function runMigrations() {
  try {
    console.info('Starting database migrations...');

    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of already executed migrations
    const executedResult = await pool.query(
      'SELECT name FROM migrations ORDER BY id',
    );
    const executedMigrations = executedResult.rows.map((row: any) => row.name);

    // Get migration files
    const migrationsDir = join(__dirname, '../../migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files.filter((file: string) => file.endsWith('.sql')).sort();

    console.info(`Found ${migrationFiles.length} migration files`);

    // Execute pending migrations
    for (const file of migrationFiles) {
      if (!executedMigrations.includes(file)) {
        console.info(`Executing migration: ${file}`);

        // Read migration file
        const filePath = join(migrationsDir, file);
        const sql = await fs.readFile(filePath, 'utf8');

        // Execute migration
        await pool.query(sql);

        // Record migration as executed
        await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file]);

        console.info(`Migration ${file} executed successfully`);
      } else {
        console.info(`Migration ${file} already executed, skipping`);
      }
    }

    console.info('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export default runMigrations;
