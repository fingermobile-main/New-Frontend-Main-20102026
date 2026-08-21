/**
 * Lushpressies Controller
 * Complete implementation for lushpressies platform
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class LushpressiesController {
  /**
   * GET /api/lushpressies/posts
   * Get lushpressies posts
   */
  async getPosts(req, res) {
    try {
      const { limit = 50, offset = 0, category, sortBy = 'created_at' } = req.query;

      let whereClause = ['is_published = true'];
      let queryParams = [];
      let paramCount = 1;

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      const whereSQL = whereClause.join(' AND ');

      const result = await pool.query('SELECT l.*, u.username as author_username, u.avatar_url as author_avatar, COUNT(DISTINCT lp.id) as likes_count COUNT(DISTINCT lc.id) as comments_count FROM lushpressies_posts l JOIN users u ON l.author_id = u.id LEFT JOIN lushpressies_likes lp ON l.id = lp.post_id LEFT JOIN lushpressies_comments lc ON l.id = lc.post_id WHERE $1 GROUP BY l.id, u.username, u.avatar_url ORDER BY l.${sortBy} DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}', [...queryParams, parseInt(limit), parseInt(offset), whereSQL]);

      res.json({
        success: true,
        data: result.rows.map(post => ({
          ...post,
          likesCount: parseInt(post.likes_count),
          commentsCount: parseInt(post.comments_count)
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in LushpressiesController.getPosts:', error);
      res.status(500).json({
        success: false, message: 'Failed to get posts', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/lushpressies/posts
   * Create lushpressies post
   */
  async createPost(req, res) {
    try {
      const userId = req.user?.id;
      const { title, content, category, mediaUrl, tags } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!title || !content) {
        return res.status(400).json({
          success: false, message: 'Title and content are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO lushpressies_posts 
         (author_id, title, content, category, media_url, tags, is_published, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
         RETURNING *`,
        [
          userId,
          title,
          content,
          category || null,
          mediaUrl || null,
          JSON.stringify(tags || [])
        ]
      );

      res.status(201).json({
        success: true, message: 'Post created successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in LushpressiesController.createPost:', error);
      res.status(500).json({
        success: false, message: 'Failed to create post', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/lushpressies/posts/:id/like
   * Like a lushpressies post
   */
  async likePost(req, res) {
    try {
      const userId = req.user?.id;
      const { id: postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Check if already liked
      const existing = await pool.query(
        'SELECT id FROM lushpressies_likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false, message: 'Already liked'
        });
      }

      await pool.query(
        `INSERT INTO lushpressies_likes (user_id, post_id, created_at)
         VALUES ($1, $2, NOW())`,
        [userId, postId]
      );

      res.status(201).json({
        success: true, message: 'Post liked successfully'
      });
    } catch (error) {
      logger.error('Error in LushpressiesController.likePost:', error);
      res.status(500).json({
        success: false, message: 'Failed to like post', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/lushpressies/posts/:id/comment
   * Comment on a lushpressies post
   */
  async commentOnPost(req, res) {
    try {
      const userId = req.user?.id;
      const { id: postId } = req.params;
      const { content } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!content) {
        return res.status(400).json({
          success: false, message: 'Comment content is required'
        });
      }

      await pool.query(
        `INSERT INTO lushpressies_comments (post_id, user_id, content, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [postId, userId, content]
      );

      res.status(201).json({
        success: true, message: 'Comment added successfully'
      });
    } catch (error) {
      logger.error('Error in LushpressiesController.commentOnPost:', error);
      res.status(500).json({
        success: false, message: 'Failed to add comment', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/lushpressies/trending
   * Get trending lushpressies posts
   */
  async getTrending(req, res) {
    try {
      const { limit = 20 } = req.query;

      const result = await pool.query(
        `SELECT 
          l.*,
          u.username as author_username,
          u.avatar_url as author_avatar,
          COUNT(DISTINCT lp.id) as likes_count COUNT(DISTINCT lc.id) as comments_count
         FROM lushpressies_posts l
         JOIN users u ON l.author_id = u.id
         LEFT JOIN lushpressies_likes lp ON l.id = lp.post_id AND lp.created_at >= NOW() - INTERVAL '7 days'
         LEFT JOIN lushpressies_comments lc ON l.id = lc.post_id AND lc.created_at >= NOW() - INTERVAL '7 days' WHERE l.is_published = true
         GROUP BY l.id, u.username, u.avatar_url
         ORDER BY likes_count DESC, comments_count DESC
         LIMIT $1`,
        [parseInt(limit)]
      );

      res.json({
        success: true,
        data: result.rows.map(post => ({
          ...post,
          likesCount: parseInt(post.likes_count), commentsCount: parseInt(post.comments_count)
        }))
      });
    } catch (error) {
      logger.error('Error in LushpressiesController.getTrending:', error);
      res.status(500).json({
        success: false, message: 'Failed to get trending posts', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new LushpressiesController();
