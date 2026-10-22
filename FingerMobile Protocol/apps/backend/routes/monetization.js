const express = require('express');
const router = express.Router();
const controller = require('../controllers/monetizationController');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));
const optionalAuth = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return authenticate(req, res, next);
  }
  return next();
};

router.get('/subscriptions', optionalAuth, controller.getSubscriptions);
router.post('/subscriptions', optionalAuth, controller.createSubscription);
router.delete('/subscriptions', optionalAuth, controller.cancelSubscription);

router.get('/dashboard', optionalAuth, controller.getDashboard);
router.get('/summary', optionalAuth, controller.getDashboard);
router.post('/payout', optionalAuth, controller.requestPayout);

// Platform & Channel Subscription Models (PostgreSQL Persisted)
router.get('/subscription-models', controller.getSubscriptionModels);
router.post('/subscription-models', controller.saveSubscriptionModel);
router.put('/subscription-models/batch', controller.batchSaveSubscriptionModels);
router.put('/subscription-models/:id', controller.saveSubscriptionModel);
router.delete('/subscription-models/:id', controller.deleteSubscriptionModel);

module.exports = router;

