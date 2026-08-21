/**
 * AnalyticsController - Complete Implementation
 * Extracted from routes/analytics.js inline handlers
 */

const { identityDb, monetizationDb, securityDb } = require("../db");
const logger = require('../utils/logger');

class AnalyticsController {
  /**
   * GET /api/analytics/engagement-metrics
   * Get engagement metrics
   */
  async getEngagementMetrics(req, res) {
    try {
      const { timeRange = 'week', startDate, endDate } = req.query;
      const userId = req.user.id;

      // Determine date range based on timeRange
      let dateQuery = '';
      const params = [];
      
      if (startDate && endDate) {
        dateQuery = 'WHERE created_at BETWEEN $1 AND $2';
        params.push(startDate, endDate);
      } else {
        switch(timeRange.toLowerCase()) {
          case 'day':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 day'";
            break;
          case 'week':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 week'";
            break;
          case 'month':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 month'";
            break;
          case 'year':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 year'";
            break;
          default:
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 week'";
        }
      }

      // Get engagement metrics
      const engagementQuery = ` SELECT 
          (SELECT COUNT(*) FROM posts p ${dateQuery}) as total_posts (SELECT COUNT(*) FROM post_likes pl JOIN posts p ON pl.post_id = p.id ${dateQuery.replace('created_at', 'p.created_at')}) as total_likes (SELECT COUNT(*) FROM comments c JOIN posts p ON c.post_id = p.id ${dateQuery.replace('created_at', 'p.created_at')}) as total_comments (SELECT COUNT(*) FROM user_sessions us ${dateQuery.replace('created_at', 'us.created_at')}) as total_sessions (SELECT COUNT(DISTINCT user_id) FROM user_sessions us ${dateQuery.replace('created_at', 'us.created_at')}) as unique_visitors (SELECT AVG(CAST(value AS FLOAT)) FROM analytics_events WHERE event_type = 'session_duration' ${dateQuery.replace('created_at', 'created_at')}) as avg_session_duration
      `;

      const engagementResult = await identityDb.query(engagementQuery, params);

      res.json({
        success: true, message: "Engagement metrics retrieved successfully",
        data: {
          timeRange: timeRange, startDate: startDate || new Date(Date.now() - (timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString(),
          metrics: {
            totalPosts: parseInt(engagementResult.rows[0].total_posts) || 0,
            totalLikes: parseInt(engagementResult.rows[0].total_likes) || 0,
            totalComments: parseInt(engagementResult.rows[0].total_comments) || 0,
            totalSessions: parseInt(engagementResult.rows[0].total_sessions) || 0,
            uniqueVisitors: parseInt(engagementResult.rows[0].unique_visitors) || 0, avgSessionDuration: parseFloat(engagementResult.rows[0].avg_session_duration) || 0, engagementRate: ((parseInt(engagementResult.rows[0].total_likes) + parseInt(engagementResult.rows[0].total_comments)) / 
                            Math.max(parseInt(engagementResult.rows[0].unique_visitors), 1) * 100).toFixed(2)
          }
        }
      });
    } catch (error) {
      logger.error("Engagement Metrics, Error:", error);
      res.status(500).json({
        success: false, message: "Internal server error retrieving engagement metrics"
      });
    }
  }

  /**
   * GET /api/analytics/revenue
   * Get revenue metrics
   */
  async getRevenue(req, res) {
    try {
      const { timeRange = 'month', startDate, endDate } = req.query;

      // Determine date range based on timeRange
      let dateQuery = '';
      const params = [];
      
      if (startDate && endDate) {
        dateQuery = 'WHERE created_at BETWEEN $1 AND $2';
        params.push(startDate, endDate);
      } else {
        switch(timeRange.toLowerCase()) {
          case 'day':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 day'";
            break;
          case 'week':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 week'";
            break;
          case 'month':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 month'";
            break;
          case 'year':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 year'";
            break;
          default:
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 month'";
        }
      }

      // Get revenue metrics
      const revenueQuery = ` SELECT 
          (SELECT COALESCE(SUM(amount), 0) FROM fic_transactions ft 
           JOIN fic_wallets fw ON ft.wallet_id = fw.id 
           WHERE ft.transaction_type IN ('deposit', 'purchase', 'subscription_payment') 
           ${dateQuery.replace('WHERE', 'AND')}) as total_revenue (SELECT COALESCE(SUM(amount), 0) FROM fic_transactions ft 
           JOIN fic_wallets fw ON ft.wallet_id = fw.id 
           WHERE ft.transaction_type = 'subscription_payment' 
           ${dateQuery.replace('WHERE', 'AND')}) as subscription_revenue (SELECT COALESCE(SUM(amount), 0) FROM monetization_events me 
           WHERE me.event_type = 'ppv_purchase' 
           ${dateQuery}) as pay_per_view_revenue (SELECT COALESCE(SUM(amount), 0) FROM monetization_events me 
           WHERE me.event_type = 'gifting_transaction' 
           ${dateQuery}) as gifting_revenue (SELECT COUNT(*) FROM monetization_events me 
           WHERE me.event_type = 'subscription_payment' 
           ${dateQuery}) as subscription_count (SELECT COUNT(*) FROM fic_transactions ft 
           JOIN fic_wallets fw ON ft.wallet_id = fw.id 
           WHERE ft.transaction_type = 'purchase' 
           ${dateQuery.replace('WHERE', 'AND')}) as purchase_count
      `;

      const revenueResult = await monetizationDb.query(revenueQuery, params);

      res.json({
        success: true, message: "Revenue metrics retrieved successfully",
        data: {
          timeRange: timeRange, startDate: startDate || new Date(Date.now() - (timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString(),
          metrics: {
            totalRevenue: parseFloat(revenueResult.rows[0].total_revenue) || 0,
            subscriptionRevenue: parseFloat(revenueResult.rows[0].subscription_revenue) || 0,
            payPerViewRevenue: parseFloat(revenueResult.rows[0].pay_per_view_revenue) || 0,
            giftingRevenue: parseFloat(revenueResult.rows[0].gifting_revenue) || 0, subscriptionCount: parseInt(revenueResult.rows[0].subscription_count) || 0, purchaseCount: parseInt(revenueResult.rows[0].purchase_count) || 0
          }
        }
      });
    } catch (error) {
      logger.error("Revenue Metrics, Error:", error);
      res.status(500).json({
        success: false, message: "Internal server error retrieving revenue metrics"
      });
    }
  }

  /**
   * GET /api/analytics/traffic
   * Get traffic metrics
   */
  async getTraffic(req, res) {
    try {
      const { timeRange = 'week', startDate, endDate } = req.query;

      // Determine date range based on timeRange
      let dateQuery = '';
      const params = [];
      
      if (startDate && endDate) {
        dateQuery = 'WHERE created_at BETWEEN $1 AND $2';
        params.push(startDate, endDate);
      } else {
        switch(timeRange.toLowerCase()) {
          case 'day':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 day'";
            break;
          case 'week':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 week'";
            break;
          case 'month':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 month'";
            break;
          case 'year':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 year'";
            break;
          default:
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 week'";
        }
      }

      // Get traffic metrics
      const trafficQuery = ` SELECT 
          (SELECT COUNT(*) FROM user_sessions us ${dateQuery}) as total_sessions,
          (SELECT COUNT(DISTINCT user_id) FROM user_sessions us ${dateQuery}) as unique_visitors (SELECT COUNT(DISTINCT user_id) FROM user_sessions us 
           WHERE created_at >= NOW() - INTERVAL '3 months' AND user_id IN (SELECT DISTINCT user_id FROM user_sessions WHERE ${dateQuery.replace('WHERE', '')})) as returning_visitors,
          (SELECT COUNT(*) FROM posts p ${dateQuery}) as new_content_count (SELECT COUNT(*) FROM users u ${dateQuery.replace('created_at', 'created_at')}) as new_users (SELECT COUNT(*) FROM analytics_events ae WHERE ae.event_type = 'page_view' ${dateQuery}) as total_page_views (SELECT COALESCE(AVG(CAST(value AS FLOAT)), 0) FROM analytics_events ae WHERE ae.event_type = 'session_duration' ${dateQuery}) as avg_session_duration_seconds
      `;

      const trafficResult = await identityDb.query(trafficQuery, params);

      res.json({
        success: true, message: "Traffic metrics retrieved successfully",
        data: {
          timeRange: timeRange, startDate: startDate || new Date(Date.now() - (timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString(),
          metrics: {
            totalSessions: parseInt(trafficResult.rows[0].total_sessions) || 0,
            uniqueVisitors: parseInt(trafficResult.rows[0].unique_visitors) || 0,
            returningVisitors: parseInt(trafficResult.rows[0].returning_visitors) || 0,
            newContentCount: parseInt(trafficResult.rows[0].new_content_count) || 0,
            newUsers: parseInt(trafficResult.rows[0].new_users) || 0,
            totalPageViews: parseInt(trafficResult.rows[0].total_page_views) || 0, avgSessionDurationSeconds: parseFloat(trafficResult.rows[0].avg_session_duration_seconds) || 0, bounceRate: ((parseInt(trafficResult.rows[0].unique_visitors) - parseInt(trafficResult.rows[0].total_page_views)) / 
                        Math.max(parseInt(trafficResult.rows[0].unique_visitors), 1) * 100).toFixed(2)
          }
        }
      });
    } catch (error) {
      logger.error("Traffic Metrics, Error:", error);
      res.status(500).json({
        success: false, message: "Internal server error retrieving traffic metrics"
      });
    }
  }

  /**
   * GET /api/analytics/user-growth
   * Get user growth metrics
   */
  async getUserGrowth(req, res) {
    try {
      const { timeRange = 'month', startDate, endDate } = req.query;

      // Determine date range based on timeRange
      let dateQuery = '';
      const params = [];
      
      if (startDate && endDate) {
        dateQuery = 'WHERE created_at BETWEEN $1 AND $2';
        params.push(startDate, endDate);
      } else {
        switch(timeRange.toLowerCase()) {
          case 'day':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 day'";
            break;
          case 'week':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 week'";
            break;
          case 'month':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 month'";
            break;
          case 'year':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 year'";
            break;
          default:
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 month'";
        }
      }

      // Get user growth metrics
      const growthQuery = ` SELECT 
          (SELECT COUNT(*) FROM users u ${dateQuery}) as new_users,
          (SELECT COUNT(*) FROM users) as total_users (SELECT COUNT(*) FROM profiles p JOIN users u ON p.user_id = u.id WHERE p.completed = true ${dateQuery.replace('created_at', 'u.created_at')}) as completed_profiles,
          (SELECT COUNT(*) FROM user_sessions us ${dateQuery}) as active_sessions,
          (SELECT COUNT(DISTINCT user_id) FROM user_sessions us ${dateQuery}) as active_users
      `;

      const growthResult = await identityDb.query(growthQuery, params);

      res.json({
        success: true, message: "User growth metrics retrieved successfully",
        data: {
          timeRange: timeRange, startDate: startDate || new Date(Date.now() - (timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString(),
          metrics: {
            newUsers: parseInt(growthResult.rows[0].new_users) || 0,
            totalUsers: parseInt(growthResult.rows[0].total_users) || 0,
            completedProfiles: parseInt(growthResult.rows[0].completed_profiles) || 0,
            activeSessions: parseInt(growthResult.rows[0].active_sessions) || 0, activeUsers: parseInt(growthResult.rows[0].active_users) || 0, growthRate: (parseInt(growthResult.rows[0].new_users) / 
                        Math.max(parseInt(growthResult.rows[0].total_users) - parseInt(growthResult.rows[0].new_users), 1) * 100).toFixed(2)
          }
        }
      });
    } catch (error) {
      logger.error("User Growth Metrics, Error:", error);
      res.status(500).json({
        success: false, message: "Internal server error retrieving user growth metrics"
      });
    }
  }

  /**
   * GET /api/analytics/conversion
   * Get conversion metrics
   */
  async getConversion(req, res) {
    try {
      const { timeRange = 'week', startDate, endDate } = req.query;

      // Determine date range based on timeRange
      let dateQuery = '';
      const params = [];
      
      if (startDate && endDate) {
        dateQuery = 'WHERE created_at BETWEEN $1 AND $2';
        params.push(startDate, endDate);
      } else {
        switch(timeRange.toLowerCase()) {
          case 'day':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 day'";
            break;
          case 'week':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 week'";
            break;
          case 'month':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 month'";
            break;
          case 'year':
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 year'";
            break;
          default:
            dateQuery = "WHERE created_at >= NOW() - INTERVAL '1 week'";
        }
      }

      // Get conversion metrics
      const conversionQuery = ` SELECT 
          (SELECT COUNT(*) FROM users u ${dateQuery}) as registrations (SELECT COUNT(*) FROM profiles p JOIN users u ON p.user_id = u.id WHERE p.completed = true ${dateQuery.replace('created_at', 'u.created_at')}) as completed_profiles (SELECT COUNT(*) FROM fic_wallets fw JOIN users u ON fw.user_id = u.id ${dateQuery.replace('created_at', 'u.created_at')}) as wallets_created (SELECT COUNT(*) FROM fic_transactions ft JOIN fic_wallets fw ON ft.wallet_id = fw.id JOIN users u ON fw.user_id = u.id ${dateQuery.replace('created_at', 'u.created_at')}) as transactions_completed,
          (SELECT COUNT(*) FROM monetization_events me ${dateQuery}) as monetization_events
      `;

      const conversionResult = await identityDb.query(conversionQuery, params);

      const registrations = parseInt(conversionResult.rows[0].registrations) || 1; // Avoid division by zero

      res.json({
        success: true, message: "Conversion metrics retrieved successfully",
        data: {
          timeRange: timeRange, startDate: startDate || new Date(Date.now() - (timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString(),
          metrics: {
            registrations: parseInt(conversionResult.rows[0].registrations) || 0,
            profileCompletion: parseInt(conversionResult.rows[0].completed_profiles) || 0,
            walletsCreated: parseInt(conversionResult.rows[0].wallets_created) || 0,
            transactionsCompleted: parseInt(conversionResult.rows[0].transactions_completed) || 0,
            monetizationEvents: parseInt(conversionResult.rows[0].monetization_events) || 0,
            profileCompletionRate: (parseInt(conversionResult.rows[0].completed_profiles) / registrations * 100).toFixed(2), walletCreationRate: (parseInt(conversionResult.rows[0].wallets_created) / registrations * 100).toFixed(2), transactionCompletionRate: (parseInt(conversionResult.rows[0].transactions_completed) / Math.max(parseInt(conversionResult.rows[0].wallets_created), 1) * 100).toFixed(2)
          }
        }
      });
    } catch (error) {
      logger.error("Conversion Metrics, Error:", error);
      res.status(500).json({
        success: false, message: "Internal server error retrieving conversion metrics"
      });
    }
  }

  /**
   * GET /api/analytics/retention
   * Get retention metrics
   */
  async getRetention(req, res) {
    try {
      const { timeRange = 'week' } = req.query;

      // Calculate retention based on user activity
      const retentionQuery = `
        WITH cohort_analysis AS (
          SELECT 
            DATE_TRUNC('week', created_at) as cohort_week,
            user_id COUNT(*) as session_count
          FROM user_sessions
          GROUP BY DATE_TRUNC('week', created_at), user_id
        ),
        retention_calculated AS (
          SELECT
            cohort_week,
            COUNT(DISTINCT user_id) as initial_users,
            COUNT(DISTINCT CASE WHEN session_count > 1 THEN user_id END) as retained_users
          FROM cohort_analysis
          GROUP BY cohort_week
        )
        SELECT 
          cohort_week,
          initial_users,
          retained_users,
          ROUND(retained_users::DECIMAL / initial_users * 100, 2) as retention_rate
        FROM retention_calculated
        ORDER BY cohort_week DESC
        LIMIT 4
      `;

      const retentionResult = await identityDb.query(retentionQuery);

      res.json({
        success: true, message: "Retention metrics retrieved successfully",
        data: {
          timeRange: timeRange,
          cohorts: retentionResult.rows.map(row => ({
            cohortWeek: row.cohort_week,
            initialUsers: parseInt(row.initial_users),
            retainedUsers: parseInt(row.retained_users), retentionRate: parseFloat(row.retention_rate)
          }))
        }
      });
    } catch (error) {
      logger.error("Retention Metrics, Error:", error);
      res.status(500).json({
        success: false, message: "Internal server error retrieving retention metrics"
      });
    }
  }
}

module.exports = new AnalyticsController();
