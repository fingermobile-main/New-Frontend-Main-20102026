const { Sequelize } = require('sequelize');
const logger = require('../utils/logger'); // Import logger

// Database configuration - using the correct environment variables from .env
const dbName = process.env.DB_NAME || process.env.SOCIAL_DB_NAME || 'fingermobile_social_db';
const dbUser = process.env.DB_MEMBER || 'postgres'; // Using DB_MEMBER from .env file
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbPort = process.env.DB_PORT || 5434; // Using the correct port from .env file
const dbHost = process.env.DB_HOST || 'localhost';

logger.info(`Attempting to connect to PostgreSQL: ${dbHost}:${dbPort}, DB: ${dbName}`);

// Create a new Sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres', // or 'mysql', 'sqlite', etc.,
  dialectOptions: {
    // Use environment variable for SSL in production
    ...(process.env.NODE_ENV === 'production' && {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    })
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '5'),
    min: parseInt(process.env.DB_POOL_MIN || '0'),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
    idle: parseInt(process.env.DB_POOL_IDLE || '10000')
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    logger.info('✅ Connection to PostgreSQL established successfully.');
  })
  .catch(err => {
    logger.error('❌ Unable to connect to PostgreSQL:', err);
  });

module.exports = sequelize;