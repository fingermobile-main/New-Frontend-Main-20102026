const logger = require('../utils/logger');
const crypto = require('crypto');
const { identityDb } = require('../db');
const { logSecurityEvent } = require('../utils/securityLogger');

// Registration lock service to protect accounts
class RegistrationLockService {
  constructor() {
    this.maxAttempts = 3; // Max attempts before lockout
    this.lockoutDuration = 900; // 15 minutes in seconds
    this.pinLength = 6; // Default PIN length
  }

  /**
   * Generate a random PIN for registration lock
   * @returns {string} Generated PIN
   */
  generatePin() {
    return crypto
      .randomInt(10 ** (this.pinLength - 1), 10 ** this.pinLength)
      .toString();
  }

  /**
   * Set registration lock PIN for a member
   * @param {string} memberId - ID of the member
   * @param {string} pin - PIN to set
   * @returns {Promise<boolean>} Success status
   */
  async setRegistrationLock(memberId, pin) {
    try {
      // Hash the PIN for secure storage
      const hashedPin = this.hashPin(pin);

      await identityDb.query(
        `INSERT INTO registration_locks (member_id, hashed_pin, created_at, updated_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (member_id) 
         DO UPDATE SET hashed_pin = $2, updated_at = $4`,
        [memberId, hashedPin, new Date(), new Date()],
      );

      await logSecurityEvent({
        memberId: memberId,
        eventType: 'registration_lock_set',
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: 'MEDIUM',
        description: 'Registration lock PIN set for member',
        sourceModule: 'RegistrationLockService',
        details: { success: true }
      });

      return true;
    } catch (error) {
      logger.error('Error setting registration lock:', error);
      return false;
    }
  }

  /**
   * Verify registration lock PIN
   * @param {string} memberId - ID of the member
   * @param {string} pin - PIN to verify
   * @returns {Promise<boolean>} Verification status
   */
  async verifyRegistrationLock(memberId, pin) {
    try {
      // Get the stored hashed PIN
      const result = await identityDb.query(
        `SELECT hashed_pin, failed_attempts, locked_until 
         FROM registration_locks 
         WHERE member_id = $1`,
        [memberId],
      );

      if (result.rows.length === 0) {
        // No registration lock set for this member
        return true; // Allow operation if no lock is set
      }

      const record = result.rows[0];

      // Check if account is currently locked
      if (record.locked_until && new Date(record.locked_until) > new Date()) {
        await logSecurityEvent({
          memberId: memberId,
          eventType: 'registration_lock_verification',
          ipAddress: null,
          memberAgent: null,
          success: false,
          severity: 'HIGH',
          description: 'Registration lock verification failed - account locked',
          sourceModule: 'RegistrationLockService',
          details: { reason: 'account_locked', success: false }
        });

        return false;
      }

      // Verify the PIN
      const hashedInputPin = this.hashPin(pin);
      const isValid = hashedInputPin === record.hashed_pin;

      if (isValid) {
        // Reset failed attempts on successful verification
        await identityDb.query(
          `UPDATE registration_locks 
           SET failed_attempts = 0, locked_until = NULL 
           WHERE member_id = $1`,
          [memberId],
        );

        await logSecurityEvent({
          memberId: memberId,
          eventType: 'registration_lock_verification',
          ipAddress: null,
          memberAgent: null,
          success: true,
          severity: 'LOW',
          description: 'Registration lock verification successful',
          sourceModule: 'RegistrationLockService',
          details: { success: true }
        });

        return true;
      } else {
        // Increment failed attempts
        const failedAttempts = (record.failed_attempts || 0) + 1;
        let lockedUntil = null;

        if (failedAttempts >= this.maxAttempts) {
          // Lock account for lockoutDuration seconds
          lockedUntil = new Date(Date.now() + this.lockoutDuration * 1000);
        }

        await identityDb.query(
          `UPDATE registration_locks 
           SET failed_attempts = $1, locked_until = $2 
           WHERE member_id = $3`,
          [failedAttempts, lockedUntil, memberId],
        );

        await logSecurityEvent({
          memberId: memberId,
          eventType: 'registration_lock_verification',
          ipAddress: null,
          memberAgent: null,
          success: false,
          severity: 'HIGH',
          description: 'Registration lock verification failed',
          sourceModule: 'RegistrationLockService',
          details: {
            reason: 'invalid_pin',
            success: false,
            failed_attempts: failedAttempts
          }
        });

        return false;
      }
    } catch (error) {
      logger.error('Error verifying registration lock:', error);
      return false;
    }
  }

  /**
   * Remove registration lock for a member
   * @param {string} memberId - ID of the member
   * @returns {Promise<boolean>} Success status
   */
  async removeRegistrationLock(memberId) {
    try {
      await identityDb.query(
        'DELETE FROM registration_locks WHERE member_id = $1',
        [memberId],
      );

      await logSecurityEvent({
        memberId: memberId,
        eventType: 'registration_lock_removed',
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: 'MEDIUM',
        description: 'Registration lock removed for member',
        sourceModule: 'RegistrationLockService',
        details: { success: true }
      });

      return true;
    } catch (error) {
      logger.error('Error removing registration lock:', error);
      return false;
    }
  }

  /**
   * Check if registration lock is enabled for a member
   * @param {string} memberId - ID of the member
   * @returns {Promise<boolean>} Lock status
   */
  async isRegistrationLockEnabled(memberId) {
    try {
      const result = await identityDb.query(
        'SELECT COUNT(*) as count FROM registration_locks WHERE member_id = $1',
        [memberId],
      );

      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      logger.error('Error checking registration lock status:', error);
      return false;
    }
  }

  /**
   * Check if member has an active registration lock
   * @param {string} memberId - ID of the member
   * @returns {Promise<boolean>} Active lock status
   */
  async hasActiveLock(memberId) {
    try {
      const result = await identityDb.query(
        'SELECT locked_until FROM registration_locks WHERE member_id = $1',
        [memberId],
      );

      if (result.rows.length === 0) {
        return false; // No registration lock set
      }

      const record = result.rows[0];
      if (record.locked_until) {
        // Check if the lock is still active (locked_until is in the future)
        return new Date(record.locked_until) > new Date();
      }

      return false; // Not locked
    } catch (error) {
      logger.error('Error checking active registration lock status:', error);
      return false;
    }
  }

  /**
   * Hash a PIN for secure storage
   * @param {string} pin - PIN to hash
   * @returns {string} Hashed PIN
   */
  hashPin(pin) {
    return crypto
      .createHash('sha256')
      .update(pin + process.env.PIN_SALT || 'default_pin_salt')
      .digest('hex');
  }
}

module.exports = new RegistrationLockService();
