// FIC Subscription System Service for FingerMobile P2P Matching System

const db = require("../db");

class FICSubscriptionService {
  constructor() {
    this.SUBSCRIPTION_TIERS = {
      BASIC: {
        name: "Basic",
        level: "basic",
        features: [
          "Basic profile matching",
          "Standard analytics",
          "Limited fraud protection"
        ],
        price: 0, // Free tier
        duration_months: null, // Unlimited
      },
      PREMIUM: {
        name: "Premium",
        level: "premium",
        features: [
          "Advanced profile matching",
          "Priority analytics reports",
          "Enhanced fraud protection",
          "Full profile analysis (FIC subscription enabled)",
          "Priority customer support",
          "Advanced matching algorithms"
        ],
        price: 29.99,
        duration_months: 1
      },
      ENTERPRISE: {
        name: "Enterprise",
        level: "enterprise",
        features: [
          "All Premium features",
          "Unlimited profile analysis",
          "Custom matching algorithms",
          "Dedicated account manager",
          "White-label analytics",
          "API access to fraud detection",
          "Custom reporting"
        ],
        price: 299.99,
        duration_months: 1
      }
    };

    this.FEATURE_PERMISSIONS = {
      full_profile_analysis: ["premium", "enterprise"],
      advanced_matching: ["premium", "enterprise"],
      custom_algorithms: ["enterprise"],
      priority_support: ["premium", "enterprise"],
      white_label_reports: ["enterprise"],
      api_access: ["enterprise"]
    };
  }

  /**
   * Create a new FIC subscription for a member
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
      features_override = null
    } = subscriptionData;

    // Validate subscription level
    const validLevels = ["basic", "premium", "enterprise"];
    if (!validLevels.includes(subscription_level)) {
      throw new Error(
        `Invalid subscription level. Must be one of: ${validLevels.join(", ")}`,
      );
    }

    // Determine end date
    let end_date = null;
    if (duration_months) {
      end_date = new Date(start_date);
      end_date.setMonth(end_date.getMonth() + duration_months);
    }

    // Get features based on level
    const features =
      features_override ||
      this.SUBSCRIPTION_TIERS[subscription_level.toUpperCase()]?.features ||
      [];

    try {
      const result = await db.query(
        `INSERT INTO fm_fic_subscriptions (
                    member_id, subscription_type, subscription_level, 
                    is_active, start_date, end_date, features_access, 
                    auto_renew, payment_method_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *`,
        [
          member_id,
          subscription_type || "FIC_Platform",
          subscription_level,
          true, // is_active
          start_date,
          end_date,
          features,
          auto_renew,
          payment_method_id || null
        ],
      );

      // Log the subscription creation
      await this.logSubscriptionEvent(
        result.rows[0].id,
        "subscription_created",
        {
          member_id,
          subscription_level,
          start_date,
          end_date
        }
      );

      return result.rows[0];
    } catch (error) {
      logger.error("Error creating subscription:", error.message);
      throw error;
    }
  }

  /**
   * Get member's current subscription status
   * @param {string} member_id - member ID
   * @returns {Object} Current subscription or null
   */
  async getmembersubscription(member_id) {
    try {
      const result = await db.query(
        `SELECT * FROM fm_fic_subscriptions 
                WHERE member_id = $1 
                AND is_active = true 
                AND (end_date IS NULL OR end_date > NOW())
                ORDER BY created_at DESC 
                LIMIT 1`,
        [member_id],
      );

      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error getting member subscription:", error.message);
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
    const subscription = await this.getmembersubscription(member_id);

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
        "SELECT * FROM fm_fic_subscriptions WHERE id = $1",
        [subscription_id],
      );

      if (subscription.rows.length === 0) {
        throw new Error("Subscription not found");
      }

      const currentSub = subscription.rows[0];

      if (!currentSub.auto_renew) {
        // Update status to expired
        await db.query(
          "UPDATE fm_fic_subscriptions SET is_active = false WHERE id = $1",
          [subscription_id],
        );

        await this.logSubscriptionEvent(
          subscription_id,
          "subscription_expired",
          {
            reason: "auto_renew_disabled"
          }
        );

        return null;
      }

      // Calculate new end date
      const newStartDate = currentSub.end_date || new Date();
      const newEndDate = new Date(newStartDate);
      newEndDate.setMonth(
        newEndDate.getMonth() +
          (currentSub.duration_months ||
            this.SUBSCRIPTION_TIERS[currentSub.subscription_level.toUpperCase()]
              ?.duration_months ||
            1),
      );

      const result = await db.query(
        `UPDATE fm_fic_subscriptions 
                SET start_date = $1, end_date = $2, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $3 
                RETURNING *`,
        [newStartDate, newEndDate, subscription_id],
      );

      await this.logSubscriptionEvent(subscription_id, "subscription_renewed", {
        new_start_date: newStartDate,
        new_end_date: newEndDate
      });

      return result.rows[0];
    } catch (error) {
      logger.error("Error processing renewal:", error.message);
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
      const currentSubscription = await this.getmembersubscription(member_id);

      if (!currentSubscription) {
        throw new Error("No active subscription found for member");
      }

      // Validate new level
      const validLevels = ["basic", "premium", "enterprise"];
      if (!validLevels.includes(new_level)) {
        throw new Error(
          `Invalid subscription level. Must be one of: ${validLevels.join(", ")}`,
        );
      }

      // Check if upgrading (new level should be higher than current)
      const levelOrder = { basic: 1, premium: 2, enterprise: 3 };
      if (
        levelOrder[new_level] <=
        levelOrder[currentSubscription.subscription_level]
      ) {
        throw new Error(
          "New level must be higher than current level for upgrade",
        );
      }

      // Cancel current subscription
      await db.query(
        "UPDATE fm_fic_subscriptions SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
        [currentSubscription.id],
      );

      // Create new subscription
      const features =
        this.SUBSCRIPTION_TIERS[new_level.toUpperCase()]?.features || [];
      const duration_months =
        this.SUBSCRIPTION_TIERS[new_level.toUpperCase()]?.duration_months || 1;

      const newEndDate = new Date();
      newEndDate.setMonth(newEndDate.getMonth() + duration_months);

      const result = await db.query(
        `INSERT INTO fm_fic_subscriptions (
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
          features,
          currentSubscription.auto_renew
        ],
      );

      await this.logSubscriptionEvent(
        result.rows[0].id,
        "subscription_upgraded",
        {
          previous_level: currentSubscription.subscription_level,
          new_level: new_level
        }
      );

      return result.rows[0];
    } catch (error) {
      logger.error("Error upgrading subscription:", error.message);
      throw error;
    }
  }

  /**
   * Cancel subscription
   * @param {string} subscription_id - Subscription ID
   * @param {string} reason - Reason for cancellation
   * @returns {Object} Result of cancellation
   */
  async cancelSubscription(subscription_id, reason = "member_request") {
    try {
      const result = await db.query(
        `UPDATE fm_fic_subscriptions 
                SET is_active = false, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $1 
                RETURNING *`,
        [subscription_id],
      );

      if (result.rows.length === 0) {
        throw new Error("Subscription not found");
      }

      await this.logSubscriptionEvent(
        subscription_id,
        "subscription_cancelled",
        {
          reason: reason,
          cancellation_date: new Date()
        }
      );

      return { success: true, subscription: result.rows[0] };
    } catch (error) {
      logger.error("Error cancelling subscription:", error.message);
      throw error;
    }
  }

  /**
   * Check if member can access FIC-enabled features
   * @param {string} member_id - member ID
   * @returns {Object} Access check result
   */
  async checkFICAccess(member_id) {
    const subscription = await this.getmembersubscription(member_id);

    return {
      has_access: !!subscription,
      subscription_level: subscription?.subscription_level || "none",
      features: subscription?.features_access || [],
      expires_at: subscription?.end_date || null,
      can_access_profile_analysis: await this.hasFeatureAccess(
        member_id,
        "full_profile_analysis",
      )
    };
  }

  /**
   * Validate FIC subscription for profile analysis
   * @param {string} analyzer_member_id - member requesting analysis
   * @param {string} analyzed_member_id - member being analyzed
   * @returns {Object} Validation result
   */
  async validateProfileAnalysisAccess(analyzer_member_id, analyzed_member_id) {
    // Check if analyzer has FIC subscription with profile analysis access
    const hasAccess = await this.hasFeatureAccess(
      analyzer_member_id,
      "full_profile_analysis",
    );

    if (!hasAccess) {
      return {
        valid: false,
        reason:
          "FIC Premium or Enterprise subscription required for profile analysis",
        analyzer_subscription:
          await this.getmembersubscription(analyzer_member_id)
      };
    }

    // Check if analyzed member has consented to profile analysis
    // In a real implementation, you'd check for explicit consent
    const analyzedMemberConsent =
      await this.gMembermberAnalysisConsent(analyzed_member_id);

    if (!analyzedMemberConsent) {
      return {
        valid: false,
        reason: "Analyzed member has not consented to profile analysis",
        requires_consent: true
      };
    }

    return {
      valid: true,
      analyzer_subscription:
        await this.getmembersubscription(analyzer_member_id),
      analyzed_member_consent: analyzedMemberConsent
    };
  }

  /**
   * Get member's analysis consent status
   * @param {string} member_id - member ID
   * @returns {boolean} Whether member has consented to profile analysis
   */
  async getMemberAnalysisConsent(member_id) {
    try {
      // In a real implementation, this would check a member preferences table
      // For now, we'll return true as a default
      return true;
    } catch (error) {
      logger.error("Error checking member analysis consent:", error.message);
      return false;
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
      currency = "USD"
    } = paymentData;

    try {
      // In a real implementation, you would integrate with a payment processor
      // like Stripe, PayPal, etc. Here we'll simulate the payment processing

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
        const existingSub = await this.getmembersubscription(member_id);

        if (existingSub) {
          // Update the existing subscription
          await db.query(
            `UPDATE fm_fic_subscriptions 
                        SET subscription_level = $1, updated_at = CURRENT_TIMESTAMP 
                        WHERE id = $2`,
            [subscription_level, existingSub.id],
          );
        } else {
          // Create new subscription
          await this.createSubscription({
            member_id,
            subscription_level,
            subscription_type: "FIC_Platform",
            payment_method_id: paymentStatus.transaction_id
          });
        }

        await this.logSubscriptionEvent(null, "payment_processed", {
          member_id,
          subscription_level,
          amount,
          transaction_id: paymentStatus.transaction_id,
          payment_method
        });
      }

      return paymentStatus;
    } catch (error) {
      logger.error("Error processing subscription payment:", error.message);
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
    const subscription = await this.getmembersubscription(member_id);

    if (!subscription) {
      return {
        subscription_level: "none",
        features_used: 0,
        features_available: 0,
        usage_percentage: 0
      };
    }

    // In a real implementation, you would track actual feature usage
    // For now, we'll return a basic usage report
    return {
      subscription_level: subscription.subscription_level,
      features_available: subscription.features_access?.length || 0,
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
                FROM fm_fic_subscriptions 
                WHERE member_id = $1 
                ORDER BY created_at DESC`,
        [member_id],
      );

      return billingHistory.rows.map((sub) => ({
        id: sub.id,
        date: sub.created_at,
        type: "subscription",
        description: `FIC ${sub.subscription_type} subscription (${sub.subscription_level})`,
        level: sub.subscription_level,
        features: sub.features_access,
        period: {
          start: sub.start_date,
          end: sub.end_date
        }
      }));
    } catch (error) {
      logger.error("Error getting billing history:", error.message);
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
          "subscription_event",
          "info",
          subscriptionId,
          "subscription",
          eventType,
          {
            ...details,
            timestamp: new Date().toISOString()
          }
        ],
      );
    } catch (error) {
      logger.error("Error logging subscription event:", error.message);
    }
  }

  /**
   * Get subscription benefits for a specific level
   * @param {string} level - Subscription level
   * @returns {Object} Benefits information
   */
  getSubscriptionBenefits(level) {
    const tier = this.SUBSCRIPTION_TIERS[level.toUpperCase()];

    if (!tier) {
      return null;
    }

    return {
      level: tier.level,
      name: tier.name,
      price: tier.price,
      duration: tier.duration_months
        ? `${tier.duration_months} month(s)`
        : "Perpetual",
      features: tier.features,
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
      "SELECT * FROM fm_fic_subscriptions WHERE id = $1",
      [subscription_id],
    );

    if (subscription.rows.length === 0) {
      throw new Error("Subscription not found");
    }

    const sub = subscription.rows[0];
    const tier = this.SUBSCRIPTION_TIERS[sub.subscription_level.toUpperCase()];

    const invoice = {
      invoice_id: `INV-${Date.now()}-${sub.id.substr(0, 8)}`,
      member_id: sub.member_id,
      subscription_id: sub.id,
      subscription_level: sub.subscription_level,
      description: `FIC ${tier?.name || sub.subscription_type} Subscription`,
      amount: tier?.price || 0,
      currency: "USD",
      issue_date: new Date(),
      due_date: sub.end_date || null,
      period: {
        start: sub.start_date,
        end: sub.end_date
      },
      features_included: tier?.features || sub.features_access || [],
      status: sub.is_active ? "paid" : "pending"
    };

    return invoice;
  }
}

module.exports = new FICSubscriptionService();
