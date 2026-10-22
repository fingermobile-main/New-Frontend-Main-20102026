const express = require('express');
const router = express.Router();
const gemsController = require('../controllers/gemsController');
const { authenticate } = require('../middleware/authenticate');

// Specific routes first to prevent parameterized /:id shadowing
// Broadcast Channels (24h TTL)
router.post('/broadcast', authenticate, gemsController.createBroadcastUpdate);
router.get('/broadcast/feed', gemsController.getBroadcastFeed);

// Balances and Transactions
router.get('/balance', authenticate, gemsController.getBalance);
router.get('/balance/:userId', authenticate, gemsController.getBalance);
router.post('/award', authenticate, gemsController.awardGems);
router.post('/deduct', authenticate, gemsController.deductGems);
router.post('/transaction', authenticate, gemsController.processTransaction);
router.get('/transactions', authenticate, gemsController.getTransactionHistory);
router.get('/transactions/:userId', authenticate, gemsController.getTransactionHistory);

// Store items & Marketplace
router.get('/', gemsController.getGemItems);
router.post('/redeem', authenticate, gemsController.redeemGemItem);
router.post('/', authenticate, gemsController.createGemItem);
router.get('/:id', gemsController.getGemItemById);
router.put('/:id', authenticate, gemsController.updateGemItem);
router.delete('/:id', authenticate, gemsController.deleteGemItem);

// Auto-Reply Settings & Logs (PostgreSQL Persistent)
router.get('/auto-reply', gemsController.getAutoReplySettings);
router.post('/auto-reply', gemsController.saveAutoReplySettings);
router.get('/auto-reply/logs', gemsController.getAutoReplyLogs);
router.post('/auto-reply/logs', gemsController.recordAutoReplyLog);

module.exports = router;
