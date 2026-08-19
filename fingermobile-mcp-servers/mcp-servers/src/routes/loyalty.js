const express = require("express");
const router = express.Router();
const loyaltyController = require("../controllers/loyaltyController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get member's loyalty program information
router.get(
  "/info",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  loyaltyController.getLoyaltyInfo,
);

// Get member's loyalty rewards
router.get(
  "/rewards",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  loyaltyController.getLoyaltyRewards,
);

// Claim a loyalty reward
router.post(
  "/claim",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  loyaltyController.claimLoyaltyReward,
);

// Add loyalty points to member (admin only in production)
router.post(
  "/points",
  authenticateToken,
  authorizeRoles(["admin"]),
  loyaltyController.addLoyaltyPoints,
);

// Get loyalty tier information
router.get(
  "/tiers",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  loyaltyController.getLoyaltyTiers,
);

module.exports = router;
