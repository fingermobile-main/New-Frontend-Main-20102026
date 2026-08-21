const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");
const bcrypt = require("bcryptjs");

// Mock biometric hardware interface
const biometricHardware = {
  fingerprint: {
    capture: async () => {
      // In a real implementation, this would interface with fingerprint hardware
      // For demo purposes, we'll just return a mock template
      return `FP_TEMPLATE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    verify: async (storedTemplate, newTemplate) => {
      // In a real implementation, this would compare biometric templates
      // For demo purposes, we'll just do a simple comparison
      return storedTemplate === newTemplate;
    }
  },

  face: {
    capture: async () => {
      // In a real implementation, this would interface with camera hardware
      // For demo purposes, we'll just return a mock template
      return `FACE_TEMPLATE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    verify: async (storedTemplate, newTemplate) => {
      // In a real implementation, this would compare facial recognition templates
      // For demo purposes, we'll just do a simple comparison
      return storedTemplate === newTemplate;
    }
  },

  voice: {
    capture: async () => {
      // In a real implementation, this would interface with microphone hardware
      // For demo purposes, we'll just return a mock template
      return `VOICE_TEMPLATE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    verify: async (storedTemplate, newTemplate) => {
      // In a real implementation, this would compare voice recognition templates
      // For demo purposes, we'll just do a simple comparison
      return storedTemplate === newTemplate;
    }
  },

  iris: {
    capture: async () => {
      // In a real implementation, this would interface with iris scanning hardware
      // For demo purposes, we'll just return a mock template
      return `IRIS_TEMPLATE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    verify: async (storedTemplate, newTemplate) => {
      // In a real implementation, this would compare iris scan templates
      // For demo purposes, we'll just do a simple comparison
      return storedTemplate === newTemplate;
    }
  }
};

class FICBiometricService {
  // Register biometric data
  static async registerBiometric(memberId, biometricType) {
    if (!biometricHardware[biometricType]) {
      throw new Error(`Unsupported biometric type: ${biometricType}`);
    }

    // Capture biometric template
    const rawTemplate = await biometricHardware[biometricType].capture();

    // Hash the template for secure storage
    const hashRounds = 10;
    const hashedTemplate = await bcrypt.hash(rawTemplate, hashRounds);

    // Store biometric record
    const result = await monetizationDb.query(
      `INSERT INTO fics_biometric_records 
       (member_id, biometric_type, biometric_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [memberId, biometricType, hashedTemplate],
    );

    // Log security event
    await logSecurityEvent({
      memberId: memberId,
      eventType: "BIOMETRIC_REGISTERED",
      ipAddress: null,
      memberAgent: null,
      success: true,
      severity: "LOW",
      description: `Biometric registered for member ${memberId}`,
      sourceModule: "FICBiometricService",
      details: {
        biometricId: result.rows[0].id,
        type: biometricType
      }
    });

    return {
      success: true,
      biometricId: result.rows[0].id,
      type: biometricType,
      message: "Biometric data registered successfully"
    };
  }

  // Verify biometric data
  static async verifyBiometric(memberId, biometricType, providedTemplate) {
    // Get stored biometric record
    const result = await monetizationDb.query(
      `SELECT * FROM fics_biometric_records 
       WHERE member_id = $1 AND biometric_type = $2`,
      [memberId, biometricType],
    );

    if (result.rows.length === 0) {
      throw new Error(
        `No biometric data found for ${biometricType} and member ${memberId}`,
      );
    }

    const storedRecord = result.rows[0];

    // Compare provided template with stored template
    const isVerified = await biometricHardware[biometricType].verify(
      storedRecord.biometric_hash,
      providedTemplate,
    );

    if (isVerified) {
      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: "BIOMETRIC_VERIFIED",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `Biometric verified for member ${memberId}`,
        sourceModule: "FICBiometricService",
        details: {
          biometricId: storedRecord.id,
          type: biometricType
        }
      });

      return {
        success: true,
        message: "Biometric verification successful"
      };
    }

    throw new Error("Biometric verification failed");
  }

  // Get member's biometric records
  static async getBiometricRecords(memberId) {
    const result = await monetizationDb.query(
      `SELECT id, biometric_type, is_active, created_at 
       FROM fics_biometric_records 
       WHERE member_id = $1`,
      [memberId],
    );
    return result.rows;
  }
}

module.exports = FICBiometricService;
