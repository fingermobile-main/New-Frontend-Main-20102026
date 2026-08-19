const express = require("express");
const router = express.Router();
const connectionController = require("../controllers/connectionController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Send a connection request
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  connectionController.sendConnectionRequest,
);

// Get connection requests
router.get(
  "/requests",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  connectionController.getConnectionRequests,
);

// Get connection status with a specific member
router.get(
  "/status/:targetmemberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  connectionController.getConnectionStatus,
);

// Accept a connection request
router.put(
  "/accept/:connectionId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  connectionController.acceptConnectionRequest,
);

// Reject a connection request
router.put(
  "/reject/:connectionId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  connectionController.rejectConnectionRequest,
);

// Remove a connection
router.delete(
  "/:targetmemberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  connectionController.removeConnection,
);

// Get all connections
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  connectionController.getConnections,
);

// Block a member
router.post(
  "/block/:targetmemberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  connectionController.blockmember,
);

module.exports = router;
