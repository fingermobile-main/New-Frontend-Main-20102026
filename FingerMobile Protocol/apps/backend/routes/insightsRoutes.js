/**
 * insightsRoutes.js
 * Express routes for Creator Insights & AI Recommendations
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/insightsController');

router.get('/creator', controller.getCreatorInsights);
router.get('/ai-recommendations', controller.getAiRecommendations);
router.get('/export', controller.exportReport);

module.exports = router;
