// Jest Setup File
// Configure test environment

// Set test timeout
jest.setTimeout(30000);

require('dotenv').config();

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT || '5433';
process.env.DB_NAME = process.env.DB_NAME || 'fingermobile_platform_db';
process.env.DB_USER = process.env.DB_USER || 'postgres';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'password';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test_session_secret';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test_google_client_id';
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'test_google_client_secret';
process.env.FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || 'test_facebook_app_id';
process.env.FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || 'test_facebook_app_secret';
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-test-openai-key-for-jest-tests';

// Conditionally initialize logger to avoid issues during test setup
try {
  const logger = require('./utils/logger');
  logger.info('✅ Jest test environment initialized');
} catch (error) {
  console.error('Logger initialization error in jest.setup.js:', error);
}
