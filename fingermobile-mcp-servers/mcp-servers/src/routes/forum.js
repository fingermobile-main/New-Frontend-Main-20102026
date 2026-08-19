const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Forums
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  forumController.createForum,
);
router.get("/", forumController.getAllForums);
router.get("/:id", forumController.getForumById);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  forumController.updateForum,
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  forumController.deleteForum,
);

// Forum Threads
router.post(
  "/:forumId/threads",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  forumController.createForumThread,
);
router.get("/:forumId/threads", forumController.getAllForumThreads);
router.get("/threads/:id", forumController.getForumThreadById);
router.put(
  "/threads/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  forumController.updateForumThread,
);
router.delete(
  "/threads/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  forumController.deleteForumThread,
);

// Forum Posts
router.post(
  "/threads/:threadId/posts",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  forumController.createForumPost,
);
router.get("/threads/:threadId/posts", forumController.getAllForumPosts);
router.get("/posts/:id", forumController.getForumPostById);
router.put(
  "/posts/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  forumController.updateForumPost,
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  forumController.deleteForumPost,
);

module.exports = router;
