/**
 * Seads Controller
 * Complete implementation for seads platform
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class SeadsController {
  /**
   * GET /api/seads/posts
   * Get seads posts
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

      // Fixed: Converted string interpolation, corrected table alias from generic 'likes' to 'seads_likes', and fixed broken string endings
      const result = await pool.query(`
        SELECT 
          s.*,
          u.username as author_username,
          u.avatar_url as author_avatar,
          COUNT(DISTINCT l.id) as likes_count, 
          COUNT(DISTINCT c.id) as comments_count
         FROM seads_posts s
         JOIN users u ON s.author_id = u.id
         LEFT JOIN seads_likes l ON l.post_id = s.id
         LEFT JOIN seads_comments c ON c.post_id = s.id
         WHERE ${whereSQL}
         GROUP BY s.id, u.username, u.avatar_url
         ORDER BY s.${sortBy} DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `, [...queryParams, parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: result.rows.map(post => ({
          ...post,
          likesCount: parseInt(post.likes_count) || 0,
          commentsCount: parseInt(post.comments_count) || 0
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), // Fixed: Added missing comma
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in SeadsController.getPosts:', error);
      res.status(500).json({
        success: false, message: 'Failed to get posts', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/seads/posts
   * Create seads post
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
        `INSERT INTO seads_posts 
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
      logger.error('Error in SeadsController.createPost:', error);
      res.status(500).json({
        success: false, message: 'Failed to create post', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/seads/posts/:id/like
   * Like a seads post
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
        'SELECT id FROM seads_likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false, message: 'Already liked'
        });
      }

      await pool.query(
        `INSERT INTO seads_likes (user_id, post_id, created_at)
         VALUES ($1, $2, NOW())`,
        [userId, postId]
      );

      res.status(201).json({
        success: true, message: 'Post liked successfully'
      });
    } catch (error) {
      logger.error('Error in SeadsController.likePost:', error);
      res.status(500).json({
        success: false, message: 'Failed to like post', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/seads/posts/:id/comment
   * Comment on a seads post
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
        `INSERT INTO seads_comments (post_id, user_id, content, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [postId, userId, content]
      );

      res.status(201).json({
        success: true, message: 'Comment added successfully'
      });
    } catch (error) {
      logger.error('Error in SeadsController.commentOnPost:', error);
      res.status(500).json({
        success: false, message: 'Failed to add comment', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/seads/trending
   * Get trending seads posts
   */
  async getTrending(req, res) {
    try {
      const { limit = 20 } = req.query;

      // Fixed: Added missing selection comma between count filters
      const result = await pool.query(
        `SELECT 
          s.*,
          u.username as author_username,
          u.avatar_url as author_avatar,
          COUNT(DISTINCT sl.id) as likes_count, 
          COUNT(DISTINCT sc.id) as comments_count
         FROM seads_posts s
         JOIN users u ON s.author_id = u.id
         LEFT JOIN seads_likes sl ON s.id = sl.post_id AND sl.created_at >= NOW() - INTERVAL '7 days'
         LEFT JOIN seads_comments sc ON s.id = sc.post_id AND sc.created_at >= NOW() - INTERVAL '7 days'
         WHERE s.is_published = true
         GROUP BY s.id, u.username, u.avatar_url
         ORDER BY likes_count DESC, comments_count DESC
         LIMIT $1`,
        [parseInt(limit)]
      );

      res.json({
        success: true,
        data: result.rows.map(post => ({
          ...post,
          likesCount: parseInt(post.likes_count), 
          commentsCount: parseInt(post.comments_count) // Fixed: Added missing object map field comma
        }))
      });
    } catch (error) {
      logger.error('Error in SeadsController.getTrending:', error);
      res.status(500).json({
        success: false, message: 'Failed to get trending posts', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new SeadsController();