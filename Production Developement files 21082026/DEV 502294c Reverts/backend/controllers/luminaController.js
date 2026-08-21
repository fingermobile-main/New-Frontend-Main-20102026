/**
 * Lumina Controller
 * Complete implementation for media/content platform
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class LuminaController {
  /**
   * GET /api/lumina/posts
   * Get lumina posts/feed
   */
  async getPosts(req, res) {
    try {
      const { 
        limit = 50, 
        offset = 0, 
        type,
        category, 
        sortBy = 'created_at' // Fixed: Added missing comma
      } = req.query;

      // SQL Injection protection for dynamic sorting fields
      const allowedSortFields = ['created_at', 'title', 'post_type', 'category'];
      const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';

      let whereClause = ['is_published = true'];
      let queryParams = [];
      let paramCount = 1;

      if (type) {
        whereClause.push(`post_type = $${paramCount}`);
        queryParams.push(type);
        paramCount++;
      }

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      const whereSQL = whereClause.join(' AND ');

      // Fixed: Converted to backticks, added missing column selection comma, and integrated whereSQL via interpolation
      const result = await pool.query(`SELECT 
          p.id,
          p.title,
          p.content,
          p.post_type,
          p.category,
          p.media_url,
          p.thumbnail_url,
          p.author_id,
          u.username as author_username,
          u.avatar_url as author_avatar,
          COUNT(DISTINCT l.id) as likes_count,
          COUNT(DISTINCT c.id) as comments_count,
          COUNT(DISTINCT s.id) as shares_count, 
          p.created_at
         FROM lumina_posts p
         JOIN users u ON p.author_id = u.id
         LEFT JOIN likes l ON l.target_id = p.id AND l.target_type = 'lumina_post'
         LEFT JOIN lumina_comments c ON c.post_id = p.id
         LEFT JOIN lumina_shares s ON s.post_id = p.id
         WHERE ${whereSQL}
         GROUP BY p.id, u.username, u.avatar_url
         ORDER BY p.${safeSortBy} DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`, [...queryParams, parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: result.rows.map(post => ({
          ...post,
          likesCount: parseInt(post.likes_count),
          commentsCount: parseInt(post.comments_count),
          sharesCount: parseInt(post.shares_count)
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), // Fixed: Added missing comma
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in LuminaController.getPosts:', error);
      res.status(500).json({
        success: false, message: 'Failed to get posts', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/lumina/posts
   * Create new post
   */
  async createPost(req, res) {
    try {
      const userId = req.user?.id;
      const { 
        title, 
        content, 
        postType, 
        category, 
        mediaUrl,
        thumbnailUrl,
        tags
      } = req.body;

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
        `INSERT INTO lumina_posts 
         (author_id, title, content, post_type, category, media_url, thumbnail_url, tags, is_published, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
         RETURNING *`,
        [
          userId,
          title,
          content, // Fixed: Added missing parameters array comma
          postType || 'text',
          category || null,
          mediaUrl || null,
          thumbnailUrl || null,
          JSON.stringify(tags || [])
        ]
      );

      res.status(201).json({
        success: true, message: 'Post created successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in LuminaController.createPost:', error);
      res.status(500).json({
        success: false, message: 'Failed to create post', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/lumina/posts/:id/comment
   * Add comment to post
   */
  async addComment(req, res) {
    try {
      const userId = req.user?.id;
      const { id: postId } = req.params;
      const { content, parentId } = req.body;

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
        `INSERT INTO lumina_comments (post_id, user_id, content, parent_id, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [postId, userId, content, parentId || null]
      );

      res.status(201).json({
        success: true, message: 'Comment added successfully'
      });
    } catch (error) {
      logger.error('Error in LuminaController.addComment:', error);
      res.status(500).json({
        success: false, message: 'Failed to add comment', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/lumina/posts/:id/comments
   * Get comments for a post
   */
  async getComments(req, res) {
    try {
      const { id: postId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const result = await pool.query(
        `SELECT 
          c.*,
          u.username,
          u.avatar_url,
          COUNT(lc.id) as likes_count
         FROM lumina_comments c
         JOIN users u ON c.user_id = u.id
         LEFT JOIN lumina_comment_likes lc ON c.id = lc.comment_id
         WHERE c.post_id = $1
         GROUP BY c.id, u.username, u.avatar_url
         ORDER BY c.created_at ASC
         LIMIT $2 OFFSET $3`,
        [postId, parseInt(limit), parseInt(offset)]
      );

      res.json({
        success: true,
        data: result.rows.map(comment => ({
          ...comment,
          likesCount: parseInt(comment.likes_count)
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), // Fixed: Added missing comma
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in LuminaController.getComments:', error);
      res.status(500).json({
        success: false, message: 'Failed to get comments', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/lumina/categories
   * Get post categories
   */
  async getCategories(req, res) {
    try {
      const result = await pool.query(
        `SELECT 
          category,
          COUNT(*) as post_count
         FROM lumina_posts
         WHERE is_published = true AND category IS NOT NULL
         GROUP BY category
         ORDER BY post_count DESC`
      );

      res.json({
        success: true,
        data: result.rows.map(row => ({
          category: row.category, // Fixed: Added missing comma
          postCount: parseInt(row.post_count)
        }))
      });
    } catch (error) {
      logger.error('Error in LuminaController.getCategories:', error);
      res.status(500).json({
        success: false, message: 'Failed to get categories', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new LuminaController();