const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get all active sessions for the authenticated member
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  sessionController.getActiveSessions,
);

// Terminate a specific session
router.delete(
  "/:sessionId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  sessionController.terminateSession,
);

// Terminate all sessions except the current one
router.delete(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  sessionController.terminateAllSessions,
);

// Refresh session tokens
router.post("/refresh", sessionController.refreshSession);

module.exports = router;
