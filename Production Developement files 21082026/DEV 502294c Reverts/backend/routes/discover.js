const express = require('express');
const discover = require('../controllers/discoverController.js');
const { contentDb, monetizationDb } = require("../db");
const router = express.Router();

// Existing routes
router.get("/content", discover.getAll);
router.get("/featured", discover.getAll);
router.get("/categories/:category", discover.getById);
router.get("/creators", discover.getAll);
router.get("/suggested/:memberId", discover.getById);
router.get("/broadcasts", discover.getAll);

// ML-optimized routes
router.get("/personalized", discover.getPersonalized);
router.get("/metrics/algorithm", discover.getAlgorithmMetrics);
router.post("/track-interaction", discover.trackInteraction);

module.exports = router;
