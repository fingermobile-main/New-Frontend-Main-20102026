/**
 * Development Environment Configuration
 * Uses environment variables with fallbacks for development
 */

module.exports = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/fingermobile_dev'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_for_local_development_only',
    expiresIn: '24h'
  },
  logging: {
    level: 'debug'
  }
};