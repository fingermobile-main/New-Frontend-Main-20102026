const express = require('express');
const router = express.Router();
const achievementsController = require('../controllers/achievementsController');
const { authenticate } = require('../middleware/authenticate');

// All achievement routes require authentication
router.use(authenticate);

// Get user achievements
router.get('/', achievementsController.getUserAchievements);

// Get all available achievements
router.get('/available', achievementsController.getAvailableAchievements);

// Claim achievement reward
router.post('/:achievementId/claim', achievementsController.claimAchievement);

// Get achievement leaderboard
router.get('/leaderboard', achievementsController.getLeaderboard);

module.exports = router;
