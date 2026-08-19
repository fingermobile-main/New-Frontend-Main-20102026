/* global require, module */
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const adminMusicController = require("../controllers/adminMusicController");

// Admin routes for music management
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminMusicController.getAllMusicTracks,
);
router.put(
  "/:trackId",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminMusicController.updateMusicTrack,
);
router.delete(
  "/:trackId",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminMusicController.deleteMusicTrack,
);

module.exports = router;
