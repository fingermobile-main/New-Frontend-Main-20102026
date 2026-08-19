/* global require, module */
const express = require("express");
const router = express.Router();
const adminArtistController = require("../controllers/adminArtistController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Admin routes for artist management
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminArtistController.getAllArtists,
);
router.put(
  "/:artistId",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminArtistController.updateArtist,
);
router.delete(
  "/:artistId",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminArtistController.deleteArtist,
);

module.exports = router;
