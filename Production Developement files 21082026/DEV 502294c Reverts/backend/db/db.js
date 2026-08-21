const { Pool } = require("pg");
require("dotenv").config();

// Identity database pool - for user accounts and authentication
const identityDb = new Pool({
  user: process.env.IDENTITY_DB_USER || "postgres",
  host: process.env.IDENTITY_DB_HOST || "localhost",
  database: process.env.IDENTITY_DB_NAME || "fingermobile_identity_db",
  password: process.env.IDENTITY_DB_PASSWORD || "postgres",
  port: process.env.IDENTITY_DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false 
  } : false
});

// Content database pool - for posts, comments, and content
const contentDb = new Pool({
  user: process.env.CONTENT_DB_USER || "postgres",
  host: process.env.CONTENT_DB_HOST || "localhost",
  database: process.env.CONTENT_DB_NAME || "fingermobile_content_db",
  password: process.env.CONTENT_DB_PASSWORD || "postgres",
  port: process.env.CONTENT_DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false 
  } : false
});

// Social database pool - for social interactions
const socialDb = new Pool({
  user: process.env.SOCIAL_DB_USER || "postgres",
  host: process.env.SOCIAL_DB_HOST || "localhost",
  database: process.env.SOCIAL_DB_NAME || "fingermobile_social_db",
  password: process.env.SOCIAL_DB_PASSWORD || "postgres",
  port: process.env.SOCIAL_DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false 
  } : false
});

// Monetization database pool - for transactions and payments
const monetizationDb = new Pool({
  user: process.env.MONETIZATION_DB_USER || "postgres",
  host: process.env.MONETIZATION_DB_HOST || "localhost",
  database: process.env.MONETIZATION_DB_NAME || "fingermobile_monetization_db",
  password: process.env.MONETIZATION_DB_PASSWORD || "postgres",
  port: process.env.MONETIZATION_DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false 
  } : false
});

// Communication database pool - for messaging and notifications
const communicationDb = new Pool({
  user: process.env.COMMUNICATION_DB_USER || "postgres",
  host: process.env.COMMUNICATION_DB_HOST || "localhost",
  database: process.env.COMMUNICATION_DB_NAME || "fingermobile_communication_db",
  password: process.env.COMMUNICATION_DB_PASSWORD || "postgres",
  port: process.env.COMMUNICATION_DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false 
  } : false
});

// Control database pool - for configuration and control data
const controlDb = new Pool({
  user: process.env.CONTROL_DB_USER || "postgres",
  host: process.env.CONTROL_DB_HOST || "localhost",
  database: process.env.CONTROL_DB_NAME || "fingermobile_control_db",
  password: process.env.CONTROL_DB_PASSWORD || "postgres",
  port: process.env.CONTROL_DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false 
  } : false
});

// Financial database pool - for financial records
const financialDb = new Pool({
  user: process.env.FINANCIAL_DB_USER || "postgres",
  host: process.env.FINANCIAL_DB_HOST || "localhost",
  database: process.env.FINANCIAL_DB_NAME || "fingermobile_financial_db",
  password: process.env.FINANCIAL_DB_PASSWORD || "postgres",
  port: process.env.FINANCIAL_DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false 
  } : false
});

// Security database pool - for security logs and monitoring
const securityDb = new Pool({
  user: process.env.SECURITY_DB_USER || "postgres",
  host: process.env.SECURITY_DB_HOST || "localhost",
  database: process.env.SECURITY_DB_NAME || "fingermobile_security_db",
  password: process.env.SECURITY_DB_PASSWORD || "postgres",
  port: process.env.SECURITY_DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false 
  } : false
});

// Test database connections
async function testConnections() {
  try {
    await Promise.all([
      identityDb.query("SELECT NOW()"),
      contentDb.query("SELECT NOW()"),
      socialDb.query("SELECT NOW()"),
      monetizationDb.query("SELECT NOW()"),
      communicationDb.query("SELECT NOW()"),
      controlDb.query("SELECT NOW()"),
      financialDb.query("SELECT NOW()"),
      securityDb.query("SELECT NOW()")
    ]);
    logger.info("✅ All database connections successful");
  } catch (error) {
    logger.error("❌ Database connection failed:", error.message);
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