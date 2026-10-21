const express = require('express');
const router = express.Router();
const controller = require('../controllers/monetizationController');
const { authenticate } = require('../middleware/authenticate');

router.get('/subscriptions', authenticate, controller.getSubscriptions);
router.post('/subscriptions', authenticate, controller.createSubscription);
router.delete('/subscriptions', authenticate, controller.cancelSubscription);

router.get('/dashboard', authenticate, controller.getDashboard);
router.post('/payout', authenticate, controller.requestPayout);

module.exports = router;
