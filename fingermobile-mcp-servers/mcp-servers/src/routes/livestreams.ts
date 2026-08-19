const express = require("express");
const router = express.Router();
const livestreamsController = require("../controllers/livestreamsController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Start a livestream (protected route)
router.post(
  "/start",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  livestreamsController.startLivestream,
);

// End a livestream (protected route)
router.post(
  "/end",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  livestreamsController.endLivestream,
);

// Tip a streamer (protected route with RBAC)
router.post(
  "/tip",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  livestreamsController.tipStreamer,
);

// Get a specific livestream
router.get(
  "/:streamId",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  livestreamsController.getLivestream,
);

// Get all active livestreams
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  livestreamsController.getLivestreams,
);

module.exports = router;
