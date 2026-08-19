const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create a new comment
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  commentController.createComment,
);

// Get all comments for a specific contentId
router.get(
  "/content/:contentId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  commentController.getCommentsByContentId,
);

// Get a single comment by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  commentController.getCommentById,
);

// Update a comment by ID
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  commentController.updateComment,
);

// Delete a comment by ID
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  commentController.deleteComment,
);

module.exports = router;
