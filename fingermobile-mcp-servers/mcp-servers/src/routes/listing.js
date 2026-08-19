const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create a new listing
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  listingController.createListing,
);

// Get all listings with optional filters
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  listingController.getListings,
);

// Get a single listing by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  listingController.getListingById,
);

// Update a listing by ID
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  listingController.updateListing,
);

// Delete a listing by ID
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  listingController.deleteListing,
);

module.exports = router;
