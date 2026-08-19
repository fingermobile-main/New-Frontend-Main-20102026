const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Blog Posts
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  blogController.createBlogPost,
);
router.get("/", blogController.getAllBlogPosts);
router.get("/:id", blogController.getBlogPostById);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  blogController.updateBlogPost,
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  blogController.deleteBlogPost,
);

// Blog Categories
router.post(
  "/categories",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  blogController.createBlogCategory,
);
router.get("/categories", blogController.getAllBlogCategories);
router.get("/categories/:id", blogController.getBlogCategoryById);
router.put(
  "/categories/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  blogController.updateBlogCategory,
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  blogController.deleteBlogCategory,
);

module.exports = router;
