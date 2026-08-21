/**
 * Central configuration export
 * Aggregates all configuration modules for easy access
 */

const oauth2Strategies = require('./oauth2-strategies');
const paymentConfig = require('./payment-config');
const platformConfig = require('./platformConfig');
const security = require('./security');

module.exports = {
  // OAuth2 strategies
  oauth2Strategies,
  
  // Payment configuration
  paymentConfig,
  
  // Platform configuration
  platformConfig,
  
  // Security settings
  security,
  
  // Common environment variables (for backward compatibility),
JWT_SECRET: process.env.JWT_SECRET || oauth2Strategies.jwtSecret || 'dev-secret-key',
SESSION_SECRET: process.env.SESSION_SECRET || 'a_very_secret_session_key_of_32_chars_!!!!',
  
  // Convenience exports,
getOAuthStrategy: (provider) => oauth2Strategies[provider],
getPaymentGateway: (gateway) => paymentConfig.gateways?.[gateway],
getPlatformSetting: (key) => platformConfig[key],
getSecuritySetting: (key) => security[key]
};
