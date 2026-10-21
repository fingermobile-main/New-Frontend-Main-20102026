import express, { Request, Response } from 'express';
import MonetizationController from '../controllers/MonetizationController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Revenue streams routes
router.get('/revenue-streams', MonetizationController.getRevenueStreams);
router.get('/revenue-streams/:id', MonetizationController.getRevenueStreamById);
router.post('/revenue-streams', MonetizationController.createRevenueStream);
router.put('/revenue-streams/:id', MonetizationController.updateRevenueStream);

// Subscription plans routes
router.get('/subscriptions', MonetizationController.getSubscriptionPlans);
router.get('/subscriptions/:id', MonetizationController.getSubscriptionPlanById);
router.post('/subscriptions', MonetizationController.createSubscriptionPlan);
router.put('/subscriptions/:id', MonetizationController.updateSubscriptionPlan);
router.put('/subscriptions/:id/toggle', MonetizationController.toggleSubscriptionPlanStatus);

// Transactions routes
router.get('/transactions', MonetizationController.getTransactions);
router.get('/transactions/:id', MonetizationController.getTransactionById);

// Analytics routes
router.get('/analytics', MonetizationController.getMonetizationAnalytics);

// Billing routes
router.get('/billing', MonetizationController.getBillingInfo);

export default router;