/* global require, module */
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// member registration
router.post("/register", authController.register);

// member login
router.post("/login", authController.login);

// Get member profile (protected route)
router.get(
  "/me",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  authController.getProfile,
);

// Update member profile (protected route)
router.put(
  "/me",
  authenticateToken,
  authorizeRoles(["admin"]),
  authController.updateProfile,
);

// Token refresh
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
