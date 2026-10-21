const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const gemsController = require('../controllers/gemsController');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  authenticate(req, res, next);
};

// Get gems & balance
router.get('/', optionalAuth, gemsController.getAll);
router.get('/balance', optionalAuth, gemsController.getUserBalance);
router.get('/transactions', authenticate, gemsController.getTransactionHistory);
router.get('/user/:userId', authenticate, gemsController.getUserGems);
router.get('/:id', optionalAuth, gemsController.getById);

// Marketplace & Redeem
router.post('/redeem', authenticate, gemsController.redeemGemItem);

// Broadcast channel updates (50,000 follower requirement check, 24h TTL)
router.post('/broadcast', optionalAuth, gemsController.createBroadcastUpdate);
router.get('/broadcast/feed', optionalAuth, gemsController.getBroadcastFeed);

// Manage gems (admin only)
router.post('/', authenticate, gemsController.create);
router.put('/:id', authenticate, gemsController.update);
router.delete('/:id', authenticate, gemsController.delete);

// Award, Transfer & Purchase gems
router.post('/purchase', optionalAuth, gemsController.purchaseGems);
router.post('/award', authenticate, gemsController.awardGems);
router.post('/transfer', authenticate, gemsController.transferGems);

module.exports = router;
