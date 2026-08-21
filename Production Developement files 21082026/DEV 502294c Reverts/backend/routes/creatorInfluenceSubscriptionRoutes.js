/**
 * Routes for FingerMobile Creator & Influence Infrastructure Program Subscription
 */

const express = require('express');
const router = express.Router();
const CreatorInfluenceSubscriptionController = require('../controllers/creatorInfluenceSubscriptionController');

// Get all subscription tiers
router.get('/tiers', CreatorInfluenceSubscriptionController.getAllSubscriptionTiers);

// Get subscription recommendations for a user
router.post('/recommend/:member_id', CreatorInfluenceSubscriptionController.getSubscriptionRecommendations);

// Create a new subscription
router.post('/', CreatorInfluenceSubscriptionController.createSubscription);

// Get member's current subscription
router.get('/member/:member_id', CreatorInfluenceSubscriptionController.getMemberSubscription);

// Get subscription benefits for a specific tier
router.get('/benefits/:level', CreatorInfluenceSubscriptionController.getSubscriptionBenefits);

// Upgrade member's subscription
router.patch('/upgrade/:member_id', CreatorInfluenceSubscriptionController.upgradeSubscription);

// Downgrade member's subscription
router.patch('/downgrade/:member_id', CreatorInfluenceSubscriptionController.downgradeSubscription);

// Cancel member's subscription
router.delete('/cancel/:subscription_id', CreatorInfluenceSubscriptionController.cancelSubscription);

// Check if member has access to specific features
router.get('/access/:member_id/:feature', CreatorInfluenceSubscriptionController.checkFeatureAccess);

// Process subscription payment
router.post('/payment', CreatorInfluenceSubscriptionController.processSubscriptionPayment);

// Get member's subscription usage
router.get('/usage/:member_id', CreatorInfluenceSubscriptionController.getSubscriptionUsage);

// Get member's billing history
router.get('/billing/:member_id', CreatorInfluenceSubscriptionController.getBillingHistory);

// Generate invoice for a subscription
router.get('/invoice/:subscription_id', CreatorInfluenceSubscriptionController.generateInvoice);

module.exports = router;