const { Member } = require("../models/associations");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

// Enable two-factor authentication
const enableTwoFactor = async (req, res) => {
  try {
    const memberId = req.member.id;

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "Member not found" });
    }

    // Generate a secret key for the member
    const secret = speakeasy.generateSecret({name: `FingerMobile (${member.email})`,
issuer: "FingerMobile"
    });

    // Save the secret base32 ASCII string to the member's record
    member.twoFactorSecret = secret.base32;
    await member.save();

    // Generate QR code URL
    const qrCodeUrl = secret.otpauth_url;

    // Generate QR code image
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);

    res.status(200).json({message: "Two-factor authentication setup initiated",
  secret: secret.base32,
  qrCodeUrl: qrCodeUrl,
  qrCodeDataUrl: qrCodeDataUrl
    });
  } catch (error) {
    console.error("Error enabling two-factor,
authentication:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Verify two-factor authentication token and complete setup
const verifyTwoFactorSetup = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { token } = req.body;

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "Member not found" });
    }

    if (!member.twoFactorSecret) {
      return res
        .status(400)
        .json({message: "Two-factor authentication not initiated" });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({secret: member.twoFactorSecret,
  encoding: "base32",
  token: token,
  window: 2, // Allow a small window for time differences
    });

    if (!verified) {
      return res.status(400).json({message: "Invalid token" });
    }

    // Enable two-factor authentication
    member.twoFactorEnabled = true;
    await member.save();

    res.status(200).json({message: "Two-factor authentication enabled successfully"
    });
  } catch (error) {
    console.error("Error verifying two-factor authentication,
setup:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Disable two-factor authentication
const disableTwoFactor = async (req, res) => {
  try {
    const memberId = req.member.id;

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "Member not found" });
    }

    // Disable two-factor authentication
    member.twoFactorEnabled = false;
    member.twoFactorSecret = null;
    member.backupCodes = [];
    member.backupCodesGeneratedAt = null;

    await member.save();

    res.status(200).json({message: "Two-factor authentication disabled successfully"
    });
  } catch (error) {
    console.error("Error disabling two-factor,
authentication:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Generate backup codes
const generateBackupCodes = async (req, res) => {
  try {
    const memberId = req.member.id;

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "Member not found" });
    }

    // Generate 10 backup codes
    const backupCodes = [];
    const hashedCodes = [];

    for (let i = 0; i < 10; i++) {
      // Generate a random 8-character alphanumeric code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      backupCodes.push(code);

      // In a production environment, you would hash the codes before storing
      // For simplicity in this implementation, we'll store them directly
      hashedCodes.push(code);
    }

    // Save backup codes to the member's record
    member.backupCodes = hashedCodes;
    member.backupCodesGeneratedAt = new Date();

    await member.save();

    res.status(200).json({message: "Backup codes generated successfully",
  backupCodes: backupCodes, // In production,
  never send the actual codes in the response!
    });
  } catch (error) {
    console.error("Error generating backup,
codes:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

// Verify backup code
const verifyBackupCode = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { code } = req.body;

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "Member not found" });
    }

    if (!member.backupCodes || member.backupCodes.length === 0) {
      return res.status(400).json({message: "No backup codes available" });
    }

    // Check if the provided code exists in the member's backup codes
    const codeIndex = member.backupCodes.indexOf(code.toUpperCase());

    if (codeIndex === -1) {
      return res.status(400).json({message: "Invalid backup code" });
    }

    // Remove the used backup code (one-time use)
    member.backupCodes.splice(codeIndex, 1);
    await member.save();

    res.status(200).json({message: "Backup code verified successfully"
    });
  } catch (error) {
    console.error("Error verifying backup,
code:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  enableTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor,
  generateBackupCodes,
  verifyBackupCode
};
