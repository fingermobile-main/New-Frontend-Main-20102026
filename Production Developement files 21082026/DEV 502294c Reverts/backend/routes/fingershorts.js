const express = require('express');
const fingershorts = require('../controllers/fingershortsController.js');
const { authenticate } = require('../middleware/authenticate');
const { contentDb } = require("../db");
const router = express.Router();

// Feed endpoints (frontend expectations)
router.get("/for-you", authenticate, fingershorts.getForYou);
router.get("/following", authenticate, fingershorts.getFollowing);
router.get("/trending", authenticate, fingershorts.getTrending);

// Video CRUD
router.get("/videos", fingershorts.getAll);
router.get("/videos/:id", authenticate, fingershorts.getById);
router.post("/videos", authenticate, fingershorts.create);
router.put("/videos/:id", authenticate, fingershorts.update);
router.delete("/videos/:id", authenticate, fingershorts.delete);

// Interactions
router.post("/videos/:id/view", authenticate, fingershorts.recordView);
router.post("/videos/:id/like", authenticate, fingershorts.toggleLike);
router.get("/videos/:id/comments", authenticate, fingershorts.getComments);
router.post("/videos/:id/comments", authenticate, fingershorts.addComment);
router.delete("/comments/:id", authenticate, fingershorts.deleteComment);

// ML Algorithm Metrics (admin only)
router.get("/metrics/algorithm", authenticate, fingershorts.getAlgorithmMetrics);

module.exports = router;
