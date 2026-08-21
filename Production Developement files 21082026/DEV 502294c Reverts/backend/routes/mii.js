const express = require('express');
const mii = require('../controllers/miiController.js');
const { authenticate } = require('../middleware/authenticate');
const { socialDb } = require("../db");
const router = express.Router();

// Existing routes
router.get("/updates", authenticate, mii.getAll);
router.post("/updates", authenticate, mii.create);
router.post("/updates/:updateId/like", authenticate, mii.create);
router.post("/updates/:updateId/view", authenticate, mii.create);
router.get("/stats", authenticate, mii.getAll);
router.get("/profile/:memberId", authenticate, mii.getById);
router.put("/profile", authenticate, mii.update);
router.post("/voice-line/trigger", authenticate, mii.create);
router.get("/analytics", authenticate, mii.getAll);
router.get("/monetization", authenticate, mii.getAll);
router.post("/follow/:targetMemberId", authenticate, mii.create);

// ML-optimized routes
router.get("/recommendations", authenticate, mii.getRecommendations);
router.get("/metrics/algorithm", authenticate, mii.getAlgorithmMetrics);
router.post("/track-interaction", authenticate, mii.trackInteraction);

module.exports = router;
