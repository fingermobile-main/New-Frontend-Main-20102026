const { Pool } = require('pg');
require('dotenv').config();
const logger = require('../config/logger');

const DEFAULT_MAX_POOL = parseInt(process.env.DB_POOL_MAX, 10) || 5;

// Identity database pool - for user accounts and authentication
const identityDb = new Pool({
  user: process.env.IDENTITY_DB_USER || process.env.DB_USER || 'postgres',
  host: process.env.IDENTITY_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.IDENTITY_DB_NAME || 'fingermobile_platform_db',
  password: process.env.IDENTITY_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  port: process.env.IDENTITY_DB_PORT || process.env.DB_PORT || 5432,
  max: DEFAULT_MAX_POOL, // Controlled pool size (max 5 clients per pool)
  idleTimeoutMillis: 10000, // Close idle clients after 10 seconds
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

// Content database pool - for posts, comments, and content
const contentDb = new Pool({
  user: process.env.CONTENT_DB_USER || process.env.DB_USER || 'postgres',
  host: process.env.CONTENT_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.CONTENT_DB_NAME || 'fingermobile_content_db',
  password: process.env.CONTENT_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  port: process.env.CONTENT_DB_PORT || process.env.DB_PORT || 5432,
  max: DEFAULT_MAX_POOL,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

// Social database pool - for social interactions
const socialDb = new Pool({
  user: process.env.SOCIAL_DB_USER || process.env.DB_USER || 'postgres',
  host: process.env.SOCIAL_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.SOCIAL_DB_NAME || 'fingermobile_social_db',
  password: process.env.SOCIAL_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  port: process.env.SOCIAL_DB_PORT || process.env.DB_PORT || 5432,
  max: DEFAULT_MAX_POOL,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

// Monetization database pool - for transactions and payments
const monetizationDb = new Pool({
  user: process.env.MONETIZATION_DB_USER || process.env.DB_USER || 'postgres',
  host: process.env.MONETIZATION_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.MONETIZATION_DB_NAME || 'fingermobile_monetization_db',
  password: process.env.MONETIZATION_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  port: process.env.MONETIZATION_DB_PORT || process.env.DB_PORT || 5432,
  max: DEFAULT_MAX_POOL,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

// Communication database pool - for messaging and notifications
const communicationDb = new Pool({
  user: process.env.COMMUNICATION_DB_USER || process.env.DB_USER || 'postgres',
  host: process.env.COMMUNICATION_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.COMMUNICATION_DB_NAME || 'fingermobile_communication_db',
  password: process.env.COMMUNICATION_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  port: process.env.COMMUNICATION_DB_PORT || process.env.DB_PORT || 5432,
  max: DEFAULT_MAX_POOL,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

// Control database pool - for configuration and control data
const controlDb = new Pool({
  user: process.env.CONTROL_DB_USER || process.env.DB_USER || 'postgres',
  host: process.env.CONTROL_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.CONTROL_DB_NAME || 'fingermobile_control_db',
  password: process.env.CONTROL_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  port: process.env.CONTROL_DB_PORT || process.env.DB_PORT || 5432,
  max: DEFAULT_MAX_POOL,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

// Financial database pool - for financial records
const financialDb = new Pool({
  user: process.env.FINANCIAL_DB_USER || process.env.DB_USER || 'postgres',
  host: process.env.FINANCIAL_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.FINANCIAL_DB_NAME || 'fingermobile_financial_db',
  password: process.env.FINANCIAL_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  port: process.env.FINANCIAL_DB_PORT || process.env.DB_PORT || 5432,
  max: DEFAULT_MAX_POOL,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

// Security database pool - for security logs and monitoring
const securityDb = new Pool({
  user: process.env.SECURITY_DB_USER || process.env.DB_USER || 'postgres',
  host: process.env.SECURITY_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.SECURITY_DB_NAME || 'fingermobile_security_db',
  password: process.env.SECURITY_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  port: process.env.SECURITY_DB_PORT || process.env.DB_PORT || 5432,
  max: DEFAULT_MAX_POOL,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

// Test database connections
async function testConnections() {
  try {
    // Execute queries sequentially to avoid "too many clients" error
    const dbs = {
      identity: identityDb,
      content: contentDb,
      social: socialDb,
      monetization: monetizationDb,
      communication: communicationDb,
      control: controlDb,
      financial: financialDb,
      security: securityDb
    };
    for (const [name, db] of Object.entries(dbs)) {
      try {
        logger.info(`Testing connection for ${name}...`);
        await db.query('SELECT NOW()');
        logger.info(`✅ Connection to ${name} database successful`);
      } catch (error) {
        logger.error(`❌ Failed to connect to ${name} database:`, error);
        throw error;
      }
    }
    logger.info('✅ All database connections successful');
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

// Export all database pools
module.exports = {
  identityDb,
  contentDb,
  socialDb,
  monetizationDb,
  communicationDb,
  controlDb,
  financialDb,
  securityDb,
  testConnections
};
