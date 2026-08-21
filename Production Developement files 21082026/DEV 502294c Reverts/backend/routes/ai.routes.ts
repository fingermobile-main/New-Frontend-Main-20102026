import { Router } from 'express';
import AIController from '../controllers/AIController';
import authenticate from '../middleware/auth';

const router = Router();

// All AI routes require authentication
router.use(authenticate);

// Subscription Management
router.get('/subscription/current', AIController.getCurrentSubscription.bind(AIController));
router.get('/subscription/plans', AIController.getSubscriptionPlans.bind(AIController));
router.post('/subscription/purchase', AIController.purchaseSubscription.bind(AIController));

// Credit Management
router.get('/credits/balance', AIController.getCreditBalance.bind(AIController));
router.post('/credits/topup', AIController.topupCredits.bind(AIController));

// AI Features
router.post('/chat', AIController.chatAssistant.bind(AIController));
router.post('/generate/image', AIController.generateImage.bind(AIController));
router.post('/translate', AIController.translateText.bind(AIController));
router.post('/moderate', AIController.moderateContent.bind(AIController));

// Usage & Analytics
router.get('/usage/logs', AIController.getUsageLogs.bind(AIController));
router.get('/features', AIController.getAvailableFeatures.bind(AIController));

export default router;
