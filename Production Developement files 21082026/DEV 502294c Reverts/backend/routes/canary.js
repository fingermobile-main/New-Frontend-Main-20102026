const express = require('express');
const canary = require('../controllers/canaryController.js');
const { authenticate } = require('../middleware/authenticate');
const { controlDb } = require("../db");
const router = express.Router();

// Existing routes
router.get("/alerts", canary.getAll);
router.get("/alerts/:id", canary.getById);
router.post("/alerts", canary.create);
router.put("/alerts/:id/resolve", authenticate, canary.update);
router.delete("/alerts/:id", authenticate, canary.delete);
router.get("/subscriptions", authenticate, canary.getAll);
router.post("/subscriptions", authenticate, canary.create);
router.put("/subscriptions/:id", authenticate, canary.update);
router.delete("/subscriptions/:id", authenticate, canary.delete);
router.get("/stats", canary.getAll);

// ML-optimized routes for trending content
router.get("/trending", canary.getTrendingContent);
router.get("/metrics/algorithm", canary.getAlgorithmMetrics);
router.post("/track-interaction", authenticate, canary.trackInteraction);

module.exports = router;
