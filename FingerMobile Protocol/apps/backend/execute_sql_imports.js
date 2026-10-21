#!/usr/bin/env node

/**
 * Execute SQL Import Files
 * This script executes the SQL files to import forum categories and other data
 * It ensures the database has the correct seed data from the CSV files
 */

const { Client } = require('pg');
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function executeSeedScript(scriptPath) {
  try {
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`Error executing ${scriptPath}:`, error.message);
    throw error;
  }
}

// Database configuration from environment variables
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fingermobile_platform_db',
  password: process.env.DB_PASSWORD || 'your_password',
  port: parseInt(process.env.DB_PORT) || 5432,
};

// Path to SQL files
const SQL_DIR = path.join(__dirname, 'database');
const FORUM_CATEGORIES_SQL = path.join(SQL_DIR, 'import_forum_categories.sql');
const FORUM_CATEGORIES_FIXED_SQL = path.join(SQL_DIR, 'import_forum_categories_fixed.sql');
const COMMUNITY_SCHEMA_SQL = path.join(SQL_DIR, 'community_schema.sql');

/**
 * Execute SQL file
 */
async function executeSqlFile(client, filePath) {
  if (!fs.existsSync(filePath)) {
    logger.warn(`SQL file does not exist: ${filePath}`);
    return false;
  }

  try {
    logger.info(`Executing SQL file: ${filePath}`);
    const sqlContent = fs.readFileSync(filePath, 'utf8');

    // Split the content into individual statements (handle semicolon-separated queries)
    const statements = sqlContent.split(/;\s*(?=\n|$)/).filter(stmt => stmt.trim());

    for (const statement of statements) {
      const trimmedStmt = statement.trim();
      if (trimmedStmt) {
        await client.query(trimmedStmt);
      }
    }

    logger.info(`Successfully executed: ${filePath}`);
    return true;
  } catch (error) {
    logger.error(`Error executing ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Ensure community schema exists
 */
async function ensureSchemaExists() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    logger.info('Connected to database successfully');

    // Check if communities table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'communities'
      );
    `);

    if (!result.rows[0].exists) {
      logger.info('Communities table does not exist, creating schema...');
      await executeSqlFile(client, COMMUNITY_SCHEMA_SQL);
      logger.info('Community schema created successfully');
    } else {
      logger.info('Community schema already exists');
    }

    return client;
  } catch (error) {
    logger.error('Error ensuring schema exists:', error.message);
    await client.end();
    throw error;
  }
}

/**
 * Main function to execute all SQL imports
 */
async function main() {
  logger.info('='.repeat(80));
  logger.info('EXECUTING SQL IMPORT FILES');
  logger.info('='.repeat(80));
  logger.info('');

  let client;

  try {
    // Ensure the schema exists first
    client = await ensureSchemaExists();

    logger.info('Starting SQL import process...');
    logger.info('-'.repeat(50));

    // Execute the forum categories import SQL
    logger.info('Importing forum categories from SQL file...');
    let importSuccess = false;

    // Try the fixed version first, then fall back to the original
    try {
      importSuccess = await executeSqlFile(client, FORUM_CATEGORIES_FIXED_SQL);
    } catch (error) {
      logger.warn(`Fixed version failed, trying original: ${error.message}`);
      try {
        importSuccess = await executeSqlFile(client, FORUM_CATEGORIES_SQL);
      } catch (originalError) {
        logger.error(`Original version also failed: ${originalError.message}`);
        throw originalError;
      }
    }

    if (importSuccess) {
      logger.info('');
      logger.info('='.repeat(80));
      logger.info('SQL IMPORT COMPLETED SUCCESSFULLY');
      logger.info('='.repeat(80));
      logger.info('');
      logger.info('Forum categories have been imported into the database');
      logger.info('The platform now has the proper seed data from CSV files');
      logger.info('');
    } else {
      logger.error('SQL import did not complete successfully');
    }

    // Verify the data was imported
    logger.info('Verifying imported data...');
    const countResult = await client.query('SELECT COUNT(*) FROM communities;');
    const count = parseInt(countResult.rows[0].count);
    logger.info(`Verification: Found ${count} forum categories in the database`);

    if (count > 0) {
      logger.info('✅ Data verification successful - forum categories are in the database');
    } else {
      logger.warn('⚠️  Warning: No forum categories found in database');
    }

    // Show some sample data
    if (count > 0) {
      const sampleResult = await client.query('SELECT id, name, slug FROM communities LIMIT 5;');
      logger.info('Sample forum categories:');
      for (const row of sampleResult.rows) {
        logger.info(`  - ${row.name} (${row.slug})`);
      }
    }

  } catch (error) {
    logger.error('');
    logger.error('='.repeat(80));
    logger.error('❌ SQL IMPORT FAILED');
    logger.error('='.repeat(80));
    logger.error('');
    logger.error('Error:', error.message);
    logger.error('Stack:', error.stack);
    logger.error('');
    logger.error('Please check:');
    logger.error('1. Database is running and accessible');
    logger.error('2. SQL files exist in the expected location');
    logger.error('3. Environment variables are correctly configured');
    logger.error('');

    throw error;
  } finally {
    if (client) {
      await client.end();
      logger.info('Database connection closed');
    }
  }
}

// Execute all SQL imports in sequence
async function executeAllImports() {
  try {
    console.log('🚀 Starting platform data import process...');

    // Execute seed scripts in proper order
    await executeSeedScript('./seed_platform_data.js');
    console.log('✅ Platform data seeding completed');

    // Execute import scripts
    await executeSeedScript('./import_platform_data.js');
    console.log('✅ Platform data import completed');

    // Execute full import if needed
    await executeSeedScript('./import_full_platform_data.js');
    console.log('✅ Full platform data import completed');

    console.log('🎉 All imports completed successfully!');
  } catch (error) {
    console.error('❌ Error during import process:', error);
    process.exit(1);
  }
}

// Execute the import process
executeAllImports();

// Run the script if called directly
if (require.main === module) {
  main()
    .then(() => {
      logger.info('SQL import process completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      logger.error('SQL import process failed:', error);
      process.exit(1);
    });
}

module.exports = { main, executeSqlFile, ensureSchemaExists };
