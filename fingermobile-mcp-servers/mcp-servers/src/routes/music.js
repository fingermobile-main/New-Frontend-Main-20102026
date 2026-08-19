const express = require("express");
const router = express.Router();
const musicController = require("../controllers/musicController");
const royaltyController = require("../controllers/royaltyController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Route for uploading music
router.post(
  "/upload",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  musicController.uploadMusic,
);

// Route for recording a track play
router.post(
  "/play",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  royaltyController.recordTrackPlay,
);

module.exports = router;
