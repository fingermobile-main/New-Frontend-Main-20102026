const express = require('express');
const supervi_leaderboards = require('../controllers/supervi_leaderboardsController.js');
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
      // Allow guest execution without failing
    }
  }
  next();
};

router.get('/health', (req, res) => supervi_leaderboards.getLeaderboards(req, res));
router.get('/', (req, res) => supervi_leaderboards.getLeaderboards(req, res));
router.get('/:id/rankings', (req, res) => supervi_leaderboards.getRankings(req, res));
router.get('/:id/entries', (req, res) => supervi_leaderboards.getRankings(req, res));
router.post('/:id/submit-score', optionalAuth, (req, res) => supervi_leaderboards.submitScore(req, res));
router.get('/user/:userId/rank', (req, res) => supervi_leaderboards.getUserRank(req, res));
router.get('/members/:memberId/best-scores', (req, res) => supervi_leaderboards.getUserRank(req, res));
router.get('/:id', (req, res) => supervi_leaderboards.getById(req, res));
router.post('/', (req, res) => supervi_leaderboards.create(req, res));
router.put('/:id', (req, res) => supervi_leaderboards.update(req, res));
router.delete('/:id', (req, res) => supervi_leaderboards.delete(req, res));

module.exports = router;
