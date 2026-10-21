const express = require('express');
const supervi_game = require('../controllers/supervi_gameController.js');
const router = express.Router();

// Optional JWT extraction helper
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const jwt = require('jsonwebtoken');
      const { JWT_SECRET } = require('../config');
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      const decoded = jwt.verify(token, JWT_SECRET || 'dev_jwt_secret');
      req.user = decoded;
    } catch (_) {
      // Allow guest execution
    }
  }
  next();
};

router.get('/characters', (req, res) => supervi_game.getCharacters(req, res));
router.post('/sessions/start', optionalAuth, (req, res) => supervi_game.startSession(req, res));
router.post('/sessions/:id/end', optionalAuth, (req, res) => supervi_game.endSession(req, res));
router.get('/powerups', (req, res) => supervi_game.getPowerups(req, res));
router.get('/challenges/daily', (req, res) => supervi_game.getDailyChallenges(req, res));
router.get('/voicelines', (req, res) => supervi_game.getVoiceLines(req, res));

module.exports = router;
