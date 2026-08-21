const express = require("express");
const forumsController = require('../controllers/forumsController.js');
const { authenticate } = require("../middleware/authenticate");
const router = express.Router();

// Get all forum posts (NEW - must be before :forumId to avoid conflicts)
router.get("/posts", forumsController.getAllPosts);

// Get all forum categories
router.get("/categories", forumsController.getCategories);

// Get all forums
router.get("/", forumsController.getAll);

// Get a specific forum by ID
router.get("/:forumId", forumsController.getById);

// Get threads in a forum
router.get("/:forumId/threads", forumsController.getThreads);

// Create a new thread in a forum
router.post("/:forumId/threads", authenticate, forumsController.createThread);

// Get a specific thread
router.get("/threads/:threadId", forumsController.getThreadById);

// Get posts in a thread
router.get("/threads/:threadId/posts", forumsController.getThreadPosts);

// Reply to a thread
router.post("/threads/:threadId/reply", authenticate, forumsController.replyToThread);

// Create a new forum
router.post("/", authenticate, forumsController.create);

module.exports = router;
