const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create a new wallet for a member
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  walletController.createWallet,
);

// Get wallet by memberId
router.get(
  "/:memberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  walletController.getWalletBymemberId,
);

// Update wallet balance (deposit/withdrawal)
router.put(
  "/:memberId/balance",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  walletController.updateWalletBalance,
);

// Delete wallet by memberId
router.delete(
  "/:memberId",
  authenticateToken,
  authorizeRoles(["admin"]),
  walletController.deleteWallet,
);

module.exports = router;
