/**
 * Lush Subscription Controller
 * Handles all subscription-related operations for the Lush Pressies app
 */

const db = require('../config/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Assuming Stripe is used for payments

class LushSubscriptionController {
  /**
   * Get available subscription plans
   */
  static async getSubscriptionPlans() {
    try {
      // In a real implementation, this would come from a database or configuration
      const plans = [
        {
          id: 'basic',
          name: 'Radiate Basic',
          description: 'Essential features for connecting',
          price: 0, // Free tier
          features: [
            'Basic profile',
            'Limited swipes (10/day)',
            'Standard matching algorithm',
            'Basic customer support'
          ],
          billingCycle: 'monthly'
        },
        {
          id: 'premium',
          name: 'Radiate Premium',
          description: 'Enhanced experience with more features',
          price: 999, // $9.99/month in cents
          features: [
            'Advanced profile',
            'Unlimited swipes',
            'Priority matching algorithm',
            'Enhanced privacy controls',
            'Ad-free experience',
            'Priority customer support'
          ],
          billingCycle: 'monthly'
        },
        {
          id: 'elite',
          name: 'Radiate Elite',
          description: 'Premium features with exclusive benefits',
          price: 2499, // $24.99/month in cents
          features: [
            'VIP profile badge',
            'Unlimited swipes',
            'Smart matching algorithm',
            'Enhanced privacy controls',
            'Ad-free experience',
            'Exclusive events access',
            '24/7 VIP customer support',
            'Incognito mode',
            'Priority placement in queues'
          ],
          billingCycle: 'monthly'
        },
        {
          id: 'premium_yearly',
          name: 'Radiate Premium Annual',
          description: 'Save money with annual billing',
          price: 9990, // $99.90/year ($8.33/month) in cents
          features: [
            'Advanced profile',
            'Unlimited swipes',
            'Priority matching algorithm',
            'Enhanced privacy controls',
            'Ad-free experience',
            'Priority customer support'
          ],
          billingCycle: 'yearly',
          discountPercentage: 17 // Save 17% vs monthly
        }
      ];

      return {
        success: true,
        plans
      };
    } catch (error) {
      console.error('Error getting subscription plans:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Subscribe user to a plan
   */
  static async subscribeUser(userId, planId, paymentMethodId) {
    try {
      // Validate inputs
      if (!userId || !planId || !paymentMethodId) {
        return { success: false, error: 'User ID, plan ID, and payment method ID are required' };
      }

      // Get the plan details
      const plans = (await this.getSubscriptionPlans()).plans;
      const selectedPlan = plans.find(plan => plan.id === planId);
      if (!selectedPlan) {
        return { success: false, error: 'Invalid plan ID' };
      }

      // Check if user already has an active subscription
      const currentSubscription = await db.getUserSubscription(userId);
      if (currentSubscription && currentSubscription.status === 'active') {
        return { success: false, error: 'User already has an active subscription' };
      }

      // Process payment using Stripe
      let paymentIntent;
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: selectedPlan.price,
          currency: 'usd',
          payment_method: paymentMethodId,
          confirm: true,
          return_url: `${process.env.FRONTEND_URL}/subscription-success`,
        });
      } catch (paymentError) {
        return { success: false, error: `Payment failed: ${paymentError.message}` };
      }

      // Create subscription record
      const subscription = await db.createSubscription({
        userId,
        planId,
        status: 'active',
        startDate: new Date(),
        endDate: this.calculateEndDate(selectedPlan.billingCycle),
        autoRenew: true,
        paymentMethodId,
        paymentIntentId: paymentIntent.id,
        amountPaid: selectedPlan.price,
        nextBillingDate: selectedPlan.billingCycle === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Approximate
      });

      // Update user's subscription status
      await db.updateUserSubscriptionStatus(userId, 'active', planId);

      // Grant subscription benefits
      await this.grantSubscriptionBenefits(userId, planId);

      // Notify user of successful subscription
      this.notifyUserOfSubscription(userId, selectedPlan);

      return {
        success: true,
        subscription,
        plan: selectedPlan
      };
    } catch (error) {
      console.error('Error subscribing user:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Calculate end date based on billing cycle
   */
  static calculateEndDate(billingCycle) {
    const now = new Date();
    switch (billingCycle) {
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1));
      case 'yearly':
        return new Date(now.setFullYear(now.getFullYear() + 1));
      default:
        return new Date(now.setDate(now.getDate() + 30)); // Default to 30 days
    }
  }

  /**
   * Grant benefits to user after subscription
   */
  static async grantSubscriptionBenefits(userId, planId) {
    // Grant benefits based on plan
    switch (planId) {
      case 'premium':
      case 'premium_yearly':
        // Unlimited swipes
        await db.updateUserSwipeLimit(userId, Infinity);
        // Priority matching
        await db.setPriorityMatching(userId, true);
        // Ad-free experience
        await db.setAdFreeExperience(userId, true);
        // Enhanced privacy
        await db.enableEnhancedPrivacy(userId);
        break;
      case 'elite':
        // All premium benefits plus
        await db.updateUserSwipeLimit(userId, Infinity);
        await db.setPriorityMatching(userId, true);
        await db.setAdFreeExperience(userId, true);
        await db.enableEnhancedPrivacy(userId);
        // VIP badge
        await db.addVipBadge(userId);
        // Exclusive events
        await db.grantExclusiveEventAccess(userId);
        // 24/7 support
        await db.enablePrioritySupport(userId);
        // Incognito mode
        await db.enableIncognitoMode(userId);
        // Priority placement
        await db.setPriorityPlacement(userId, true);
        break;
    }
  }

  /**
   * Notify user of successful subscription
   */
  static notifyUserOfSubscription(userId, plan) {
    console.log(`User ${userId} subscribed to ${plan.name}`);
    // In a real implementation, this would send an email or push notification
  }

  /**
   * Get user's subscription details
   */
  static async getUserSubscription(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const subscription = await db.getUserSubscription(userId);
      if (!subscription) {
        return { success: false, error: 'No active subscription found' };
      }

      // Get plan details
      const plans = (await this.getSubscriptionPlans()).plans;
      const planDetails = plans.find(plan => plan.id === subscription.planId);

      return {
        success: true,
        subscription: {
          ...subscription,
          plan: planDetails
        }
      };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Cancel user's subscription
   */
  static async cancelSubscription(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const subscription = await db.getUserSubscription(userId);
      if (!subscription) {
        return { success: false, error: 'No active subscription found' };
      }

      // Update subscription status
      const updatedSubscription = await db.updateSubscriptionStatus(subscription.id, 'cancelled');

      // Update user's subscription status
      await db.updateUserSubscriptionStatus(userId, 'cancelled', null);

      // Revoke subscription benefits (keep them until end of billing cycle)
      // This might be handled separately in a cron job

      // Notify user of cancellation
      this.notifyUserOfCancellation(userId, subscription.planId);

      return {
        success: true,
        subscription: updatedSubscription
      };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Notify user of subscription cancellation
   */
  static notifyUserOfCancellation(userId, planId) {
    console.log(`User ${userId}'s subscription to ${planId} was cancelled`);
    // In a real implementation, this would send an email or push notification
  }

  /**
   * Change user's subscription plan (upgrade/downgrade)
   */
  static async changeSubscriptionPlan(userId, newPlanId) {
    try {
      if (!userId || !newPlanId) {
        return { success: false, error: 'User ID and new plan ID are required' };
      }

      // Get current subscription
      const currentSubscription = await db.getUserSubscription(userId);
      if (!currentSubscription || currentSubscription.status !== 'active') {
        return { success: false, error: 'User has no active subscription' };
      }

      // Get plan details
      const plans = (await this.getSubscriptionPlans()).plans;
      const newPlan = plans.find(plan => plan.id === newPlanId);
      if (!newPlan) {
        return { success: false, error: 'Invalid plan ID' };
      }

      // Process proration if changing between paid plans
      let proratedAmount = 0;
      if (currentSubscription.planId !== 'basic' && newPlan.id !== 'basic') {
        // Calculate prorated amount if needed
        // This is a simplified approach
        proratedAmount = this.calculateProration(currentSubscription, newPlan);
      }

      // If upgrading and there's a price difference, charge the difference
      if (newPlan.price > currentSubscription.amountPaid) {
        // Process additional payment if needed
        // For simplicity, assuming we can bill immediately
      }

      // Update subscription
      const updatedSubscription = await db.updateSubscriptionPlan(
        currentSubscription.id,
        newPlanId,
        newPlan.price,
        this.calculateEndDate(newPlan.billingCycle)
      );

      // Update user's subscription status
      await db.updateUserSubscriptionStatus(userId, 'active', newPlanId);

      // Revoke old benefits and grant new ones
      await this.revokeSubscriptionBenefits(userId, currentSubscription.planId);
      await this.grantSubscriptionBenefits(userId, newPlanId);

      // Notify user of plan change
      this.notifyUserOfPlanChange(userId, currentSubscription.planId, newPlanId);

      return {
        success: true,
        subscription: updatedSubscription,
        oldPlanId: currentSubscription.planId,
        newPlanId
      };
    } catch (error) {
      console.error('Error changing subscription plan:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Calculate proration for plan change
   */
  static calculateProration(currentSubscription, newPlan) {
    // Simplified proration calculation
    // In a real implementation, this would be more complex
    return Math.max(0, newPlan.price - currentSubscription.amountPaid);
  }

  /**
   * Revoke benefits when subscription changes or ends
   */
  static async revokeSubscriptionBenefits(userId, planId) {
    // Revoke benefits based on plan
    switch (planId) {
      case 'premium':
      case 'premium_yearly':
        // Revert to basic swipe limits
        await db.updateUserSwipeLimit(userId, 10); // Default for free users
        // Disable priority matching
        await db.setPriorityMatching(userId, false);
        // Enable ads
        await db.setAdFreeExperience(userId, false);
        // Disable enhanced privacy
        await db.disableEnhancedPrivacy(userId);
        break;
      case 'elite':
        // Revert all elite benefits
        await db.updateUserSwipeLimit(userId, 10);
        await db.setPriorityMatching(userId, false);
        await db.setAdFreeExperience(userId, false);
        await db.disableEnhancedPrivacy(userId);
        await db.removeVipBadge(userId);
        await db.revokeExclusiveEventAccess(userId);
        await db.disablePrioritySupport(userId);
        await db.disableIncognitoMode(userId);
        await db.setPriorityPlacement(userId, false);
        break;
    }
  }

  /**
   * Notify user of plan change
   */
  static notifyUserOfPlanChange(userId, oldPlanId, newPlanId) {
    console.log(`User ${userId} changed from ${oldPlanId} to ${newPlanId}`);
    // In a real implementation, this would send an email or push notification
  }

  /**
   * Process subscription renewal
   */
  static async processSubscriptionRenewal(subscriptionId) {
    try {
      const subscription = await db.getSubscription(subscriptionId);
      if (!subscription) {
        return { success: false, error: 'Subscription not found' };
      }

      if (subscription.status !== 'active' || !subscription.autoRenew) {
        return { success: false, error: 'Subscription is not active or auto-renew is disabled' };
      }

      // Get plan details
      const plans = (await this.getSubscriptionPlans()).plans;
      const plan = plans.find(p => p.id === subscription.planId);
      if (!plan) {
        return { success: false, error: 'Plan not found' };
      }

      // Process payment for renewal
      try {
        // Create a new payment intent for renewal
        const paymentIntent = await stripe.paymentIntents.create({
          amount: plan.price,
          currency: 'usd',
          payment_method: subscription.paymentMethodId,
          confirm: true,
          return_url: `${process.env.FRONTEND_URL}/payment-success`,
        });

        // Update subscription end date
        const updatedSubscription = await db.updateSubscriptionEndDate(
          subscriptionId,
          this.calculateEndDate(plan.billingCycle)
        );

        return {
          success: true,
          subscription: updatedSubscription
        };
      } catch (paymentError) {
        // Payment failed - possibly disable auto-renew or notify user
        await db.updateSubscriptionAutoRenew(subscriptionId, false);
        return { success: false, error: `Payment failed: ${paymentError.message}` };
      }
    } catch (error) {
      console.error('Error processing subscription renewal:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get subscription statistics
   */
  static async getSubscriptionStats() {
    try {
      const stats = await db.getSubscriptionStats();
      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Check if user has specific subscription features
   */
  static async checkUserSubscriptionFeatures(userId, feature) {
    try {
      if (!userId || !feature) {
        return { success: false, error: 'User ID and feature are required' };
      }

      const subscription = await db.getUserSubscription(userId);
      if (!subscription || subscription.status !== 'active') {
        return { hasFeature: false };
      }

      // Define features by plan
      const featuresByPlan = {
        'premium': ['unlimited_swipes', 'priority_matching', 'ad_free'],
        'elite': [
          'unlimited_swipes', 'priority_matching', 'ad_free', 
          'vip_badge', 'exclusive_events', 'priority_support', 
          'incognito_mode', 'priority_placement'
        ]
      };

      // Check if the feature is available for the user's plan
      const planFeatures = featuresByPlan[subscription.planId] || [];
      const hasFeature = planFeatures.includes(feature);

      return {
        success: true,
        hasFeature,
        plan: subscription.planId
      };
    } catch (error) {
      console.error('Error checking subscription features:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}

module.exports = LushSubscriptionController;