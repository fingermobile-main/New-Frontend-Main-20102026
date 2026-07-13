/**
 * Production Environment Configuration
 * Uses environment variables for all sensitive configurations
 */

module.exports = {
  database: {
    url: process.env.DATABASE_URL,
    ssl: true
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  redis: {
    url: process.env.REDIS_URL
  }
};
