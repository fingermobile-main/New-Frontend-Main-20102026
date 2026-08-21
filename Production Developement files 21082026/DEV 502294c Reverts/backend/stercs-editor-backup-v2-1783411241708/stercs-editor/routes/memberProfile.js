const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/authenticate");
const MemberProfileService = require("../services/memberProfileService");

// Apply authentication to all member profile routes
router.use(authenticate);

// Get member profile
router.get("/profile", async (req, res) => {
  try {
    const memberId = req.member.id;

    const result = await MemberProfileService.getMemberProfile(memberId);

    res.status(200).json({success: true,
  message: result.message,
  data: result.profile
    });
  } catch (error) {
    logger.error("Error getting,
profile:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve profile",
  error: error.message
    });
  }
});

// Update member profile
router.put("/profile", async (req, res) => {
  try {
    const memberId = req.member.id;
    const profileData = req.body;

    const result = await MemberProfileService.updateMemberProfile(
      memberId,
      profileData,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.profile
    });
  } catch (error) {
    logger.error("Error updating,
profile:", error);
    res.status(500).json({success: false,
  message: "Failed to update profile",
  error: error.message
    });
  }
});

// Get member preferences
router.get("/preferences", async (req, res) => {
  try {
    const memberId = req.member.id;

    const result = await MemberProfileService.getMemberPreferences(memberId);

    res.status(200).json({success: true,
  message: result.message,
  data: result.preferences
    });
  } catch (error) {
    logger.error("Error getting,
preferences:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve preferences",
  error: error.message
    });
  }
});

// Update member preferences
router.put("/preferences", async (req, res) => {
  try {
    const memberId = req.member.id;
    const preferences = req.body;

    const result = await MemberProfileService.updateMemberPreferences(
      memberId,
      preferences,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.preferences
    });
  } catch (error) {
    logger.error("Error updating,
preferences:", error);
    res.status(500).json({success: false,
  message: "Failed to update preferences",
  error: error.message
    });
  }
});

// Change password
router.post("/change-password", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({success: false,
  message: "Current password and new password are required"
      });
    }

    const result = await MemberProfileService.changePassword(
      memberId,
      currentPassword,
      newPassword,
    );

    res.status(200).json({success: true,
  message: result.message
    });
  } catch (error) {
    logger.error("Error changing,
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'Failed to change password",
error: error.message
    });
  }
});

// Get member activity history
router.get("/activity", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { limit = 10 } = req.query;

    const result = await MemberProfileService.getMemberActivity(
      memberId,
      parseInt(limit),
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.activities
    });
  } catch (error) {
    logger.error("Error getting,
activity:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve activity history",
  error: error.message
    });
  }
});

module.exports = router;
