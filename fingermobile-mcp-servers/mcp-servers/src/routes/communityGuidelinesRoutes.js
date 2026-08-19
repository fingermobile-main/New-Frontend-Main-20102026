const express = require("express");
const router = express.Router();
const communityGuidelinesController = require("../controllers/communityGuidelinesController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Route to get all community guidelines
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  communityGuidelinesController.getAllGuidelines,
);

// Route to get a specific guideline by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  communityGuidelinesController.getGuidelineById,
);

// Route to create a new guideline (admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  communityGuidelinesController.createGuideline,
);

// Route to update a guideline (admin only)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  communityGuidelinesController.updateGuideline,
);

// Route to delete a guideline (admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  communityGuidelinesController.deleteGuideline,
);

module.exports = router;
