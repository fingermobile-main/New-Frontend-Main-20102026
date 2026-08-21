const crypto = require("crypto");
const { identityDb } = require("../db");

/**
 * Safety Number Service for verifying contact identity
 * Implements a mechanism similar to Signal's safety numbers
 */
class SafetyNumberService {
  constructor() {
    this.keyLength = 64; // Length for safety number generation
  }

  /**
   * Generate a safety number for a member
   * @param {string} memberId - ID of the member
   * @returns {Promise<string>} Generated safety number
   */
  async generateSafetyNumber(memberId) {
    try {
      // Get member's identity key or generate one if not exists
      const result = await identityDb.query(
        `SELECT identity_key FROM members 
         WHERE id = $1`,
        [memberId],
      );

      let identityKey;
      if (!result.rows[0] || !result.rows[0].identity_key) {
        // Generate a new identity key for the member
        identityKey = crypto.randomBytes(32).toString("hex");

        // Store the identity key
        await identityDb.query(
          `UPDATE members SET identity_key = $1 WHERE id = $2`,
          [identityKey, memberId],
        );
      } else {
        identityKey = result.rows[0].identity_key;
      }

      // Generate a safety number based on member ID, identity key, and timestamp
      const timestamp = Date.now();
      const safetyNumberInput = `${memberId}:${identityKey}:${timestamp}`;
      const safetyNumber = crypto
        .createHash("sha256")
        .update(safetyNumberInput)
        .digest("hex")
        .substring(0, this.keyLength);

      // Store safety number in database
      await identityDb.query(
        `INSERT INTO safety_numbers (member_id, safety_number, created_at, identity_key)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (member_id) 
         DO UPDATE SET safety_number = $2, created_at = $3, identity_key = $4`,
        [memberId, safetyNumber, new Date(), identityKey],
      );

      return safetyNumber;
    } catch (error) {
      logger.error("Error generating safety number:", error);
      throw error;
    }
  }

  /**
   * Get safety number for a member
   * @param {string} memberId - ID of the member
   * @returns {Promise<string|null>} Safety number or null if not found
   */
  async getSafetyNumber(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT safety_number FROM safety_numbers WHERE member_id = $1`,
        [memberId],
      );

      return result.rows[0] ? result.rows[0].safety_number : null;
    } catch (error) {
      logger.error("Error getting safety number:", error);
      return null;
    }
  }

  /**
   * Compare safety numbers between two members
   * @param {string} member1Id - ID of first member
   * @param {string} member2Id - ID of second member
   * @returns {Promise<boolean>} True if safety numbers match
   */
  async compareSafetyNumbers(member1Id, member2Id) {
    try {
      const member1SafetyNumber = await this.getSafetyNumber(member1Id);
      const member2SafetyNumber = await this.getSafetyNumber(member2Id);

      if (!member1SafetyNumber || !member2SafetyNumber) {
        return false;
      }

      // Compare the safety numbers
      return crypto.timingSafeEqual(
        Buffer.from(member1SafetyNumber),
        Buffer.from(member2SafetyNumber),
      );
    } catch (error) {
      logger.error("Error comparing safety numbers:", error);
      return false;
    }
  }

  /**
   * Verify a member's identity key
   * @param {string} memberId - ID of the member
   * @param {string} identityKey - Identity key to verify
   * @returns {Promise<boolean>} True if identity key matches
   */
  async verifyIdentityKey(memberId, identityKey) {
    try {
      const result = await identityDb.query(
        `SELECT identity_key FROM safety_numbers WHERE member_id = $1`,
        [memberId],
      );

      if (!result.rows[0] || !result.rows[0].identity_key) {
        return false;
      }

      return crypto.timingSafeEqual(
        Buffer.from(result.rows[0].identity_key),
        Buffer.from(identityKey),
      );
    } catch (error) {
      logger.error("Error verifying identity key:", error);
      return false;
    }
  }

  /**
   * Rotate identity keys periodically
   * @returns {Promise<number>} Number of keys rotated
   */
  async rotateIdentityKeys() {
    try {
      // In a real implementation, this would rotate identity keys for members
      // based on a schedule or security events. For now, we'll just return 0.
      return 0;
    } catch (error) {
      logger.error("Error rotating identity keys:", error);
      return 0;
    }
  }
}

module.exports = new SafetyNumberService();
