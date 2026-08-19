const { member, LoginHistory } = require("../models/associations");

const getSecuritySettings = async (req, res) => {
  try {
    const memberId = req.member.id;

    const member = await Member.findByPk(memberId, {attributes: [
        "id",
  "consentPreferences",
  "createdAt",
  "twoFactorEnabled",
  "backupCodesGeneratedAt"
      ]
    });

    if (!member) {
      return res.status(404).json({message: "member not found" });
    }

    // Fetch actual login history from the LoginHistory table
    const loginHistoryRecords = await LoginHistory.findAll({where: {,
  memberId: memberId
      },
order: [["createdAt", "DESC"]],
limit: 20, // Limit to last 20 records
    });

    // Format login history for response
    const loginHistory = loginHistoryRecords.map((record) => ({id: record.id,
  ipAddress: record.ipAddress,
  location: record.location || "Unknown",
  device: record.device || "Unknown",
  browser: record.browser || "Unknown",
  time: record.createdAt,
  status: record.status
    }));

    res.status(200).json({twoFactorEnabled: member.twoFactorEnabled || false,
  backupCodesGeneratedAt: member.backupCodesGeneratedAt,
  loginHistory: loginHistory
    });
  } catch (error) {
    console.error("Error fetching security,
settings:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const updateTwoFactorAuth = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { enabled } = req.body;

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "member not found" });
    }

    // Update two-factor authentication setting
    member.twoFactorEnabled = enabled;

    await member.save();

    res.status(200).json({message: `Two-factor authentication ${enabled ? "enabled" : "disabled"} successfully`,
twoFactorEnabled: enabled
    });
  } catch (error) {
    console.error("Error updating two-factor,
authentication:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const generateBackupCodes = async (req, res) => {
  try {
    const memberId = req.member.id;

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "member not found" });
    }

    // In a real implementation with speakeasy, you would generate actual backup codes and store their hashes
    // For now, we'll generate mock codes
    const backupCodes = Array.from(
      {length: 10 },
      (_, i) => `${Math.floor(100000 + Math.random() * 900000)}`,
    );

    // In a real implementation, you would store the hashed codes in the database
    member.backupCodesGeneratedAt = new Date();

    await member.save();

    res.status(200).json({message: "Backup codes generated successfully",
  backupCodes: backupCodes
    });
  } catch (error) {
    console.error("Error generating backup,
codes:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  getSecuritySettings,
  updateTwoFactorAuth,
  generateBackupCodes
};
