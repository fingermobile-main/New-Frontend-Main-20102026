const CreatorInfluenceSubscriptionService = require('../services/creatorInfluenceSubscriptionService');
const logger = require('../utils/logger');

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') logger.error(msg, err);
};

class CreatorInfluenceSubscriptionController {
  /**
   * Get subscription recommendations for a user
   */
  async getSubscriptionRecommendations(req, res) {
    try {
      const { member_id } = req.params;
      const { followers, engagement_rate, bandwidth_usage, monetization_earnings } = req.body;

      if (!member_id) {
        return res.status(400).json({
          error: 'Member ID is required'
        });
      }

      const recommendations = await CreatorInfluenceSubscriptionService.recommendTier(
        member_id,
        followers || 0,
        engagement_rate || 0,
        bandwidth_usage || 0,
        monetization_earnings || 0
      );

      res.status(200).json({
        success: true, data: recommendations
      });
    } catch (error) {
      logErr('Error getting subscription recommendations:', error);
      res.status(500).json({
        error: 'Failed to get subscription recommendations',
        details: error.message
      });
    }
  }

  /**
   * Create a new subscription
   */
  async createSubscription(req, res) {
    try {
      const {
        member_id,
        subscription_level,
        subscription_type,
        auto_renew,
        payment_method_id // Fixed: Added missing comma
      } = req.body;

      if (!member_id || !subscription_level) {
        return res.status(400).json({
          error: 'Member ID and subscription level are required'
        });
      }

      const subscription = await CreatorInfluenceSubscriptionService.createSubscription({
        member_id,
        subscription_level,
        subscription_type,
        auto_renew,
        payment_method_id
      });

      res.status(201).json({
        success: true, data: subscription
      });
    } catch (error) {
      logErr('Error creating subscription:', error);
      res.status(500).json({
        error: 'Failed to create subscription', details: error.message
      });
    }
  }

  /**
   * Get member's current subscription
   */
  async getMemberSubscription(req, res) {
    try {
      const { member_id } = req.params;

      if (!member_id) {
        return res.status(400).json({
          error: 'Member ID is required'
        });
      }

      const subscription = await CreatorInfluenceSubscriptionService.getMemberSubscription(member_id);

      if (!subscription) {
        return res.status(404).json({
          success: false, message: 'No active subscription found'
        });
      }

      res.status(200).json({
        success: true, data: subscription
      });
    } catch (error) {
      logErr('Error getting member subscription:', error);
      res.status(500).json({
        error: 'Failed to get member subscription', details: error.message
      });
    }
  }

  /**
   * Get subscription benefits for a specific tier
   */
  async getSubscriptionBenefits(req, res) {
    try {
      const { level } = req.params;

      if (!level) {
        return res.status(400).json({
          error: 'Subscription level is required'
        });
      }

      const benefits = await CreatorInfluenceSubscriptionService.getSubscriptionBenefits(level);

      if (!benefits) {
        return res.status(404).json({
          success: false, message: 'Subscription level not found'
        });
      }

      res.status(200).json({
        success: true, data: benefits
      });
    } catch (error) {
      logErr('Error getting subscription benefits:', error);
      res.status(500).json({
        error: 'Failed to get subscription benefits', details: error.message
      });
    }
  }

  /**
   * Upgrade member's subscription
   */
  async upgradeSubscription(req, res) {
    try {
      const { member_id } = req.params;
      const { new_level } = req.body;

      if (!member_id || !new_level) {
        return res.status(400).json({
          error: 'Member ID and new subscription level are required'
        });
      }

      const upgradedSubscription = await CreatorInfluenceSubscriptionService.upgradeSubscription(
        member_id,
        new_level
      );

      res.status(200).json({
        success: true, message: 'Subscription upgraded successfully', data: upgradedSubscription
      });
    } catch (error) {
      logErr('Error upgrading subscription:', error);
      res.status(500).json({
        error: 'Failed to upgrade subscription', details: error.message
      });
    }
  }

  /**
   * Downgrade member's subscription
   */
  async downgradeSubscription(req, res) {
    try {
      const { member_id } = req.params;
      const { new_level } = req.body;

      if (!member_id || !new_level) {
        return res.status(400).json({
          error: 'Member ID and new subscription level are required'
        });
      }

      const downgradedSubscription = await CreatorInfluenceSubscriptionService.downgradeSubscription(
        member_id,
        new_level
      );

      res.status(200).json({
        success: true, message: 'Subscription downgraded successfully', data: downgradedSubscription
      });
    } catch (error) {
      logErr('Error downgrading subscription:', error);
      res.status(500).json({
        error: 'Failed to downgrade subscription', details: error.message
      });
    }
  }

  /**
   * Cancel member's subscription
   */
  async cancelSubscription(req, res) {
    try {
      const { subscription_id } = req.params;
      const { reason } = req.body;

      if (!subscription_id) {
        return res.status(400).json({
          error: 'Subscription ID is required'
        });
      }

      const result = await CreatorInfluenceSubscriptionService.cancelSubscription(
        subscription_id,
        reason
      );

      res.status(200).json({
        success: true, message: 'Subscription cancelled successfully', data: result
      });
    } catch (error) {
      logErr('Error cancelling subscription:', error);
      res.status(500).json({
        error: 'Failed to cancel subscription', details: error.message
      });
    }
  }

  /**
   * Check if member has access to specific features
   */
  async checkFeatureAccess(req, res) {
    try {
      const { member_id, feature } = req.params;

      if (!member_id || !feature) {
        return res.status(400).json({
          error: 'Member ID and feature are required'
        });
      }

      const hasAccess = await CreatorInfluenceSubscriptionService.hasFeatureAccess(
        member_id,
        feature
      );

      res.status(200).json({
        success: true, has_access: hasAccess
      });
    } catch (error) {
      logErr('Error checking feature access:', error);
      res.status(500).json({
        error: 'Failed to check feature access',
        details: error.message
      });
    }
  }

  /**
   * Get all subscription tiers
   */
  async getAllSubscriptionTiers(req, res) {
    try {
      const tiers = {};

      for (const [_key, tier] of Object.entries(CreatorInfluenceSubscriptionService.SUBSCRIPTION_TIERS)) {
        tiers[tier.level] = {
          name: tier.name,
          level: tier.level,
          minFollowers: tier.minFollowers,
          maxFollowers: tier.maxFollowers,
          monthlyPriceNaira: tier.monthlyPriceNaira,
          durationMonths: tier.durationMonths,
          features: tier.features
        };
      }

      res.status(200).json({
        success: true, data: tiers
      });
    } catch (error) {
      logErr('Error getting subscription tiers:', error);
      res.status(500).json({
        error: 'Failed to get subscription tiers',
        details: error.message
      });
    }
  }

  /**
   * Process subscription payment
   */
  async processSubscriptionPayment(req, res) {
    try {
      const {
        member_id,
        subscription_level,
        amount,
        payment_method,
        currency,          // Fixed: Added missing comma
        billing_details
      } = req.body;

      if (!member_id || !subscription_level || !amount || !payment_method) {
        return res.status(400).json({
          error: 'Member ID, subscription level, amount, and payment method are required'
        });
      }

      const paymentResult = await CreatorInfluenceSubscriptionService.processSubscriptionPayment({
        member_id,
        subscription_level,
        amount,
        payment_method,
        currency,
        billing_details
      });

      res.status(200).json({
        success: true, data: paymentResult
      });
    } catch (error) {
      logErr('Error processing subscription payment:', error);
      res.status(500).json({
        error: 'Failed to process subscription payment', details: error.message
      });
    }
  }

  /**
   * Get member's subscription usage
   */
  async getSubscriptionUsage(req, res) {
    try {
      const { member_id } = req.params;

      if (!member_id) {
        return res.status(400).json({
          error: 'Member ID is required'
        });
      }

      const usage = await CreatorInfluenceSubscriptionService.getSubscriptionUsage(member_id);

      res.status(200).json({
        success: true, data: usage
      });
    } catch (error) {
      logErr('Error getting subscription usage:', error);
      res.status(500).json({
        error: 'Failed to get subscription usage', details: error.message
      });
    }
  }

  /**
   * Get member's billing history
   */
  async getBillingHistory(req, res) {
    try {
      const { member_id } = req.params;

      if (!member_id) {
        return res.status(400).json({
          error: 'Member ID is required'
        });
      }

      const billingHistory = await CreatorInfluenceSubscriptionService.getBillingHistory(member_id);

      res.status(200).json({
        success: true, data: billingHistory
      });
    } catch (error) {
      logErr('Error getting billing history:', error);
      res.status(500).json({
        error: 'Failed to get billing history', details: error.message
      });
    }
  }

  /**
   * Generate invoice for a subscription
   */
  async generateInvoice(req, res) {
    try {
      const { subscription_id } = req.params;

      if (!subscription_id) {
        return res.status(400).json({
          error: 'Subscription ID is required'
        });
      }

      const invoice = await CreatorInfluenceSubscriptionService.generateInvoice(subscription_id);

      res.status(200).json({
        success: true, data: invoice
      });
    } catch (error) {
      logErr('Error generating invoice:', error);
      res.status(500).json({
        error: 'Failed to generate invoice',
        details: error.message
      });
    }
  }

  /**
   * Middleware: Require active creator subscription level
   */
  requireCreatorSubscription(requiredTier = 'tier1') {
    return async (req, res, next) => {
      try {
        const memberId = req.user?.id || req.headers['x-member-id'];
        if (!memberId) {
          return res.status(401).json({ success: false, message: 'Authentication required for gated creator content' });
        }
        const hasAccess = await CreatorInfluenceSubscriptionService.hasFeatureAccess(memberId, requiredTier);
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            error: 'SUBSCRIPTION_TIER_REQUIRED',
            message: `This exclusive content requires an active ${requiredTier.toUpperCase()} creator membership`
          });
        }
        next();
      } catch (err) {
        logErr('Error in requireCreatorSubscription middleware:', err);
        return res.status(500).json({ success: false, message: 'Subscription authorization error' });
      }
    };
  }

  /**
   * Configure membership tier perks
   */
  async configureTierPerks(req, res) {
    try {
      const creatorId = req.user?.id || req.body.creator_id;
      const { tier, tier_name, monthly_price, currency = 'USD', perks = [], badge_icon } = req.body;
      if (!creatorId || !tier || !monthly_price) {
        return res.status(400).json({ success: false, message: 'creatorId, tier, and monthly_price are required' });
      }
      const pool = require('../db').pool;
      const result = await pool.query(
        `INSERT INTO creator_influence_perks (
          creator_id, tier, tier_name, monthly_price, currency, perks, badge_icon, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (creator_id, tier)
        DO UPDATE SET
          tier_name = EXCLUDED.tier_name,
          monthly_price = EXCLUDED.monthly_price,
          currency = EXCLUDED.currency,
          perks = EXCLUDED.perks,
          badge_icon = EXCLUDED.badge_icon,
          updated_at = NOW()
        RETURNING *`,
        [String(creatorId), tier, tier_name || tier, monthly_price, currency, JSON.stringify(perks), badge_icon]
      );
      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      logErr('Error configuring tier perks:', error);
      res.status(500).json({ success: false, message: 'Failed to configure tier perks' });
    }
  }

  /**
   * Get tier perks for a creator
   */
  async getTierPerks(req, res) {
    try {
      const { creatorId } = req.params;
      const pool = require('../db').pool;
      const { rows } = await pool.query(
        'SELECT * FROM creator_influence_perks WHERE creator_id = $1 ORDER BY monthly_price ASC',
        [String(creatorId)]
      );
      res.json({ success: true, data: rows });
    } catch (error) {
      logErr('Error getting tier perks:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve tier perks' });
    }
  }

  /**
   * Get subscriber roster analytics for creator
   */
  async getSubscriberRosterAnalytics(req, res) {
    try {
      const creatorId = req.user?.id || req.params.creatorId;
      const pool = require('../db').pool;
      let rows = [];
      try {
        const queryRes = await pool.query(
          `SELECT
            tier,
            COUNT(*) as subscriber_count,
            COALESCE(SUM(price), 0) as total_earnings
           FROM creator_subscriptions
           WHERE status = 'active' AND (creator_id = $1 OR creator_id::text = $1::text)
           GROUP BY tier`,
          [String(creatorId)]
        );
        rows = queryRes.rows;
      } catch (err) {
        rows = [];
      }
      res.json({
        success: true,
        data: {
          creatorId,
          roster: rows,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logErr('Error getting subscriber roster analytics:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve roster analytics' });
    }
  }
}

module.exports = new CreatorInfluenceSubscriptionController();

