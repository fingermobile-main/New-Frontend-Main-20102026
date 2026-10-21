// Main configuration file for the FingerMobile backend

module.exports = {
  // JWT configuration,
  JWT_SECRET: process.env.JWT_SECRET || 'fingermobile_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // Database configuration,
  DB_USER: process.env.DB_USER || process.env.DB_MEMBER || 'postgres',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_NAME: process.env.DB_NAME || 'fingermobile_social_db',  // Updated to match our setup,
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_PORT: process.env.DB_PORT || 5434,  // Updated to match our PostgreSQL setup

  // Security configuration,
  SECURITY: {
    // Password configuration,
    PASSWORD_SALT_ROUNDS: parseInt(process.env.PASSWORD_SALT_ROUNDS) || 10,

    // Phone verification configuration,
    PHONE_VERIFICATION_CODE_LENGTH: 6,
    PHONE_VERIFICATION_EXPIRY_MINUTES: 10,

    // Two-factor authentication configuration,
    TWO_FACTOR_CODE_LENGTH: 6,
    TWO_FACTOR_EXPIRY_MINUTES: 10,

    // Backup codes configuration,
    BACKUP_CODES_COUNT: 10,
    BACKUP_CODES_LENGTH: 8,

    // Rate limiting configuration,
    RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes,
    RATE_LIMIT_MAX_REQUESTS: 100, // Max requests per window
  },

  // Server configuration,
  PORT: process.env.PORT || 5001,  // Changed from 5000 to 5001 to avoid conflict,
  NODE_ENV: process.env.NODE_ENV || 'development'
};
