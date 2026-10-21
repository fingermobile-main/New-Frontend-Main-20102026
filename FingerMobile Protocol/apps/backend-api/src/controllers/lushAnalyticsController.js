/**
 * Lush Analytics Controller
 * Handles all analytics-related operations for the Lush Pressies app
 */

const db = require('../config/database');

class LushAnalyticsController {
  /**
   * Track a user event
   */
  static async trackEvent(userId, eventType, properties = {}, timestamp = new Date()) {
    try {
      // Validate inputs
      if (!userId || !eventType) {
        return { success: false, error: 'User ID and event type are required' };
      }

      // Create event record
      const event = await db.createEvent({
        userId,
        eventType,
        properties,
        timestamp
      });

      // Update user's activity stats
      await db.updateUserActivityStats(userId, eventType);

      // For certain events, update related analytics
      switch (eventType) {
        case 'profile_view':
          await db.incrementProfileViews(userId);
          break;
        case 'like_given':
          await db.incrementLikesGiven(userId);
          break;
        case 'like_received':
          await db.incrementLikesReceived(userId);
          break;
        case 'match_created':
          await db.incrementMatches(userId);
          break;
        case 'message_sent':
          await db.incrementMessagesSent(userId);
          break;
        case 'gift_sent':
          await db.incrementGiftsSent(userId);
          break;
        case 'gift_received':
          await db.incrementGiftsReceived(userId);
          break;
        case 'subscription_purchased':
          await db.incrementSubscriptions(userId);
          break;
        case 'credit_purchased':
          await db.incrementCreditPurchases(userId);
          break;
      }

      return {
        success: true,
        eventId: event.id
      };
    } catch (error) {
      console.error('Error tracking event:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user analytics
   */
  static async getUserAnalytics(userId, startDate, endDate) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Set default date range if not provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
      const end = endDate ? new Date(endDate) : new Date();

      // Get user's activity data
      const userData = await db.getUserActivityData(userId, start, end);

      // Get user's engagement metrics
      const engagementMetrics = await db.getUserEngagementMetrics(userId, start, end);

      // Get user's demographic info
      const userDemographics = await db.getUserDemographics(userId);

      return {
        success: true,
        user: {
          id: userId,
          demographics: userDemographics,
          activity: userData,
          engagement: engagementMetrics
        }
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get app analytics overview
   */
  static async getAppAnalytics(startDate, endDate) {
    try {
      // Set default date range if not provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
      const end = endDate ? new Date(endDate) : new Date();

      // Get general app metrics
      const appMetrics = await db.getAppMetrics(start, end);

      // Get user acquisition metrics
      const acquisitionMetrics = await db.getUserAcquisitionMetrics(start, end);

      // Get engagement metrics
      const engagementMetrics = await db.getEngagementMetrics(start, end);

      // Get revenue metrics
      const revenueMetrics = await db.getRevenueMetrics(start, end);

      return {
        success: true,
        overview: {
          app: appMetrics,
          acquisition: acquisitionMetrics,
          engagement: engagementMetrics,
          revenue: revenueMetrics
        }
      };
    } catch (error) {
      console.error('Error getting app analytics:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user retention analytics
   */
  static async getUserRetentionAnalytics(cohortPeriod = 'weekly') {
    try {
      const retentionData = await db.getUserRetentionData(cohortPeriod);

      return {
        success: true,
        retention: retentionData
      };
    } catch (error) {
      console.error('Error getting user retention analytics:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user engagement over time
   */
  static async getUserEngagementOverTime(userId, metric, granularity = 'daily', startDate, endDate) {
    try {
      if (!userId || !metric) {
        return { success: false, error: 'User ID and metric are required' };
      }

      // Set default date range if not provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
      const end = endDate ? new Date(endDate) : new Date();

      const engagementData = await db.getUserEngagementOverTime(userId, metric, granularity, start, end);

      return {
        success: true,
        engagement: engagementData,
        metric,
        granularity
      };
    } catch (error) {
      console.error('Error getting user engagement over time:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user's most active times
   */
  static async getUserActiveTimes(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const activeTimes = await db.getUserActiveTimes(userId);

      return {
        success: true,
        activeTimes
      };
    } catch (error) {
      console.error('Error getting user active times:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get conversion funnel
   */
  static async getConversionFunnel(steps, startDate, endDate) {
    try {
      if (!steps || !Array.isArray(steps) || steps.length === 0) {
        return { success: false, error: 'Steps array is required' };
      }

      // Set default date range if not provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
      const end = endDate ? new Date(endDate) : new Date();

      const funnelData = await db.getConversionFunnel(steps, start, end);

      return {
        success: true,
        funnel: funnelData,
        steps
      };
    } catch (error) {
      console.error('Error getting conversion funnel:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user cohort analysis
   */
  static async getCohortAnalysis(cohortDimension = 'signup_date', metric = 'retention', startDate, endDate) {
    try {
      // Set default date range if not provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Last 90 days
      const end = endDate ? new Date(endDate) : new Date();

      const cohortData = await db.getCohortAnalysis(cohortDimension, metric, start, end);

      return {
        success: true,
        cohort: cohortData,
        dimension: cohortDimension,
        metric
      };
    } catch (error) {
      console.error('Error getting cohort analysis:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get A/B test results
   */
  static async getAbTestResults(testId, startDate, endDate) {
    try {
      if (!testId) {
        return { success: false, error: 'Test ID is required' };
      }

      // Set default date range if not provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
      const end = endDate ? new Date(endDate) : new Date();

      const abTestData = await db.getAbTestResults(testId, start, end);

      return {
        success: true,
        test: abTestData,
        testId
      };
    } catch (error) {
      console.error('Error getting A/B test results:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user behavior segments
   */
  static async getUserBehaviorSegments(criteria, limit = 100) {
    try {
      if (!criteria) {
        return { success: false, error: 'Criteria is required' };
      }

      const segments = await db.getUserBehaviorSegments(criteria, limit);

      return {
        success: true,
        segments,
        criteria
      };
    } catch (error) {
      console.error('Error getting user behavior segments:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get feature usage analytics
   */
  static async getFeatureUsageAnalytics(featureNames, startDate, endDate) {
    try {
      if (!featureNames || !Array.isArray(featureNames)) {
        return { success: false, error: 'Feature names array is required' };
      }

      // Set default date range if not provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
      const end = endDate ? new Date(endDate) : new Date();

      const featureUsage = await db.getFeatureUsageAnalytics(featureNames, start, end);

      return {
        success: true,
        featureUsage,
        features: featureNames
      };
    } catch (error) {
      console.error('Error getting feature usage analytics:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user lifetime value
   */
  static async getUserLifetimeValue(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const ltv = await db.getUserLifetimeValue(userId);

      return {
        success: true,
        userLtv: ltv,
        userId
      };
    } catch (error) {
      console.error('Error getting user lifetime value:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get churn prediction for user
   */
  static async getChurnPrediction(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get user's recent activity
      const userActivity = await db.getUserRecentActivity(userId, 30); // Last 30 days

      // Simple churn prediction algorithm
      // In a real implementation, this would use ML models
      const churnProbability = this.calculateChurnProbability(userActivity);

      return {
        success: true,
        churnProbability,
        userId,
        riskLevel: this.getRiskLevel(churnProbability)
      };
    } catch (error) {
      console.error('Error getting churn prediction:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Calculate churn probability based on user activity
   */
  static calculateChurnProbability(activityData) {
    // This is a simplified algorithm - in reality, this would be much more complex
    // involving machine learning models and more sophisticated analysis
    
    let score = 0;
    
    // Check last active date
    const now = new Date();
    const lastActive = new Date(activityData.lastActive);
    const daysSinceActive = (now - lastActive) / (1000 * 60 * 60 * 24);
    
    if (daysSinceActive > 14) score += 30;
    if (daysSinceActive > 30) score += 40;
    if (daysSinceActive > 60) score += 30;
    
    // Check engagement frequency
    if (activityData.avgDailySessions < 0.5) score += 20;
    if (activityData.sessionFrequency < 2) score += 15;
    
    // Check feature usage diversity
    if (activityData.featureDiversity < 0.3) score += 25;
    
    // Cap at 100%
    return Math.min(score, 100);
  }

  /**
   * Get risk level based on churn probability
   */
  static getRiskLevel(probability) {
    if (probability < 30) return 'low';
    if (probability < 70) return 'medium';
    return 'high';
  }

  /**
   * Get analytics export
   */
  static async getAnalyticsExport(userId, exportType, startDate, endDate) {
    try {
      if (!userId || !exportType) {
        return { success: false, error: 'User ID and export type are required' };
      }

      // Set default date range if not provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
      const end = endDate ? new Date(endDate) : new Date();

      let exportData;

      switch (exportType) {
        case 'events':
          exportData = await db.getUserEvents(userId, start, end);
          break;
        case 'engagement':
          exportData = await db.getUserEngagementData(userId, start, end);
          break;
        case 'demographics':
          exportData = await db.getUserDemographics(userId);
          break;
        default:
          return { success: false, error: 'Invalid export type' };
      }

      return {
        success: true,
        exportData,
        exportType,
        userId,
        dateRange: { start, end }
      };
    } catch (error) {
      console.error('Error getting analytics export:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}

module.exports = LushAnalyticsController;