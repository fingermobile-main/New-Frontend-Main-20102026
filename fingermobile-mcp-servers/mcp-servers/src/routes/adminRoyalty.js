/* global require, module */
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const adminRoyaltyController = require("../controllers/adminRoyaltyController");

// Admin routes for royalty management
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminRoyaltyController.getAllRoyalties,
);
router.get(
  "/:artistId",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminRoyaltyController.getArtistRoyaltiesAdmin,
);
router.put(
  "/:royaltyId",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminRoyaltyController.updateRoyaltyRecord,
);
router.delete(
  "/:royaltyId",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminRoyaltyController.deleteRoyaltyRecord,
);

module.exports = router;
