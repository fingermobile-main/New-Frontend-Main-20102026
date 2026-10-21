const express = require('express');
const ai = require('../controllers/aiController.js');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// AI Assistant & Generation routes
router.post('/assist', authenticate, ai.chatAssistant);
router.post('/chat', authenticate, ai.chatAssistant);
router.post('/generate-code', authenticate, ai.chatAssistant);
router.post('/generate/image', authenticate, ai.generateImage);
router.post('/translate', authenticate, ai.translateText);
router.post('/moderate', authenticate, ai.moderateContent);

// AI History & Balances
router.get('/history', authenticate, ai.getUsageLogs);
router.get('/code-history', authenticate, ai.getUsageLogs);
router.get('/stats', authenticate, ai.getCreditBalance);
router.get('/balance', authenticate, ai.getCreditBalance);
router.post('/topup', authenticate, ai.topupCredits);

// AI Subscriptions & Features
router.get('/features', ai.getAvailableFeatures);
router.get('/subscription/current', authenticate, ai.getCurrentSubscription);
router.get('/subscription/plans', ai.getSubscriptionPlans);
router.post('/subscription/purchase', authenticate, ai.purchaseSubscription);

module.exports = router;
