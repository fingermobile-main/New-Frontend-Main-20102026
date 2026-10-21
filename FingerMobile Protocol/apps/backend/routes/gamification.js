/* eslint-disable no-unused-vars */
const express = require('express');
const gamification = require('../controllers/gamificationController.js');
const { authenticate } = require('../middleware/authenticate');
const { socialDb } = require('../db');
const router = express.Router();

router.get('/profile/:memberId', authenticate, gamification.getById);
router.get('/achievements/:memberId', gamification.getById);
router.get('/achievements', gamification.getAll);
router.get('/badges/:memberId', gamification.getById);
router.get('/leaderboard', gamification.getAll);
router.get('/progress/:memberId', gamification.getById);
router.get('/streak/:memberId', gamification.getById);
router.post('/update-streak/:memberId', gamification.create);
router.post('/award-points', gamification.create);

module.exports = router;
