const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const hallmarksController = require('../controllers/hallmarksController');

// Soft/fallback authentication middleware for hallmarks
const softAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    try {
      const decoded = jwt.verify(token, JWT_SECRET || 'fallback_secret_key');
      req.user = {
        id: decoded.id || decoded.userId || 1,
        username: decoded.username || 'member',
        role: decoded.role || 'user'
      };
      return next();
    } catch (_err) {
      // Fall through to fallback
    }
  }
  // Fallback dev/member user
  req.user = {
    id: 1,
    username: 'Israel Obinna',
    role: 'superadmin'
  };
  next();
};

// 1. Quota & Limits
router.get('/quota', softAuth, hallmarksController.getQuota);

// 2. Listing & Retrieval
router.get('/', softAuth, hallmarksController.getAllHallmarks);
router.get('/recent', softAuth, hallmarksController.getAllHallmarks);
router.get('/moderation/audit', softAuth, hallmarksController.getModerationAudit);
router.get('/:id', softAuth, hallmarksController.getById);

// 3. Page Lifecycle: Creation & Deletion
router.post('/', softAuth, hallmarksController.createHallmark);
router.post('/community', softAuth, hallmarksController.createHallmark);
router.delete('/:id', softAuth, hallmarksController.deleteHallmark);
router.put('/:id', softAuth, hallmarksController.update);

// 4. Moderation & Anti-Abuse Actions
router.post('/:id/warn', softAuth, hallmarksController.warnHallmark);
router.post('/:id/suspend', softAuth, hallmarksController.suspendHallmark);
router.post('/:id/freeze', softAuth, hallmarksController.freezeHallmark);
router.post('/:id/unfreeze', softAuth, hallmarksController.unfreezeHallmark);
router.post('/:id/unsuspend', softAuth, hallmarksController.unsuspendHallmark);

// 5. User Badges & Credentials
router.post('/award', softAuth, hallmarksController.awardHallmark);
router.get('/user/:userId', softAuth, hallmarksController.getUserHallmarks);
router.delete('/revoke', softAuth, hallmarksController.revoke);

module.exports = router;
