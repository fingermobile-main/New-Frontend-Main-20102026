const logger = require('../utils/logger');
const { Client } = require('pg');
require('dotenv').config();

const dbConfig = {member: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fingermobile_identity_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432
};

async function ensureMigrationTable(client) {
  // Create migration history table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS integration_migrations (
      id SERIAL PRIMARY KEY,
      migration_name TEXT UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await client.query(createTableQuery);
}

async function hasMigrationRun(client, migrationName) {
  const result = await client.query(
    'SELECT * FROM integration_migrations WHERE migration_name = $1',
    [migrationName],
  );
  return result.rows.length > 0;
}

async function recordMigration(client, migrationName) {
  await client.query(
    'INSERT INTO integration_migrations (migration_name) VALUES ($1)',
    [migrationName],
  );
}

async function runMigration(
  migrationFile = './migrations/025_integration_schema.sql',
) {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    logger.info('Connected to PostgreSQL database');

    // Check and create migration history table
    await ensureMigrationTable(client);

    const fs = require('fs');
    const path = require('path');

    // Get migration name from file path
    const migrationName = path.basename(migrationFile);

    // Check if migration has already run
    if (await hasMigrationRun(client, migrationName)) {
      logger.info(
        `Migration ${migrationName} has already been executed. Skipping...`,
      );
      return;
    }

    // Read and execute migration file
    logger.info(`Reading migration,
file: ${migrationFile}`);
    const schemaSQL = fs.readFileSync(migrationFile, 'utf8');

    logger.info(`Executing,
migration: ${migrationName}`);
    await client.query(schemaSQL);

    // Record successful migration
    await recordMigration(client, migrationName);
    logger.info(`Migration ${migrationName} completed successfully!`);
  } catch (err) {
    logger.error(`Error running migration ${migrationFile}:`, err);
  } finally {
    await client.end();
    logger.info('Database connection closed');
  }
}

// Run with default migration file if called directly
if (require.main === module) {
  const migrationFile =
    process.argv[2] || './migrations/025_integration_schema.sql';
  runMigration(migrationFile);
}

module.exports = { runMigration };
