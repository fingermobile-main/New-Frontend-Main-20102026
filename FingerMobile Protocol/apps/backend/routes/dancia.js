const express = require('express');
const router = express.Router();
const controller = require('../controllers/danciaController');
const { authenticate } = require('../middleware/authenticate');
const requireMasterDashboardAccess = require('../middleware/requireMasterDashboardAccess');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const db = require('../db');

// Optional auth helper: attaches user if token is present, does not fail if unauthenticated
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id || decoded.userId;
      const userResult = await (db.identityDb || db).query(
        'SELECT id, username, email, role, is_active FROM users WHERE id = $1 AND is_active = true',
        [userId]
      );
      if (userResult.rows.length > 0) {
        req.user = userResult.rows[0];
        req.member = userResult.rows[0];
      }
    }
  } catch {
    // Continue as guest
  }
  next();
};

// Public Discovery Endpoints
router.get('/channels', controller.getTvChannels);
router.get('/schedule', controller.getSchedule);
router.get('/videos', controller.getVideos);
router.get('/videos/search', controller.searchVideos);
router.get('/plans', controller.getPlans);
router.get('/genres', controller.getGenres);
router.get('/trending', controller.getTrending);

// Member-specific or Personalized Endpoints
router.get('/member/recommended', optionalAuth, controller.getRecommended);
router.get('/member/history', optionalAuth, controller.getHistory);
router.get('/member/watchlist', optionalAuth, controller.getWatchlist);

// Authenticated Member Actions & Admin Video Management
router.post('/videos', requireMasterDashboardAccess, controller.createVideo);
router.delete('/videos/:videoId', requireMasterDashboardAccess, controller.deleteVideo);
router.post('/videos/:videoId/watchlist', authenticate, controller.addToWatchlist);
router.delete('/videos/:videoId/watchlist', authenticate, controller.removeFromWatchlist);
router.post('/plans/:planID/subscribe', authenticate, controller.subscribe);
router.post('/plans/:planID/unsubscribe', authenticate, controller.unsubscribe);

module.exports = router;
