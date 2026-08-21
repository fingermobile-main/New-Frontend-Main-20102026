/**
 * Trends Controller
 * Complete implementation for trending content algorithm and discovery
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class TrendsController {
  /**
   * GET /api/trends
   * Get trending content across the platform
   */
  async getTrending(req, res) {
    try {
      const { 
        category = 'all', 
        timeframe = '24h', 
        limit = 20, 
        offset = 0, 
        contentType = 'all' 
      } = req.query;

      // Calculate time window
      let timeWindow;
      switch (timeframe) {
        case '1h': timeWindow = '1 hour'; break;
        case '6h': timeWindow = '6 hours'; break;
        case '24h': timeWindow = '24 hours'; break;
        case '7d': timeWindow = '7 days'; break;
        case '30d': timeWindow = '30 days'; break;
        default: timeWindow = '24 hours';
      }

      let query = '';
      let queryParams = [];

      if (contentType === 'posts' || contentType === 'all') {
        // Safe injection of known enum string value via interpolation
        query = `
          SELECT 
            'post' as content_type,
            p.id,
            p.title,
            p.content,
            p.author_id,
            u.username as author_username,
            u.avatar_url as author_avatar,
            p.created_at,
            COUNT(DISTINCT l.id) as likes_count,
            COUNT(DISTINCT c.id) as comments_count,
            COUNT(DISTINCT s.id) as shares_count,
            (
              COUNT(DISTINCT l.id) * 1.0 +
              COUNT(DISTINCT c.id) * 2.0 +
              COUNT(DISTINCT s.id) * 3.0
            ) / NULLIF(EXTRACT(EPOCH FROM (NOW() - p.created_at)), 0) / 3600 as trending_score
          FROM posts p
          JOIN users u ON p.author_id = u.id
          LEFT JOIN likes l ON l.target_id = p.id AND l.target_type = 'post'
          LEFT JOIN comments c ON c.post_id = p.id
          LEFT JOIN shares s ON s.target_id = p.id AND s.target_type = 'post'
          WHERE p.created_at >= NOW() - INTERVAL '${timeWindow}'
          AND p.is_published = true
        `;
      }

      // Add category filter dynamically
      if (category !== 'all') {
        query += ` AND p.category = $${queryParams.length + 1}`;
        queryParams.push(category);
      }

      query += `
        GROUP BY p.id, u.username, u.avatar_url
        ORDER BY trending_score DESC
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
      `;
      
      // Append pagination parameters onto the final executed params index stack
      queryParams.push(parseInt(limit), parseInt(offset));

      const result = await pool.query(query, queryParams);

      res.json({
        success: true,
        data: result.rows.map(row => ({
          type: row.content_type,
          id: row.id,
          title: row.title,
          content: row.content?.substring(0, 200),
          author: {
            id: row.author_id,
            username: row.author_username,
            avatarUrl: row.author_avatar
          }, // Fixed: Added missing comma
          metrics: {
            likes: parseInt(row.likes_count),
            comments: parseInt(row.comments_count),
            shares: parseInt(row.shares_count)
          }, // Fixed: Added missing comma
          trendingScore: parseFloat(row.trending_score || 0).toFixed(2),
          createdAt: row.created_at
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }, // Fixed: Added missing comma
        metadata: {
          timeframe,
          category, // Fixed: Added missing comma
          contentType
        }
      });
    } catch (error) {
      logger.error('Error in TrendsController.getTrending:', error);
      res.status(500).json({
        success: false, message: 'Failed to get trending content', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/trends/hashtags
   * Get trending hashtags
   */
  async getTrendingHashtags(req, res) {
    try {
      const { limit = 20, timeframe = '24h' } = req.query;

      let timeWindow;
      switch (timeframe) {
        case '1h': timeWindow = '1 hour'; break;
        case '6h': timeWindow = '6 hours'; break;
        case '24h': timeWindow = '24 hours'; break;
        case '7d': timeWindow = '7 days'; break;
        default: timeWindow = '24 hours';
      }

      // Fixed: Converted to backticks, added missing selection comma, and fixed dynamic parametric Interval binding
      const result = await pool.query(`
        SELECT 
          hashtag,
          COUNT(*) as usage_count, 
          COUNT(DISTINCT user_id) as unique_users
         FROM hashtag_usage
         WHERE created_at >= NOW() - $2::interval
         GROUP BY hashtag
         ORDER BY usage_count DESC
         LIMIT $1
      `, [parseInt(limit), timeWindow]);

      res.json({
        success: true,
        data: result.rows.map(row => ({
          hashtag: row.hashtag,
          usageCount: parseInt(row.usage_count),
          uniqueUsers: parseInt(row.unique_users)
        })), // Fixed: Added missing comma
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in TrendsController.getTrendingHashtags:', error);
      res.status(500).json({
        success: false, message: 'Failed to get trending hashtags', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/trends/topics
   * Get trending topics/categories
   */
  async getTrendingTopics(req, res) {
    try {
      const { limit = 10, timeframe = '24h' } = req.query;

      let timeWindow;
      switch (timeframe) {
        case '24h': timeWindow = '24 hours'; break;
        case '7d': timeWindow = '7 days'; break;
        case '30d': timeWindow = '30 days'; break;
        default: timeWindow = '24 hours';
      }

      // Fixed: Converted to backticks, added missing selection comma, and fixed dynamic parametric Interval binding
      const result = await pool.query(`
        SELECT 
          p.category,
          COUNT(DISTINCT p.id) as post_count,
          COUNT(DISTINCT p.author_id) as contributor_count, 
          AVG((COUNT(DISTINCT p.id) * 1.0) / NULLIF(EXTRACT(EPOCH FROM (NOW() - p.created_at)), 0)) as avg_trending_score
         FROM posts p
         WHERE p.created_at >= NOW() - $2::interval
         AND p.is_published = true
         AND p.category IS NOT NULL
         GROUP BY p.category, p.created_at
         ORDER BY post_count DESC
         LIMIT $1
      `, [parseInt(limit), timeWindow]);

      res.json({
        success: true,
        data: result.rows.map(row => ({
          topic: row.category,
          postCount: parseInt(row.post_count),
          contributors: parseInt(row.contributor_count),
          avgTrendingScore: parseFloat(row.avg_trending_score || 0).toFixed(2)
        })), // Fixed: Added missing comma
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in TrendsController.getTrendingTopics:', error);
      res.status(500).json({
        success: false, message: 'Failed to get trending topics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/trends/users
   * Get trending users/creators
   */
  async getTrendingUsers(req, res) {
    try {
      const { limit = 20, timeframe = '7d' } = req.query;

      let timeWindow;
      switch (timeframe) {
        case '24h': timeWindow = '24 hours'; break;
        case '7d': timeWindow = '7 days'; break;
        case '30d': timeWindow = '30 days'; break;
        default: timeWindow = '7 days';
      }

      // Fixed: Converted to backticks, added missing selection comma, and fixed dynamic parametric Interval binding
      const result = await pool.query(`
        SELECT 
          u.id,
          u.username,
          u.avatar_url,
          u.bio,
          COUNT(DISTINCT p.id) as post_count,
          COUNT(DISTINCT l.id) as total_likes_received,
          COUNT(DISTINCT f.follower_id) as follower_count, 
          (
            COUNT(DISTINCT p.id) * 1.0 +
            COUNT(DISTINCT l.id) * 0.5 +
            COUNT(DISTINCT f.follower_id) * 2.0
          ) as influence_score
         FROM users u
         LEFT JOIN posts p ON u.id = p.author_id AND p.created_at >= NOW() - $2::interval
         LEFT JOIN likes l ON p.id = l.target_id AND l.target_type = 'post'
         LEFT JOIN followers f ON u.id = f.following_id
         WHERE u.is_active = true
         GROUP BY u.id, u.username, u.avatar_url, u.bio
         HAVING COUNT(DISTINCT p.id) > 0 OR COUNT(DISTINCT f.follower_id) > 0
         ORDER BY influence_score DESC
         LIMIT $1
      `, [parseInt(limit), timeWindow]);

      res.json({
        success: true,
        data: result.rows.map(row => ({
          userId: row.id,
          username: row.username,
          avatarUrl: row.avatar_url,
          bio: row.bio,
          metrics: {
            posts: parseInt(row.post_count),
            likesReceived: parseInt(row.total_likes_received),
            followers: parseInt(row.follower_count)
          }, // Fixed: Added missing comma
          influenceScore: parseFloat(row.influence_score || 0).toFixed(2)
        })), // Fixed: Added missing comma
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in TrendsController.getTrendingUsers:', error);
      res.status(500).json({
        success: false, message: 'Failed to get trending users', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/trends/refresh
   * Refresh trending calculations (admin/cron job)
   */
  async refreshTrends(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      // Update trending scores cache
      await pool.query(
        `INSERT INTO trending_cache (content_type, content_id, score, calculated_at)
         SELECT 
           'post' as content_type,
           p.id as content_id,
           (
             COUNT(DISTINCT l.id) * 1.0 +
             COUNT(DISTINCT c.id) * 2.0 +
             COUNT(DISTINCT s.id) * 3.0
           ) / NULLIF(EXTRACT(EPOCH FROM (NOW() - p.created_at)), 0) / 3600 as score, 
           NOW() as calculated_at
         FROM posts p
         LEFT JOIN likes l ON l.target_id = p.id AND l.target_type = 'post'
         LEFT JOIN comments c ON c.post_id = p.id
         LEFT JOIN shares s ON s.target_id = p.id AND s.target_type = 'post'
         WHERE p.created_at >= NOW() - INTERVAL '7 days'
         AND p.is_published = true
         GROUP BY p.id
         ON CONFLICT (content_type, content_id)
         DO UPDATE SET score = EXCLUDED.score, calculated_at = EXCLUDED.calculated_at`
      );

      res.json({
        success: true, message: 'Trends refreshed successfully'
      });
    } catch (error) {
      logger.error('Error in TrendsController.refreshTrends:', error);
      res.status(500).json({
        success: false, message: 'Failed to refresh trends', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new TrendsController();