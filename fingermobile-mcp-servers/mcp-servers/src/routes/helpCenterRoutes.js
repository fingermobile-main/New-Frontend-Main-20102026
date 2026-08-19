const express = require("express");
const router = express.Router();
const helpCenterController = require("../controllers/helpCenterController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Route to get all help articles
router.get(
  "/articles",
  authenticateToken,
  authorizeRoles(["admin", "member", "editor"]),
  helpCenterController.getAllArticles,
);

// Route to get a specific help article by ID
router.get(
  "/articles/:id",
  authenticateToken,
  authorizeRoles(["admin", "member", "editor"]),
  helpCenterController.getArticleById,
);

module.exports = router;
