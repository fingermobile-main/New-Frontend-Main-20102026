/**
 * Lush Trends Controller
 * Handles all trends-related operations for the Lush Pressies app
 */

const db = require('../config/database');

class LushTrendsController {
  /**
   * Get trending topics
   */
  static async getTrendingTopics(timeframe = 'daily', limit = 10) {
    try {
      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get trending topics based on timeframe
      const topics = await db.getTrendingTopics(timeframe, limit);

      return {
        success: true,
        topics,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting trending topics:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trending hashtags
   */
  static async getTrendingHashtags(timeframe = 'daily', limit = 10) {
    try {
      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get trending hashtags based on timeframe
      const hashtags = await db.getTrendingHashtags(timeframe, limit);

      return {
        success: true,
        hashtags,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting trending hashtags:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trending users
   */
  static async getTrendingUsers(timeframe = 'daily', limit = 10, userId = null) {
    try {
      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get trending users based on timeframe
      const users = await db.getTrendingUsers(timeframe, limit, userId);

      // Add user details to each trending user
      const usersWithDetails = await Promise.all(
        users.map(async (user) => {
          const userDetails = await db.getUser(user.userId);
          return {
            ...user,
            user: {
              id: userDetails.id,
              username: userDetails.username,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              avatar: userDetails.avatar,
              isOnline: userDetails.isOnline
            }
          };
        })
      );

      return {
        success: true,
        users: usersWithDetails,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting trending users:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trending content
   */
  static async getTrendingContent(timeframe = 'daily', limit = 10, userId = null) {
    try {
      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get trending content based on timeframe
      const content = await db.getTrendingContent(timeframe, limit, userId);

      // Add content details
      const contentWithDetails = await Promise.all(
        content.map(async (item) => {
          // Get author details
          const author = await db.getUser(item.authorId);
          
          return {
            ...item,
            author: {
              id: author.id,
              username: author.username,
              firstName: author.firstName,
              lastName: author.lastName,
              avatar: author.avatar
            }
          };
        })
      );

      return {
        success: true,
        content: contentWithDetails,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting trending content:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trending interests
   */
  static async getTrendingInterests(timeframe = 'daily', limit = 10) {
    try {
      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get trending interests based on timeframe
      const interests = await db.getTrendingInterests(timeframe, limit);

      return {
        success: true,
        interests,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting trending interests:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get personalized trends for a user
   */
  static async getPersonalizedTrends(userId, timeframe = 'daily', limit = 10) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get user's preferences
      const userPreferences = await db.getUserPreferences(userId);

      // Get trending content based on user's interests
      const personalizedTrends = await db.getPersonalizedTrends(userId, userPreferences, timeframe, limit);

      return {
        success: true,
        trends: personalizedTrends,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting personalized trends:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trend analytics
   */
  static async getTrendAnalytics(trendType, trendId, startDate, endDate) {
    try {
      if (!trendType || !trendId) {
        return { success: false, error: 'Trend type and trend ID are required' };
      }

      // Validate trend type
      const validTrendTypes = ['topic', 'hashtag', 'user', 'content', 'interest'];
      if (!validTrendTypes.includes(trendType)) {
        return { success: false, error: 'Invalid trend type' };
      }

      // Set default date range if not provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
      const end = endDate ? new Date(endDate) : new Date();

      // Get trend analytics
      const analytics = await db.getTrendAnalytics(trendType, trendId, start, end);

      return {
        success: true,
        analytics,
        trendType,
        trendId,
        dateRange: { start, end }
      };
    } catch (error) {
      console.error('Error getting trend analytics:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trend predictions
   */
  static async getTrendPredictions(timeframe = 'daily', limit = 10) {
    try {
      // Validate timeframe
      const validTimeframes = ['daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get trend predictions
      // In a real implementation, this would use ML models to predict trends
      // For now, we'll return trending items that are gaining momentum
      const predictions = await db.getTrendPredictions(timeframe, limit);

      return {
        success: true,
        predictions,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting trend predictions:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trend history
   */
  static async getTrendHistory(trendType, trendId, timeframe = 'daily') {
    try {
      if (!trendType || !trendId) {
        return { success: false, error: 'Trend type and trend ID are required' };
      }

      // Validate trend type
      const validTrendTypes = ['topic', 'hashtag', 'user', 'content', 'interest'];
      if (!validTrendTypes.includes(trendType)) {
        return { success: false, error: 'Invalid trend type' };
      }

      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get trend history
      const history = await db.getTrendHistory(trendType, trendId, timeframe);

      return {
        success: true,
        history,
        trendType,
        trendId,
        timeframe
      };
    } catch (error) {
      console.error('Error getting trend history:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get regional trends
   */
  static async getRegionalTrends(region, timeframe = 'daily', limit = 10) {
    try {
      if (!region) {
        return { success: false, error: 'Region is required' };
      }

      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get regional trends
      const trends = await db.getRegionalTrends(region, timeframe, limit);

      return {
        success: true,
        trends,
        region,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting regional trends:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get seasonal trends
   */
  static async getSeasonalTrends(season, limit = 10) {
    try {
      if (!season) {
        return { success: false, error: 'Season is required' };
      }

      // Validate season
      const validSeasons = ['spring', 'summer', 'autumn', 'winter', 'holiday_season'];
      if (!validSeasons.includes(season)) {
        return { success: false, error: 'Invalid season' };
      }

      // Get seasonal trends
      const trends = await db.getSeasonalTrends(season, limit);

      return {
        success: true,
        trends,
        season,
        limit
      };
    } catch (error) {
      console.error('Error getting seasonal trends:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trend alerts for user
   */
  static async getTrendAlerts(userId, preferences = {}) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get user's trend alert preferences
      const userAlertPrefs = await db.getUserTrendAlertPreferences(userId);
      
      // If no preferences set, use defaults
      const alertPrefs = { ...userAlertPrefs, ...preferences };

      // Get relevant trends based on preferences
      const alerts = await db.getTrendAlerts(userId, alertPrefs);

      return {
        success: true,
        alerts,
        preferences: alertPrefs
      };
    } catch (error) {
      console.error('Error getting trend alerts:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Subscribe to trend alerts
   */
  static async subscribeToTrendAlerts(userId, preferences) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Validate preferences
      if (!preferences || typeof preferences !== 'object') {
        return { success: false, error: 'Valid preferences object is required' };
      }

      // Save user's trend alert preferences
      const subscription = await db.saveTrendAlertPreferences(userId, preferences);

      return {
        success: true,
        subscription
      };
    } catch (error) {
      console.error('Error subscribing to trend alerts:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trending gifts
   */
  static async getTrendingGifts(timeframe = 'daily', limit = 10) {
    try {
      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get trending gifts based on timeframe
      const gifts = await db.getTrendingGifts(timeframe, limit);

      return {
        success: true,
        gifts,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting trending gifts:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trending matching preferences
   */
  static async getTrendingMatchingPreferences(timeframe = 'daily', limit = 10) {
    try {
      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get trending matching preferences based on timeframe
      const preferences = await db.getTrendingMatchingPreferences(timeframe, limit);

      return {
        success: true,
        preferences,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting trending matching preferences:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}

module.exports = LushTrendsController;