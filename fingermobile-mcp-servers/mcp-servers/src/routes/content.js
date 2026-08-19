const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create new content
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  contentController.createContent,
);

// Get all contents with optional filters
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  contentController.getContents,
);

// Get content by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  contentController.getContentById,
);

// Update content by ID
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  contentController.updateContent,
);

// Delete content by ID
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  contentController.deleteContent,
);

module.exports = router;
