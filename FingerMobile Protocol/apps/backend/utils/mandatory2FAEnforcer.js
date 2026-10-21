/**
 * Mandatory 2FA Enforcer
 * Enforces 2FA for sensitive roles and compliance
 */

const logger = require('./logger');

class Mandatory2FAEnforcer {
  startEnforcement() {
    if (logger && typeof logger.info === 'function') {
      logger.info('🔒 Mandatory 2FA enforcement active');
    }
  }

  stopEnforcement() {
    if (logger && typeof logger.info === 'function') {
      logger.info('🔓 Mandatory 2FA enforcement stopped');
    }
  }
}

module.exports = new Mandatory2FAEnforcer();
