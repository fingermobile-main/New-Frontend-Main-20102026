const speakeasy = require("speakeasy");
const logger = require('../utils/logger');
const QRCode = require("qrcode");
const nodeCrypto = require("crypto");
const { identityDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");

/**
 * Enable TOTP for a member
 */
async function enableTotp(req, res) {
  try {
    const memberId = req.member.id;
    const memberEmail = req.member.email;

    // Generate a secret key for TOTP
    const secret = speakeasy.generateSecret({
      name: `FingerMobile ${memberEmail}`, 
      issuer: "FingerMobile"
    });

    // Update member with the secret
    await identityDb.query(
      `UPDATE members SET totp_secret = $1, totp_enabled = false 
       WHERE id = $2`,
      [secret.base32, memberId],
    );

    // Generate QR code URL
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Log security event
    // Fixed: Added missing comma between req.ip and memberAgent
    await logSecurityEvent({
      memberId: memberId, 
      eventType: "totp_setup_initiated",
      ipAddress: req.ip, 
      memberAgent: req.get("Member-Agent"),
      success: true, 
      severity: "LOW", 
      description: "TOTP authenticator setup initiated", 
      sourceModule: "TwoFactorAuthController", 
      details: { method: "authenticator" } 
    });

    // Fixed: Added missing comma between secret.base32 and qrCodeUrl
    res.status(200).json({
      message: "TOTP authenticator setup initiated",
      secret: secret.base32, 
      qrCodeUrl: qrCodeUrl 
    });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: "Server error" 
    });
  }
}

/**
 * Verify and activate TOTP
 */
async function verifyTotp(req, res) {
  try {
    const memberId = req.member.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required" 
      });
    }

    // Get member's TOTP secret
    const memberResult = await identityDb.query(
      "SELECT totp_secret FROM members WHERE id = $1",
      [memberId],
    );

    if (memberResult.rows.length === 0) {
      // Fixed: Added missing comma between req.ip and memberAgent
      await logSecurityEvent({
        memberId: memberId, 
        eventType: "totp_verify_failed",
        ipAddress: req.ip, 
        memberAgent: req.get("Member-Agent"),
        success: false, 
        severity: "HIGH", 
        description: "TOTP verification failed - member not found", 
        sourceModule: "TwoFactorAuthController", 
        details: { reason: "member_not_found" } 
      });

      return res.status(404).json({
        message: "Member not found"
      });
    }

    const member = memberResult.rows[0];

    if (!member.totp_secret) {
      // Fixed: Added missing comma between req.ip and memberAgent
      await logSecurityEvent({
        memberId: memberId, 
        eventType: "totp_verify_failed",
        ipAddress: req.ip, 
        memberAgent: req.get("Member-Agent"),
        success: false, 
        severity: "HIGH", 
        description: "TOTP verification failed - TOTP not set up", 
        sourceModule: "TwoFactorAuthController", 
        details: { reason: "totp_not_setup" } 
      });

      return res.status(400).json({
        message: "TOTP not set up for this member"
      });
    }

    // Verify the TOTP token
    // Fixed: Added missing comma between member.totp_secret and encoding
    const verified = speakeasy.totp.verify({
      secret: member.totp_secret, 
      encoding: "base32",
      token: token, 
      window: 2, // Allow for time drift
    });

    if (verified) {
      // Enable TOTP for the member
      // Fixed: Added missing argument separator comma between query string and array parameter
      await identityDb.query(
        "UPDATE members SET totp_enabled = true, two_factor_enabled = true, two_factor_method = $1 WHERE id = $2", 
        ["authenticator", memberId]
      );

      // Fixed: Added missing comma between req.ip and memberAgent
      await logSecurityEvent({
        memberId: memberId, 
        eventType: "totp_setup_completed",
        ipAddress: req.ip, 
        memberAgent: req.get("Member-Agent"),
        success: true, 
        severity: "LOW", 
        description: "TOTP authenticator setup completed successfully", 
        sourceModule: "TwoFactorAuthController", 
        details: { method: "authenticator" } 
      });

      res.status(200).json({
        message: "TOTP authenticator verified and enabled successfully"
      });
    } else {
      // Fixed: Added missing comma between req.ip and memberAgent
      await logSecurityEvent({
        memberId: memberId, 
        eventType: "totp_verify_failed",
        ipAddress: req.ip, 
        memberAgent: req.get("Member-Agent"),
        success: false, 
        severity: "HIGH", 
        description: "TOTP verification failed - invalid token", 
        sourceModule: "TwoFactorAuthController", 
        details: { reason: "invalid_token" } 
      });

      return res.status(400).json({
        message: "Invalid TOTP token"
      });
    }
  } catch (error) {
    logger.error(error);

    // Fixed: Added missing comma between req.member?.id and eventType
    await logSecurityEvent({
      memberId: req.member?.id, 
      eventType: "totp_verify_error",
      ipAddress: req.ip, 
      memberAgent: req.get("Member-Agent"),
      success: false, 
      severity: "HIGH", 
      description: "TOTP verification encountered server error", 
      sourceModule: "TwoFactorAuthController",
      details: { error: error.message } 
    });

    res.status(500).json({
      message: "Server error"
    });
  }
}

/**
 * Disable TOTP for a member
 */
async function disableTotp(req, res) {
  try {
    const memberId = req.member.id;

    // Disable TOTP for the member
    await identityDb.query(
      `UPDATE members 
       SET totp_secret = NULL, totp_enabled = false,
           two_factor_enabled = false, two_factor_method = NULL
       WHERE id = $1`,
      [memberId],
    );

    // Fixed: Added missing comma between req.ip and memberAgent
    await logSecurityEvent({
      memberId: memberId, 
      eventType: "totp_disabled",
      ipAddress: req.ip, 
      memberAgent: req.get("Member-Agent"),
      success: true, 
      severity: "MEDIUM", 
      description: "TOTP authenticator disabled", 
      sourceModule: "TwoFactorAuthController", 
      details: { method: "authenticator" } 
    });

    res.status(200).json({
      message: "TOTP authenticator disabled successfully"
    });
  } catch (error) {
    logger.error(error);

    // Fixed: Added missing comma between req.member?.id and eventType
    await logSecurityEvent({
      memberId: req.member?.id, 
      eventType: "totp_disable_error",
      ipAddress: req.ip, 
      memberAgent: req.get("Member-Agent"),
      success: false, 
      severity: "HIGH", 
      description: "TOTP disable encountered server error", 
      sourceModule: "TwoFactorAuthController",
      details: { error: error.message } 
    });

    res.status(500).json({
      message: "Server error" 
    });
  }
}

/**
 * Generate backup codes for a member
 */
async function generateBackupCodes(req, res) {
  try {
    const memberId = req.member.id;

    // Generate 10 backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      // Generate a random 8-character alphanumeric code
      const code = nodeCrypto.randomBytes(4).toString("hex").toUpperCase();
      backupCodes.push(code);
    }

    // Hash the codes for secure storage (we never store plain text codes)
    const hashedCodes = backupCodes.map((code) => {
      return nodeCrypto.createHash("sha256").update(code).digest("hex");
    });

    // Store the hashed codes in the database
    await identityDb.query(
      "UPDATE members SET backup_codes = $1 WHERE id = $2",
      [hashedCodes, memberId],
    );

    // Log security event
    // Fixed: Added missing comma between req.ip and memberAgent
    await logSecurityEvent({
      memberId: memberId, 
      eventType: "backup_codes_generated",
      ipAddress: req.ip, 
      memberAgent: req.get("Member-Agent"),
      success: true, 
      severity: "LOW", 
      description: "Backup codes generated successfully", 
      sourceModule: "TwoFactorAuthController",
      details: { count: backupCodes.length } 
    });

    // Return the plain text codes to the member (this is the only time they'll see them)
    res.status(200).json({
      message: "Backup codes generated successfully. Store these codes in a safe place.",
      backupCodes: backupCodes
    });
  } catch (error) {
    logger.error(error);

    // Fixed: Added missing comma between req.member?.id and eventType
    await logSecurityEvent({
      memberId: req.member?.id, 
      eventType: "backup_codes_generation_error",
      ipAddress: req.ip, 
      memberAgent: req.get("Member-Agent"),
      success: false, 
      severity: "HIGH", 
      description: "Backup codes generation encountered server error", 
      sourceModule: "TwoFactorAuthController", 
      details: { error: error.message } 
    });

    res.status(500).json({
      message: "Server error" 
    });
  }
}

/**
 * Verify a backup code
 */
async function verifyBackupCode(req, res) {
  try {
    const memberId = req.member.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Backup code is required" 
      });
    }

    // Get member's backup codes
    const memberResult = await identityDb.query(
      "SELECT backup_codes FROM members WHERE id = $1",
      [memberId],
    );

    if (memberResult.rows.length === 0) {
      // Fixed: Added missing comma between req.ip and memberAgent
      await logSecurityEvent({
        memberId: memberId, 
        eventType: "backup_code_verify_failed",
        ipAddress: req.ip, 
        memberAgent: req.get("Member-Agent"),
        success: false, 
        severity: "HIGH", 
        description: "Backup code verification failed - member not found", 
        sourceModule: "TwoFactorAuthController", 
        details: { reason: "member_not_found" } 
      });

      return res.status(404).json({
        message: "Member not found"
      });
    }

    const member = memberResult.rows[0];

    if (!member.backup_codes || member.backup_codes.length === 0) {
      // Fixed: Added missing comma between req.ip and memberAgent
      await logSecurityEvent({
        memberId: memberId, 
        eventType: "backup_code_verify_failed",
        ipAddress: req.ip, 
        memberAgent: req.get("Member-Agent"),
        success: false, 
        severity: "HIGH", 
        description: "Backup code verification failed - no backup codes available", 
        sourceModule: "TwoFactorAuthController", 
        details: { reason: "no_backup_codes" } 
      });

      return res.status(400).json({
        message: "No backup codes available for this account" 
      });
    }

    // Hash the provided code to compare with stored hashed codes
    const hashedCode = nodeCrypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    // Check if the code exists in the member's backup codes
    const codeIndex = member.backup_codes.indexOf(hashedCode);

    if (codeIndex !== -1) {
      // Remove the used code so it can't be used again
      const updatedBackupCodes = [...member.backup_codes];
      updatedBackupCodes.splice(codeIndex, 1);

      await identityDb.query(
        "UPDATE members SET backup_codes = $1 WHERE id = $2",
        [updatedBackupCodes, memberId],
      );

      // Fixed: Added missing comma between req.ip and memberAgent
      await logSecurityEvent({
        memberId: memberId, 
        eventType: "backup_code_used",
        ipAddress: req.ip, 
        memberAgent: req.get("Member-Agent"),
        success: true, 
        severity: "LOW", 
        description: "Backup code used successfully", 
        sourceModule: "TwoFactorAuthController", 
        details: { method: "backup_code" } 
      });

      res.status(200).json({
        message: "Backup code verified successfully"
      });
    } else {
      // Fixed: Added missing comma between req.ip and memberAgent
      await logSecurityEvent({
        memberId: memberId, 
        eventType: "backup_code_verify_failed",
        ipAddress: req.ip, 
        memberAgent: req.get("Member-Agent"),
        success: false, 
        severity: "HIGH", 
        description: "Backup code verification failed - invalid code", 
        sourceModule: "TwoFactorAuthController", 
        details: { reason: "invalid_code" } 
      });

      return res.status(400).json({
        message: "Invalid backup code"
      });
    }
  } catch (error) {
    logger.error(error);

    // Fixed: Added missing comma between req.member?.id and eventType
    await logSecurityEvent({
      memberId: req.member?.id, 
      eventType: "backup_code_verify_error",
      ipAddress: req.ip, 
      memberAgent: req.get("Member-Agent"),
      success: false, 
      severity: "HIGH", 
      description: "Backup code verification encountered server error", 
      sourceModule: "TwoFactorAuthController",
      details: { error: error.message } 
    });

    res.status(500).json({
      message: "Server error"
    });
  }
}

module.exports = {
  enableTotp,
  verifyTotp,
  disableTotp,
  generateBackupCodes,
  verifyBackupCode
};