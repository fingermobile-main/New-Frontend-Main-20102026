const express = require("express");
const router = express.Router();
const discoveryController = require("../controllers/discoveryController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// GET /api/discovery/content - Get discoverable content
router.get(
  "/content",
  authenticateToken,
  authorizeRoles(["admin", "member", "editor", "developer"]),
  discoveryController.getDiscoveryContent,
);

module.exports = router;
