/* eslint-disable no-unused-vars */
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env'), quiet: true });
require('dotenv').config({ quiet: true });
const logger = require('./utils/logger');

// Create a pool of database connections
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'fingermobile_platform_db',
  password: process.env.DB_PASSWORD || undefined,
  port: parseInt(process.env.DB_PORT || '5433')
});

// Test the database connection (async to avoid blocking module load)
setImmediate(() => {
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      if (logger && typeof logger.error === 'function') logger.error('Database connection error:', err.message);
      else console.error('Database connection error:', err.message);
    } else {
      if (logger && typeof logger.info === 'function') logger.info('Database connected successfully!');
      else console.log('Database connected successfully!');
    }
  });
});

// Export single pool as default and aliases for backward compatibility
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
  // Aliases - all point to same pool for now
  contentDb: pool,
  commerceDb: pool,
  identityDb: pool,
  socialDb: pool,
  financialDb: pool,  // Added for marketplace transactions
  securityDb: pool,   // Added for consistency
  monetizationDb: pool
};
