const { Pool } = require('pg');
require('dotenv').config({ quiet: true });
const logger = require('./utils/logger');

// Create a pool of database connections
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fingermobile_main',
  password: process.env.DB_PASSWORD, // Required - no default for security
  port: parseInt(process.env.DB_PORT || '5432')
});

// Test the database connection (async to avoid blocking module load)
setImmediate(() => {
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      logger.error('Database connection error:', err.message);
    } else {
      logger.info('Database connected successfully!');
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
  financialDb: pool,  // Added for marketplace transactions
  securityDb: pool   // Added for consistency
};
