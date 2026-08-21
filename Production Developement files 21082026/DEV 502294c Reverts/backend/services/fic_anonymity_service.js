const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");

class FICAnonymityService {
  // Get default anonymity settings
  static getDefaultSettings() {
    return {
      anonymityLevel: 1, // Default to full traceable
      transactionMasking: true,
      profileMasking: true
    };
  }

  // Get member's anonymity settings
  static async getMemberAnonymitySettings(memberId) {
    const result = await monetizationDb.query(
      `SELECT * FROM fics_anonymity_settings WHERE member_id = $1`,
      [memberId],
    );

    // Return default settings if none found
    if (result.rows.length === 0) {
      return this.getDefaultSettings();
    }

    return result.rows[0];
  }

  // Update member's anonymity settings
  static async updateAnonymitySettings(memberId, settings) {
    const { anonymityLevel, transactionMasking, profileMasking } = settings;

    // Validate anonymity level
    if (anonymityLevel < 1 || anonymityLevel > 5) {
      throw new Error("Anonymity level must be between 1 and 5");
    }

    const result = await monetizationDb.query(
      `INSERT INTO fics_anonymity_settings 
       (member_id, anonymity_level, transaction_masking, profile_masking)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (member_id) DO UPDATE
       SET anonymity_level = EXCLUDED.anonymity_level,
           transaction_masking = EXCLUDED.transaction_masking,
           profile_masking = EXCLUDED.profile_masking,
           updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [memberId, anonymityLevel, transactionMasking, profileMasking],
    );

    // Log security event
    await logSecurityEvent({
      memberId: memberId,
      eventType: "ANONYMITY_SETTINGS_UPDATED",
      ipAddress: null,
      memberAgent: null,
      success: true,
      severity: "LOW",
      description: `Anonymity settings updated for member ${memberId}`,
      sourceModule: "FICAnonymityService",
      details: {
        settingsId: result.rows[0].id,
        anonymityLevel: anonymityLevel
      }
    });

    return result.rows[0];
  }

  // Check if transaction should be masked based on member settings
  static async shouldMaskTransaction(memberId, transactionId) {
    const settings = await this.getMemberAnonymitySettings(memberId);
    return settings.transaction_masking;
  }

  // Check if profile should be masked based on member settings
  static async shouldMaskProfile(memberId) {
    const settings = await this.getMemberAnonymitySettings(memberId);
    return settings.profile_masking;
  }
}

module.exports = FICAnonymityService;
