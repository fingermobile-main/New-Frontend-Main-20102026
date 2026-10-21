/* eslint-disable no-unused-vars */
const logger = require('../utils/logger');
const db = require('../database/connection');

class WidgetDataService {
  /**
   * Get widget data by type and configuration
   */
  async getWidgetData(widgetType, config = {}) {
    try {
      const cacheKey = `widget:${widgetType}:${JSON.stringify(config)}`;

      // Check cache first (if Redis available)
      // const cached = await this.redisClient.get(cacheKey);
      // if (cached) return JSON.parse(cached);

      let data = [];

      switch (widgetType) {
      case 'trending_posts':
        data = await this.getTrendingPosts(config.limit || 10);
        break;
      case 'recent_activity':
        data = await this.getRecentActivity(config.userId, config.limit || 5);
        break;
      case 'popular_communities':
        data = await this.getPopularCommunities(config.limit || 8);
        break;
      case 'featured_content':
        data = await this.getFeaturedContent(config.category, config.limit || 6);
        break;
      case 'user_stats':
        data = await this.getUserStats(config.userId);
        break;
      default:
        throw new Error(`Unknown widget type: ${widgetType}`);
      }

      // Cache result for 5 minutes
      // await this.redisClient.setex(cacheKey, 300, JSON.stringify(data));

      return data;
    } catch (error) {
      logger.error('Error getting widget data:', error);
      throw error;
    }
  }

  /**
   * Get trending posts based on engagement
   */
  async getTrendingPosts(limit = 10) {
    const result = await db.query(`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.author_id,
        u.username as author_name,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count,
        p.created_at
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      WHERE p.created_at >= NOW() - INTERVAL '7 days'
      GROUP BY p.id, u.username
      ORDER BY (likes_count + comments_count * 2) DESC
      LIMIT $1
    `, [limit]);

    return result.rows;
  }

  /**
   * Get recent activity for a user
   */
  async getRecentActivity(userId, limit = 5) {
    if (!userId) return [];

    const result = await db.query(`
      SELECT 
        'post' as type,
        p.id,
        p.title,
        p.created_at
      FROM posts p
      WHERE p.author_id = $1
      UNION ALL
      SELECT 
        'comment' as type,
        c.id,
        c.content as title,
        c.created_at
      FROM comments c
      WHERE c.user_id = $1
      UNION ALL
      SELECT 
        'like' as type,
        l.id,
        'Liked a post' as title,
        l.created_at
      FROM likes l
      WHERE l.user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [userId, limit]);

    return result.rows;
  }

  /**
   * Get popular communities
   */
  async getPopularCommunities(limit = 8) {
    const result = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.member_count,
        c.created_at
      FROM communities c
      ORDER BY c.member_count DESC
      LIMIT $1
    `, [limit]);

    return result.rows;
  }

  /**
   * Get featured content by category
   */
  async getFeaturedContent(category, limit = 6) {
    let query = `
      SELECT 
        p.id,
        p.title,
        p.content,
        p.featured_image,
        u.username as author_name,
        p.created_at
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.is_featured = true
    `;

    const values = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND p.category = $${paramIndex}`;
      values.push(category);
      paramIndex++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex}`;
    values.push(limit);

    const result = await db.query(query, values);
    return result.rows;
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    if (!userId) return null;

    const stats = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM posts WHERE author_id = $1) as total_posts,
        (SELECT COUNT(*) FROM comments WHERE user_id = $1) as total_comments,
        (SELECT COUNT(*) FROM likes WHERE user_id = $1) as total_likes_given,
        (SELECT COUNT(*) FROM likes l JOIN posts p ON l.post_id = p.id WHERE p.author_id = $1) as total_likes_received,
        (SELECT COUNT(*) FROM community_members WHERE user_id = $1) as communities_joined
    `, [userId]);

    return stats.rows[0];
  }

  /**
   * Invalidate widget cache
   */
  async invalidateCache(widgetType) {
    try {
      // const pattern = `widget:${widgetType}:*`;
      // const keys = await this.redisClient.keys(pattern);
      // if (keys.length > 0) {
      //   await this.redisClient.del(...keys);
      // }
      logger.info(`Cache invalidated for widget type: ${widgetType}`);
    } catch (error) {
      logger.error('Error invalidating widget cache:', error);
    }
  }
}

module.exports = new WidgetDataService();
