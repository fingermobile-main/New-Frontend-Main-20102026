const logger = require('../utils/logger');
// FingerMobile Creator & Influence Infrastructure Program Subscription Service

const db = require('../db');

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') logger.error(msg, err);
  else console.error(msg, err);
};

class CreatorInfluenceSubscriptionService {
  constructor() {
    // Define the new subscription tiers as per the business requirements
    this.SUBSCRIPTION_TIERS = {
      FREE: {
        name: 'Free',
        level: 'free',
        minFollowers: 0,
        maxFollowers: 20000,
        price: 0, // Free tier
        monthlyPriceNaira: 0,
        durationMonths: null, // Unlimited
        features: [
          'Basic posting',
          'Standard messaging',
          'Limited analytics',
          'Standard visibility',
          'Geo Fenced',
          'No Hot-map/Hot-Zone visibility',
          'Limited monetization tools',
          'No AI Features',
          'No/Limited live streams'
        ]
      },
      RISING_CREATOR: {
        name: 'Rising Creator',
        level: 'rising_creator',
        minFollowers: 2000,
        maxFollowers: 20000,
        price: 100, // ₦100/month [friends Family B2B (Starter Pack)]
        monthlyPriceNaira: 100,
        durationMonths: 1,
        features: [
          'Advanced analytics',
          'Creator badge',
          'Better recommendation priority',
          'Monetization access',
          'AI hashtag optimization',
          'Audience insights',
          'Basic posting',
          'Standard messaging'
        ]
      },
      RISING_VISIBILITY: {
        name: 'Rising Creator - Visibility Pack',
        level: 'rising_visibility',
        minFollowers: 2000,
        maxFollowers: 20000,
        price: 200, // ₦200/month (Visibility Pack 5% broader Audience)
        monthlyPriceNaira: 200,
        durationMonths: 1,
        features: [
          'Basic posting',
          'AI Features',
          'Limited analytics',
          'Limited live streams',
          'Standard visibility',
          'Geo Fenced',
          'No Hot-map/Hot-Zone visibility',
          'Limited monetization tools'
        ]
      },
      GROWTH_CREATOR: {
        name: 'Growth Creator',
        level: 'growth_creator',
        minFollowers: 20000,
        maxFollowers: 150000,
        price: 500, // ₦500/month
        monthlyPriceNaira: 500,
        durationMonths: 1,
        features: [
          'Better discoverability',
          'Advanced live-streaming',
          'Affiliate storefront',
          'Community subscriptions',
          'Creator AI assistant',
          'Brand partnership marketplace access',
          'Enhanced analytics'
        ]
      },
      PROFESSIONAL_CREATOR: {
        name: 'Professional Creator',
        level: 'professional_creator',
        minFollowers: 150000,
        maxFollowers: 500000,
        price: 2000, // ₦2,000/month
        monthlyPriceNaira: 2000,
        durationMonths: 1,
        features: [
          'Priority recommendation engine',
          'Revenue analytics',
          'Ad revenue sharing',
          'Verified profile',
          'AI video enhancement tools',
          'Team account management',
          'Dedicated support'
        ]
      },
      ENTERPRISE_CREATOR: {
        name: 'Enterprise Creator',
        level: 'enterprise_creator',
        minFollowers: 500000,
        maxFollowers: 2000000,
        price: 10000, // ₦10,000/month
        monthlyPriceNaira: 10000,
        durationMonths: 1,
        features: [
          'Dedicated creator support',
          'API access',
          'Advanced commerce tools',
          'Premium visibility boosting',
          'Event monetization',
          'Large-scale livestream infrastructure',
          'Priority processing'
        ]
      },
      MEGA_INFLUENCER: {
        name: 'Mega Influencer / Media Network',
        level: 'mega_influencer',
        minFollowers: 2000000,
        maxFollowers: 10000000,
        price: 50000, // ₦50,000/month
        monthlyPriceNaira: 50000,
        durationMonths: 1,
        features: [
          'Enterprise cloud streaming',
          'Dedicated account managers',
          'AI audience prediction',
          'Premium recommendation priority',
          'Advanced monetization systems',
          'Cross-platform distribution tools',
          'Priority API access'
        ]
      }
    };

    // Define feature permissions for authorization
    this.FEATURE_PERMISSIONS = {
      advanced_analytics: ['rising_creator', 'rising_visibility', 'growth_creator', 'professional_creator', 'enterprise_creator', 'mega_influencer'],
      creator_badge: ['rising_creator', 'rising_visibility', 'growth_creator', 'professional_creator', 'enterprise_creator', 'mega_influencer'],
      monetization_tools: ['rising_creator', 'rising_visibility', 'growth_creator', 'professional_creator', 'enterprise_creator', 'mega_influencer'],
      ai_features: ['rising_visibility', 'growth_creator', 'professional_creator', 'enterprise_creator', 'mega_influencer'],
      live_streaming: ['growth_creator', 'professional_creator', 'enterprise_creator', 'mega_influencer'],
      priority_recommendation: ['professional_creator', 'enterprise_creator', 'mega_influencer'],
      verified_profile: ['professional_creator', 'enterprise_creator', 'mega_influencer'],
      api_access: ['enterprise_creator', 'mega_influencer'],
      dedicated_support: ['professional_creator', 'enterprise_creator', 'mega_influencer']
    };

    // Engagement score threshold for automatic tier recommendations
    this.ENGAGEMENT_THRESHOLDS = {
      rising_creator: { minScore: 0.5, maxScore: 2.0 },
      growth_creator: { minScore: 2.0, maxScore: 5.0 },
      professional_creator: { minScore: 5.0, maxScore: 10.0 },
      enterprise_creator: { minScore: 10.0, maxScore: 20.0 },
      mega_influencer: { minScore: 20.0 }
    };
  }

  /**
   * Create a new Creator & Influence Infrastructure Program subscription
   * @param {Object} subscriptionData - Subscription data
   * @returns {Object} Created subscription
   */
  async createSubscription(subscriptionData) {
    const {
      member_id,
      subscription_type,
      subscription_level,
      start_date = new Date(),
      duration_months = null,
      payment_method_id,
      auto_renew = true,
      features_override = null,
      engagement_score = null,
      bandwidth_usage = null,
      monetization_earnings = null
    } = subscriptionData;

    // Validate subscription level
    const validLevels = Object.keys(this.SUBSCRIPTION_TIERS).map(key => this.SUBSCRIPTION_TIERS[key].level);
    if (!validLevels.includes(subscription_level)) {
      throw new Error(
        `Invalid subscription level. Must be one of: ${validLevels.join(', ')}`,
      );
    }

    // Determine end date
    let end_date = null;
    const tierDuration = this.SUBSCRIPTION_TIERS[Object.keys(this.SUBSCRIPTION_TIERS).find(
      key => this.SUBSCRIPTION_TIERS[key].level === subscription_level
    )]?.durationMonths;
    const actualDuration = duration_months || tierDuration;

    if (actualDuration) {
      end_date = new Date(start_date);
      end_date.setMonth(end_date.getMonth() + actualDuration);
    }

    // Get features based on level
    const features =
      features_override ||
      this.SUBSCRIPTION_TIERS[Object.keys(this.SUBSCRIPTION_TIERS).find(
        key => this.SUBSCRIPTION_TIERS[key].level === subscription_level
      )]?.features ||
      [];

    try {
      const result = await db.query(
        `INSERT INTO fm_creator_influence_subscriptions (
                    member_id, subscription_type, subscription_level, 
                    is_active, start_date, end_date, features_access, 
                    auto_renew, payment_method_id, engagement_score, 
                    bandwidth_usage, monetization_earnings
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *`,
        [
          member_id,
          subscription_type || 'Creator_Influence_Prog',
          subscription_level,
          true, // is_active
          start_date,
          end_date,
          JSON.stringify(features),
          auto_renew,
          payment_method_id || null,
          engagement_score || 0,
          bandwidth_usage || 0,
          monetization_earnings || 0
        ],
      );

      // Log the subscription creation
      await this.logSubscriptionEvent(
        result.rows[0].id,
        'subscription_created',
        {
          member_id,
          subscription_level,
          start_date,
          end_date,
          price_naira: this.SUBSCRIPTION_TIERS[Object.keys(this.SUBSCRIPTION_TIERS).find(
            key => this.SUBSCRIPTION_TIERS[key].level === subscription_level
          )]?.monthlyPriceNaira
        }
      );

      return result.rows[0];
    } catch (error) {
      logErr('Error creating creator influence subscription:', error.message);
      throw error;
    }
  }

  /**
   * Get member's current subscription status
   * @param {string} member_id - member ID
   * @returns {Object} Current subscription or null
   */
  async getMemberSubscription(member_id) {
    try {
      const result = await db.query(
        `SELECT * FROM fm_creator_influence_subscriptions 
                WHERE member_id = $1 
                AND is_active = true 
                AND (end_date IS NULL OR end_date > NOW())
                ORDER BY created_at DESC 
                LIMIT 1`,
        [member_id],
      );

      return result.rows[0] || null;
    } catch (error) {
      logErr('Error getting member subscription:', error.message);
      throw error;
    }
  }

  /**
   * Check if member has a specific feature access
   * @param {string} member_id - member ID
   * @param {string} feature - Feature to check
   * @returns {boolean} Whether member has access to the feature
   */
  async hasFeatureAccess(member_id, feature) {
    const subscription = await this.getMemberSubscription(member_id);

    if (!subscription) {
      return false;
    }

    // Check if feature is allowed for the subscription level
    const allowedLevels = this.FEATURE_PERMISSIONS[feature];
    if (!allowedLevels) {
      return false; // Feature doesn't exist in permissions
    }

    return allowedLevels.includes(subscription.subscription_level);
  }

  /**
   * Process subscription renewal
   * @param {string} subscription_id - Subscription ID
   * @returns {Object} Updated subscription
   */
  async processRenewal(subscription_id) {
    try {
      const subscription = await db.query(
        'SELECT * FROM fm_creator_influence_subscriptions WHERE id = $1',
        [subscription_id],
      );

      if (subscription.rows.length === 0) {
        throw new Error('Subscription not found');
      }

      const currentSub = subscription.rows[0];

      if (!currentSub.auto_renew) {
        // Update status to expired
        await db.query(
          'UPDATE fm_creator_influence_subscriptions SET is_active = false WHERE id = $1',
          [subscription_id],
        );

        await this.logSubscriptionEvent(
          subscription_id,
          'subscription_expired',
          {
            reason: 'auto_renew_disabled'
          }
        );

        return null;
      }

      // Calculate new end date
      const newStartDate = currentSub.end_date || new Date();
      const tier = this.SUBSCRIPTION_TIERS[Object.keys(this.SUBSCRIPTION_TIERS).find(
        key => this.SUBSCRIPTION_TIERS[key].level === currentSub.subscription_level
      )];

      const newEndDate = new Date(newStartDate);
      newEndDate.setMonth(
        newEndDate.getMonth() +
          (currentSub.duration_months || tier?.durationMonths || 1),
      );

      const result = await db.query(
        `UPDATE fm_creator_influence_subscriptions 
                SET start_date = $1, end_date = $2, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $3 
                RETURNING *`,
        [newStartDate, newEndDate, subscription_id],
      );

      await this.logSubscriptionEvent(subscription_id, 'subscription_renewed', {
        new_start_date: newStartDate,
        new_end_date: newEndDate
      });

      return result.rows[0];
    } catch (error) {
      logErr('Error processing renewal:', error.message);
      throw error;
    }
  }

  /**
   * Upgrade member's subscription
   * @param {string} member_id - member ID
   * @param {string} new_level - New subscription level
   * @returns {Object} Updated subscription
   */
  async upgradeSubscription(member_id, new_level) {
    try {
      const currentSubscription = await this.getMemberSubscription(member_id);

      if (!currentSubscription) {
        throw new Error('No active subscription found for member');
      }

      // Validate new level
      const validLevels = Object.keys(this.SUBSCRIPTION_TIERS).map(key => this.SUBSCRIPTION_TIERS[key].level);
      if (!validLevels.includes(new_level)) {
        throw new Error(
          `Invalid subscription level. Must be one of: ${validLevels.join(', ')}`,
        );
      }

      // Check if upgrading (new level should be higher than current)
      const levelOrder = {
        free: 0,
        rising_creator: 1,
        rising_visibility: 1,
        growth_creator: 2,
        professional_creator: 3,
        enterprise_creator: 4,
        mega_influencer: 5
      };

      if (
        levelOrder[new_level] <=
        levelOrder[currentSubscription.subscription_level]
      ) {
        throw new Error(
          'New level must be higher than current level for upgrade',
        );
      }

      // Cancel current subscription
      await db.query(
        'UPDATE fm_creator_influence_subscriptions SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [currentSubscription.id],
      );

      // Create new subscription
      const tier = this.SUBSCRIPTION_TIERS[Object.keys(this.SUBSCRIPTION_TIERS).find(
        key => this.SUBSCRIPTION_TIERS[key].level === new_level
      )];
      const features = tier?.features || [];
      const duration_months = tier?.durationMonths || 1;

      const newEndDate = new Date();
      newEndDate.setMonth(newEndDate.getMonth() + duration_months);

      const result = await db.query(
        `INSERT INTO fm_creator_influence_subscriptions (
                    member_id, subscription_type, subscription_level, 
                    is_active, start_date, end_date, features_access, auto_renew
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`,
        [
          member_id,
          currentSubscription.subscription_type,
          new_level,
          true,
          new Date(),
          newEndDate,
          JSON.stringify(features),
          currentSubscription.auto_renew
        ],
      );

      await this.logSubscriptionEvent(
        result.rows[0].id,
        'subscription_upgraded',
        {
          previous_level: currentSubscription.subscription_level,
          new_level: new_level,
          price_difference: tier.monthlyPriceNaira -
            (this.SUBSCRIPTION_TIERS[Object.keys(this.SUBSCRIPTION_TIERS).find(
              key => this.SUBSCRIPTION_TIERS[key].level === currentSubscription.subscription_level
            )]?.monthlyPriceNaira || 0)
        }
      );

      return result.rows[0];
    } catch (error) {
      logErr('Error upgrading subscription:', error.message);
      throw error;
    }
  }

  /**
   * Downgrade member's subscription
   * @param {string} member_id - member ID
   * @param {string} new_level - New subscription level
   * @returns {Object} Updated subscription
   */
  async downgradeSubscription(member_id, new_level) {
    try {
      const currentSubscription = await this.getMemberSubscription(member_id);

      if (!currentSubscription) {
        throw new Error('No active subscription found for member');
      }

      // Validate new level
      const validLevels = Object.keys(this.SUBSCRIPTION_TIERS).map(key => this.SUBSCRIPTION_TIERS[key].level);
      if (!validLevels.includes(new_level)) {
        throw new Error(
          `Invalid subscription level. Must be one of: ${validLevels.join(', ')}`,
        );
      }

      // Check if downgrading (new level should be lower than current)
      const levelOrder = {
        free: 0,
        rising_creator: 1,
        rising_visibility: 1,
        growth_creator: 2,
        professional_creator: 3,
        enterprise_creator: 4,
        mega_influencer: 5
      };

      if (
        levelOrder[new_level] >=
        levelOrder[currentSubscription.subscription_level]
      ) {
        throw new Error(
          'New level must be lower than current level for downgrade',
        );
      }

      // Cancel current subscription
      await db.query(
        'UPDATE fm_creator_influence_subscriptions SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [currentSubscription.id],
      );

      // Create new subscription
      const tier = this.SUBSCRIPTION_TIERS[Object.keys(this.SUBSCRIPTION_TIERS).find(
        key => this.SUBSCRIPTION_TIERS[key].level === new_level
      )];
      const features = tier?.features || [];
      const duration_months = tier?.durationMonths || 1;

      const newEndDate = new Date();
      newEndDate.setMonth(newEndDate.getMonth() + duration_months);

      const result = await db.query(
        `INSERT INTO fm_creator_influence_subscriptions (
                    member_id, subscription_type, subscription_level, 
                    is_active, start_date, end_date, features_access, auto_renew
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`,
        [
          member_id,
          currentSubscription.subscription_type,
          new_level,
          true,
          new Date(),
          newEndDate,
          JSON.stringify(features),
          currentSubscription.auto_renew
        ],
      );

      await this.logSubscriptionEvent(
        result.rows[0].id,
        'subscription_downgraded',
        {
          previous_level: currentSubscription.subscription_level,
          new_level: new_level,
          price_difference:
            (this.SUBSCRIPTION_TIERS[Object.keys(this.SUBSCRIPTION_TIERS).find(
              key => this.SUBSCRIPTION_TIERS[key].level === currentSubscription.subscription_level
            )]?.monthlyPriceNaira || 0) - tier.monthlyPriceNaira
        }
      );

      return result.rows[0];
    } catch (error) {
      logErr('Error downgrading subscription:', error.message);
      throw error;
    }
  }

  /**
   * Cancel subscription
   * @param {string} subscription_id - Subscription ID
   * @param {string} reason - Reason for cancellation
   * @returns {Object} Result of cancellation
   */
  async cancelSubscription(subscription_id, reason = 'member_request') {
    try {
      const result = await db.query(
        `UPDATE fm_creator_influence_subscriptions 
                SET is_active = false, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $1 
                RETURNING *`,
        [subscription_id],
      );

      if (result.rows.length === 0) {
        throw new Error('Subscription not found');
      }

      await this.logSubscriptionEvent(
        subscription_id,
        'subscription_cancelled',
        {
          reason: reason,
          cancellation_date: new Date()
        }
      );

      return { success: true, subscription: result.rows[0] };
    } catch (error) {
      logErr('Error cancelling subscription:', error.message);
      throw error;
    }
  }

  /**
   * Check if member can access Creator & Influence Infrastructure features
   * @param {string} member_id - member ID
   * @returns {Object} Access check result
   */
  async checkAccess(member_id) {
    const subscription = await this.getMemberSubscription(member_id);

    return {
      has_access: !!subscription,
      subscription_level: subscription?.subscription_level || 'none',
      features: subscription?.features_access || [],
      expires_at: subscription?.end_date || null,
      can_access_monetization: await this.hasFeatureAccess(
        member_id,
        'monetization_tools',
      ),
      can_access_ai_features: await this.hasFeatureAccess(
        member_id,
        'ai_features',
      ),
      can_access_priority_recommendation: await this.hasFeatureAccess(
        member_id,
        'priority_recommendation',
      )
    };
  }

  /**
   * Recommend a subscription tier based on user metrics
   * @param {string} member_id - member ID
   * @param {number} followers - Number of followers
   * @param {number} engagement_rate - Engagement rate percentage
   * @param {number} bandwidth_usage - Bandwidth usage metrics
   * @param {number} monetization_earnings - Monetization earnings
   * @returns {Object} Recommended tier and justification
   */
  async recommendTier(member_id, followers, engagement_rate, bandwidth_usage = 0, monetization_earnings = 0) {
    // Calculate engagement score
    const engagementScore = (engagement_rate * followers) / 1000;

    // Find the best matching tier based on followers and engagement
    let recommendedTier = this.SUBSCRIPTION_TIERS.FREE.level;

    // Start with free tier and work up based on criteria
    if (followers >= 2000 && followers <= 20000) {
      // For 2k-20k followers, offer both Rising Creator options
      if (engagementScore >= this.ENGAGEMENT_THRESHOLDS.rising_creator.minScore) {
        // Default to Rising Creator (₦100), but consider Visibility Pack if they're focusing on visibility
        recommendedTier = this.SUBSCRIPTION_TIERS.RISING_CREATOR.level;
      }
    }
    else if (followers >= 20000 && followers <= 150000) {
      if (engagementScore >= this.ENGAGEMENT_THRESHOLDS.growth_creator.minScore) {
        recommendedTier = this.SUBSCRIPTION_TIERS.GROWTH_CREATOR.level;
      }
    }
    else if (followers >= 150000 && followers <= 500000) {
      if (engagementScore >= this.ENGAGEMENT_THRESHOLDS.professional_creator.minScore) {
        recommendedTier = this.SUBSCRIPTION_TIERS.PROFESSIONAL_CREATOR.level;
      }
    }
    else if (followers >= 500000 && followers <= 2000000) {
      if (engagementScore >= this.ENGAGEMENT_THRESHOLDS.enterprise_creator.minScore) {
        recommendedTier = this.SUBSCRIPTION_TIERS.ENTERPRISE_CREATOR.level;
      }
    }
    else if (followers >= 2000000) {
      if (engagementScore >= this.ENGAGEMENT_THRESHOLDS.mega_influencer.minScore) {
        recommendedTier = this.SUBSCRIPTION_TIERS.MEGA_INFLUENCER.level;
      }
    }

    // Get current subscription to determine if it's an upgrade/downgrade
    const currentSubscription = await this.getMemberSubscription(member_id);
    const isUpgrade = currentSubscription ?
      this.getTierOrder(recommendedTier) > this.getTierOrder(currentSubscription.subscription_level) :
      true;

    const tierInfo = this.SUBSCRIPTION_TIERS[Object.keys(this.SUBSCRIPTION_TIERS).find(
      key => this.SUBSCRIPTION_TIERS[key].level === recommendedTier
    )];

    return {
      recommended_tier: recommendedTier,
      tier_name: tierInfo.name,
      monthly_price_naira: tierInfo.monthlyPriceNaira,
      features: tierInfo.features,
      justification: {
        followers_count: followers,
        engagement_rate: engagement_rate,
        engagement_score: engagementScore,
        bandwidth_usage: bandwidth_usage,
        monetization_earnings: monetization_earnings,
        recommended_reason: this.getRecommendationReason(recommendedTier, followers, engagementScore)
      },
      is_upgrade: isUpgrade,
      current_subscription: currentSubscription
    };
  }

  /**
   * Helper function to get tier order for comparison
   */
  getTierOrder(tierLevel) {
    const orderMap = {
      free: 0,
      rising_creator: 1,
      rising_visibility: 1,
      growth_creator: 2,
      professional_creator: 3,
      enterprise_creator: 4,
      mega_influencer: 5
    };
    return orderMap[tierLevel] || 0;
  }

  /**
   * Helper function to explain why a tier is recommended
   */
  getRecommendationReason(tierLevel, followers, engagementScore) {
    switch(tierLevel) {
    case 'free':
      return 'Based on current follower count and engagement metrics, the free tier is appropriate';
    case 'rising_creator':
    case 'rising_visibility':
      return `With ${followers.toLocaleString()} followers and engagement score of ${engagementScore.toFixed(2)} this tier offers the right balance of features and affordability`;
    case 'growth_creator':
      return `With ${followers.toLocaleString()} followers and engagement score of ${engagementScore.toFixed(2)} you qualify for growth features`;
    case 'professional_creator':
      return `With ${followers.toLocaleString()} followers and engagement score of ${engagementScore.toFixed(2)} you qualify for professional features`;
    case 'enterprise_creator':
      return `With ${followers.toLocaleString()} followers and engagement score of ${engagementScore.toFixed(2)} you qualify for enterprise features`;
    case 'mega_influencer':
      return `With ${followers.toLocaleString()} followers and engagement score of ${engagementScore.toFixed(2)} you qualify for influencer network features`;
    default:
      return 'Recommended based on your current metrics';
    }
  }

  /**
   * Process subscription payment
   * @param {Object} paymentData - Payment data
   * @returns {Object} Payment processing result
   */
  async processSubscriptionPayment(paymentData) {
    const {
      member_id,
      subscription_level,
      amount,
      payment_method,
      currency = 'NGN'
    } = paymentData;

    try {
      // In a real implementation, you would integrate with a payment processor
      // like Flutterwave, Paystack, etc. Here we'll simulate the payment processing

      const paymentStatus = {
        success: true,
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        currency: currency,
        payment_method: payment_method,
        processed_at: new Date(),
        billing_details: paymentData.billing_details || {}
      };

      // If payment is successful, create/update the subscription
      if (paymentStatus.success) {
        // Check if member already has an active subscription
        const existingSub = await this.getMemberSubscription(member_id);

        if (existingSub) {
          // Update the existing subscription
          await db.query(
            `UPDATE fm_creator_influence_subscriptions 
                        SET subscription_level = $1, updated_at = CURRENT_TIMESTAMP 
                        WHERE id = $2`,
            [subscription_level, existingSub.id],
          );
        } else {
          // Create new subscription
          await this.createSubscription({
            member_id,
            subscription_level,
            subscription_type: 'Creator_Influence_Prog',
            payment_method_id: paymentStatus.transaction_id
          });
        }

        await this.logSubscriptionEvent(null, 'payment_processed', {
          member_id,
          subscription_level,
          amount,
          transaction_id: paymentStatus.transaction_id,
          payment_method
        });
      }

      return paymentStatus;
    } catch (error) {
      logErr('Error processing subscription payment:', error.message);
      return {
        success: false,
        error: error.message,
        processed_at: new Date()
      };
    }
  }

  /**
   * Get subscription usage statistics
   * @param {string} member_id - member ID
   * @returns {Object} Usage statistics
   */
  async getSubscriptionUsage(member_id) {
    const subscription = await this.getMemberSubscription(member_id);

    if (!subscription) {
      return {
        subscription_level: 'none',
        features_used: 0,
        features_available: 0,
        usage_percentage: 0
      };
    }

    // In a real implementation, you would track actual feature usage
    // For now, we'll return a basic usage report
    return {
      subscription_level: subscription.subscription_level,
      features_available: Array.isArray(subscription.features_access) ?
        subscription.features_access.length :
        (subscription.features_access ? Object.keys(subscription.features_access).length : 0),
      features_used: 0, // This would be calculated based on actual usage
      usage_percentage: 0,
      days_remaining: subscription.end_date
        ? Math.ceil(
          (new Date(subscription.end_date) - new Date()) /
              (1000 * 60 * 60 * 24),
        )
        : null
    };
  }

  /**
   * Get billing history for a member
   * @param {string} member_id - member ID
   * @returns {Array} Billing history
   */
  async getBillingHistory(member_id) {
    try {
      // In a real implementation, you would have a separate billing/payments table
      // For now, we'll return subscription change events
      const billingHistory = await db.query(
        `SELECT 
                    id,
                    created_at,
                    subscription_level,
                    subscription_type,
                    start_date,
                    end_date,
                    features_access
                FROM fm_creator_influence_subscriptions 
                WHERE member_id = $1 
                ORDER BY created_at DESC`,
        [member_id],
      );

      return billingHistory.rows.map((sub) => ({
        id: sub.id,
        date: sub.created_at,
        type: 'subscription',
        description: `Creator & Influence ${sub.subscription_type} subscription (${sub.subscription_level})`,
        level: sub.subscription_level,
        features: sub.features_access,
        period: {
          start: sub.start_date,
          end: sub.end_date
        }
      }));
    } catch (error) {
      logErr('Error getting billing history:', error.message);
      throw error;
    }
  }

  /**
   * Log subscription event for audit trail
   * @param {string} subscriptionId - Subscription ID
   * @param {string} eventType - Event type
   * @param {Object} details - Event details
   */
  async logSubscriptionEvent(subscriptionId, eventType, details) {
    try {
      await db.query(
        `INSERT INTO fm_sentinel_logs (
                    log_type, severity, entity_id, entity_type, 
                    action_taken, details
                ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          'creator_influence_subscription_event',
          'info',
          subscriptionId,
          'creator_influence_subscription',
          eventType,
          {
            ...details,
            timestamp: new Date().toISOString()
          }
        ],
      );
    } catch (error) {
      logErr('Error logging subscription event:', error.message);
    }
  }

  /**
   * Get subscription benefits for a specific level
   * @param {string} level - Subscription level
   * @returns {Object} Benefits information
   */
  getSubscriptionBenefits(level) {
    const tierKey = Object.keys(this.SUBSCRIPTION_TIERS).find(
      key => this.SUBSCRIPTION_TIERS[key].level === level
    );

    const tier = this.SUBSCRIPTION_TIERS[tierKey];

    if (!tier) {
      return null;
    }

    return {
      level: tier.level,
      name: tier.name,
      monthlyPriceNaira: tier.monthlyPriceNaira,
      duration: tier.durationMonths
        ? `${tier.durationMonths} month(s)`
        : 'Perpetual',
      features: tier.features,
      minFollowers: tier.minFollowers,
      maxFollowers: tier.maxFollowers,
      feature_permissions: this.getFeaturesForLevel(level)
    };
  }

  /**
   * Get all features available for a subscription level
   * @param {string} level - Subscription level
   * @returns {Array} Available features
   */
  getFeaturesForLevel(level) {
    const features = [];

    for (const [feature, allowedLevels] of Object.entries(
      this.FEATURE_PERMISSIONS,
    )) {
      if (allowedLevels.includes(level)) {
        features.push(feature);
      }
    }

    return features;
  }

  /**
   * Generate subscription invoice
   * @param {string} subscription_id - Subscription ID
   * @returns {Object} Invoice data
   */
  async generateInvoice(subscription_id) {
    const subscription = await db.query(
      'SELECT * FROM fm_creator_influence_subscriptions WHERE id = $1',
      [subscription_id],
    );

    if (subscription.rows.length === 0) {
      throw new Error('Subscription not found');
    }

    const sub = subscription.rows[0];
    const tierKey = Object.keys(this.SUBSCRIPTION_TIERS).find(
      key => this.SUBSCRIPTION_TIERS[key].level === sub.subscription_level
    );
    const tier = this.SUBSCRIPTION_TIERS[tierKey];

    const invoice = {
      invoice_id: `CII-${Date.now()}-${sub.id.substr(0, 8)}`,
      member_id: sub.member_id,
      subscription_id: sub.id,
      subscription_level: sub.subscription_level,
      description: `FingerMobile Creator & Influence Infrastructure - ${tier?.name || sub.subscription_type} Subscription`,
      amount: tier?.monthlyPriceNaira || 0,
      currency: 'NGN',
      issue_date: new Date(),
      due_date: sub.end_date || null,
      period: {
        start: sub.start_date,
        end: sub.end_date
      },
      features_included: tier?.features || (Array.isArray(sub.features_access) ? sub.features_access : []),
      status: sub.is_active ? 'paid' : 'pending'
    };

    return invoice;
  }
}

module.exports = new CreatorInfluenceSubscriptionService();
