const express = require("express");
const router = express.Router();
const gemsController = require("../controllers/gemsController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get member's gem balance
router.get(
  "/balance",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  gemsController.getGemBalance,
);

// Get gem transactions history
router.get(
  "/transactions",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  gemsController.getGemTransactions,
);

// Send gems to another member
router.post(
  "/send",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  gemsController.sendGems,
);

// Get gem earnings
router.get(
  "/earnings",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  gemsController.getGemEarnings,
);

// Convert gems to earnings (creator monetization)
router.post(
  "/convert",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  gemsController.convertGemsToEarnings,
);

module.exports = router;
