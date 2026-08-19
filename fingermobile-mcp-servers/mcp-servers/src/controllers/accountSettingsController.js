const { member } = require("../models/associations");
const bcrypt = require("bcryptjs");
const { encrypt, decrypt } = require("../utils/encryptionUtils");

const getAccountSettings = async (req, res) => {
  try {
    const memberId = req.member.id;
    const member = await Member.findByPk(memberId, {attributes: ["id", "membername", "email", "createdAt"]
    });

    if (!member) {
      return res.status(404).json({message: "member not found" });
    }

    // In a real implementation, we would also fetch notification preferences from a separate table
    // For now, we'll return placeholder values
    const settings = {email: member.email,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true
    };

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching account,
settings:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({message: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({message: "New password must be at least 8 characters long" });
    }

    // Fetch member with password hash
    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "member not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, member.passwordHash);
    if (!isMatch) {
      return res.status(400).json({message: "Current password is incorrect" });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    member.passwordHash = newPasswordHash;
    await member.save();

    res.status(200).json({message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing,
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'Server error",
error: error.message });
  }
};

const updateEmail = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({message: "Email is required" });
    }

    // Check if email is already taken
    const existingmember = await member.findOne({where: {,
  email: encrypt(email) }
    });
    if (existingmember && existingmember.id !== memberId) {
      return res.status(400).json({message: "Email is already in use" });
    }

    // Update email
    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "member not found" });
    }

    member.email = email;
    await member.save();

    res
      .status(200)
      .json({message: "Email updated successfully",
  email: member.email });
  } catch (error) {
    console.error("Error updating,
email:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const updateNotifications = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { emailNotifications, smsNotifications, pushNotifications } =
      req.body;

    // In a real implementation, we would update notification preferences in a separate table
    // For now, we'll just return a success response
    console.log("Updating notification preferences for member", memberId, {
      emailNotifications,
      smsNotifications,
      pushNotifications
    });

    res.status(200).json({message: "Notification preferences updated successfully",
  preferences: {,
  emailNotifications:
          emailNotifications !== undefined ?,
  emailNotifications : true,
  smsNotifications:
          smsNotifications !== undefined ?,
  smsNotifications : false,
  pushNotifications:
          pushNotifications !== undefined ?,
  pushNotifications : true
      }
    });
  } catch (error) {
    console.error("Error updating notification,
preferences:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  getAccountSettings,
  changePassword,
  updateEmail,
  updateNotifications
};
