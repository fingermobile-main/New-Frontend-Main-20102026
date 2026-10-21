const express = require('express');
const router = express.Router();
const controller = require('../controllers/monetizationController');
const { authenticate } = require('../middleware/authenticate');

router.get('/subscriptions', authenticate, controller.getSubscriptions);
router.post('/subscriptions', authenticate, controller.createSubscription);
router.delete('/subscriptions', authenticate, controller.cancelSubscription);

router.get('/dashboard', authenticate, controller.getDashboard);
router.post('/payout', authenticate, controller.requestPayout);

// Platform & Channel Subscription Models (PostgreSQL Persisted)
router.get('/subscription-models', controller.getSubscriptionModels);
router.post('/subscription-models', controller.saveSubscriptionModel);
router.put('/subscription-models/batch', controller.batchSaveSubscriptionModels);
router.put('/subscription-models/:id', controller.saveSubscriptionModel);
router.delete('/subscription-models/:id', controller.deleteSubscriptionModel);

module.exports = router;

