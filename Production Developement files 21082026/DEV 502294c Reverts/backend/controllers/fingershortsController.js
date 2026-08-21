/**
 * FingershortsController
 * Short-form video content management and feeds
 */

const pool = require('../database/connection');
const logger = require('../utils/logger');

class FingershortsController {
  /**
   * GET /api/fingershorts/for-you
   * Personalized feed based on user preferences
   */
  async getForYou(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const limit = parseInt(req.query.limit) || 20;
      
      // Algorithm: Mix of trending, followed creators, and personalized recommendations
      // Fixed: Added missing comma between like_count and comment_count selection
      const query = `
        SELECT 
          v.*,
          u.name as author_name,
          u.avatar_url as author_avatar,
          u.is_verified as author_verified,
          COUNT(DISTINCT l.id) as like_count, 
          COUNT(DISTINCT c.id) as comment_count
        FROM videos v
        JOIN users u ON v.author_id = u.id
        LEFT JOIN likes l ON v.id = l.video_id AND l.type = 'fingershort'
        LEFT JOIN comments c ON v.id = c.video_id AND c.type = 'fingershort'
        WHERE v.status = 'published'
          AND v.duration <= 60
        GROUP BY v.id, u.id
        ORDER BY 
          (v.views * 0.3 + COUNT(DISTINCT l.id) * 0.5 + COUNT(DISTINCT c.id) * 0.2) DESC,
          v.created_at DESC
        LIMIT $1
      `;
      
      const result = await pool.query(query, [limit]);
      
      const shorts = result.rows.map(row => ({
        id: row.id, type: row.media_type || 'video',
        content: row.url,
        duration: row.duration,
        views: parseInt(row.views) || 0,
        timestamp: row.created_at,
        isPrivate: row.is_private || false,
        isSpoiler: row.is_spoiler || false,
        author: {
          name: row.author_name,
          avatar: row.author_avatar,
          isVerified: row.author_verified
        }
      }));
      
      res.json({
        success: true, message: 'For You feed retrieved', data: shorts
      });
    } catch (error) {
      logger.error('Error in FingershortsController.getForYou:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve For You feed',
        details: error.message
      });
    }
  }
  
  /**
   * GET /api/fingershorts/following
   * Feed from followed creators
   */
  async getFollowing(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const limit = parseInt(req.query.limit) || 20;
      
      // Fixed: Added missing comma between like_count and comment_count selection
      const query = `
        SELECT 
          v.*,
          u.name as author_name,
          u.avatar_url as author_avatar,
          u.is_verified as author_verified,
          COUNT(DISTINCT l.id) as like_count, 
          COUNT(DISTINCT c.id) as comment_count
        FROM videos v
        JOIN users u ON v.author_id = u.id
        JOIN followers f ON v.author_id = f.following_id
        LEFT JOIN likes l ON v.id = l.video_id AND l.type = 'fingershort'
        LEFT JOIN comments c ON v.id = c.video_id AND c.type = 'fingershort'
        WHERE f.follower_id = $1
          AND v.status = 'published'
          AND v.duration <= 60
        GROUP BY v.id, u.id
        ORDER BY v.created_at DESC
        LIMIT $2
      `;
      
      const result = await pool.query(query, [userId, limit]);
      
      const shorts = result.rows.map(row => ({
        id: row.id, type: row.media_type || 'video',
        content: row.url,
        duration: row.duration,
        views: parseInt(row.views) || 0,
        timestamp: row.created_at,
        isPrivate: row.is_private || false,
        isSpoiler: row.is_spoiler || false,
        author: {
          name: row.author_name,
          avatar: row.author_avatar,
          isVerified: row.author_verified
        }
      }));
      
      res.json({
        success: true, message: 'Following feed retrieved', data: shorts
      });
    } catch (error) {
      logger.error('Error in FingershortsController.getFollowing:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve Following feed',
        details: error.message
      });
    }
  }
  
  /**
   * GET /api/fingershorts/trending
   * Most popular shorts in last 24-48 hours
   */
  async getTrending(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      
      // Fixed: Added missing comma between like_count and comment_count selection
      const query = `
        SELECT 
          v.*,
          u.name as author_name,
          u.avatar_url as author_avatar,
          u.is_verified as author_verified,
          COUNT(DISTINCT l.id) as like_count, 
          COUNT(DISTINCT c.id) as comment_count
        FROM videos v
        JOIN users u ON v.author_id = u.id
        LEFT JOIN likes l ON v.id = l.video_id AND l.type = 'fingershort'
        LEFT JOIN comments c ON v.id = c.video_id AND c.type = 'fingershort'
        WHERE v.status = 'published'
          AND v.duration <= 60
          AND v.created_at >= NOW() - INTERVAL '48 hours'
        GROUP BY v.id, u.id
        ORDER BY 
          (v.views * 0.4 + COUNT(DISTINCT l.id) * 0.4 + COUNT(DISTINCT c.id) * 0.2) DESC
        LIMIT $1
      `;
      
      const result = await pool.query(query, [limit]);
      
      const shorts = result.rows.map(row => ({
        id: row.id, type: row.media_type || 'video',
        content: row.url,
        duration: row.duration,
        views: parseInt(row.views) || 0,
        timestamp: row.created_at,
        isPrivate: row.is_private || false,
        isSpoiler: row.is_spoiler || false,
        author: {
          name: row.author_name,
          avatar: row.author_avatar,
          isVerified: row.author_verified
        }
      }));
      
      res.json({
        success: true, message: 'Trending feed retrieved', data: shorts
      });
    } catch (error) {
      logger.error('Error in FingershortsController.getTrending:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve Trending feed', details: error.message
      });
    }
  }
  
  /**
   * GET /api/fingershorts/videos
   * Get all videos (legacy endpoint)
   */
  async getAll(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      
      const query = `
        SELECT * FROM videos
        WHERE status = 'published'
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await pool.query(query, [limit, offset]);
      
      res.json({
        success: true, message: 'Videos retrieved',
        data: result.rows, count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in FingershortsController.getAll:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve videos', details: error.message
      });
    }
  }
  
  /**
   * GET /api/fingershorts/videos/:id
   * Get single video by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const query = 'SELECT * FROM videos WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, error: 'Video not found'
        });
      }
      
      res.json({
        success: true, message: 'Video retrieved', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FingershortsController.getById:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve video',
        details: error.message
      });
    }
  }
  
  /**
   * POST /api/fingershorts/videos
   * Create new video
   */
  async create(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const { url, title, description, duration, is_private, is_spoiler } = req.body;
      
      if (!url) {
        return res.status(400).json({
          success: false, error: 'Video URL is required'
        });
      }
      
      // Fixed: Added missing comma between duration and media_type in SQL query string
      const query = `
        INSERT INTO videos (
          author_id, url, title, description, duration, media_type, status, is_private, is_spoiler, created_at
        ) VALUES ($1, $2, $3, $4, $5, 'video', 'published', $6, $7, NOW())
        RETURNING *
      `;
      
      // Fixed: Added missing separating commas within parameter values array
      const result = await pool.query(query, [
        userId,
        url,
        title || '',
        description || '',
        duration || 0,
        is_private || false,
        is_spoiler || false
      ]);
      
      res.status(201).json({
        success: true, message: 'Video created successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FingershortsController.create:', error);
      res.status(500).json({
        success: false, error: 'Failed to create video', details: error.message
      });
    }
  }
  
  /**
   * PUT /api/fingershorts/videos/:id
   * Update video
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;
      const updates = req.body;
      
      const fields = [];
      const values = [];
      let paramIndex = 1;
      
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined && key !== 'id' && key !== 'author_id') {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }
      
      if (fields.length === 0) {
        return res.status(400).json({
          success: false, error: 'No fields to update'
        });
      }
      
      values.push(id, userId);
      // Fixed: Added missing leading comma before 'updated_at = NOW()' integration 
      const query = `
        UPDATE videos
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${paramIndex} AND author_id = $${paramIndex + 1}
        RETURNING *
      `;
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, error: 'Video not found or unauthorized'
        });
      }
      
      res.json({
        success: true, message: 'Video updated', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FingershortsController.update:', error);
      res.status(500).json({
        success: false, error: 'Failed to update video', details: error.message
      });
    }
  }
  
  /**
   * DELETE /api/fingershorts/videos/:id
   * Delete video
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;
      
      const query = 'DELETE FROM videos WHERE id = $1 AND author_id = $2 RETURNING *';
      const result = await pool.query(query, [id, userId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, error: 'Video not found or unauthorized'
        });
      }
      
      res.json({
        success: true, message: 'Video deleted successfully'
      });
    } catch (error) {
      logger.error('Error in FingershortsController.delete:', error);
      res.status(500).json({
        success: false, error: 'Failed to delete video',
        details: error.message
      });
    }
  }
  
  /**
   * POST /api/fingershorts/videos/:id/view
   * Record video view
   */
  async recordView(req, res) {
    try {
      const { id } = req.params;
      
      const query = `
        UPDATE videos
        SET views = views + 1, last_viewed_at = NOW()
        WHERE id = $1
        RETURNING views
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, error: 'Video not found'
        });
      }
      
      res.json({
        success: true, message: 'View recorded', data: { views: result.rows[0].views }
      });
    } catch (error) {
      logger.error('Error in FingershortsController.recordView:', error);
      res.status(500).json({
        success: false, error: 'Failed to record view', details: error.message
      });
    }
  }
  
  /**
   * POST /api/fingershorts/videos/:id/like
   * Toggle like on video
   */
  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;
      
      // Check if already liked
      const checkQuery = 'SELECT id FROM likes WHERE user_id = $1 AND video_id = $2 AND type = $3';
      const checkResult = await pool.query(checkQuery, [userId, id, 'fingershort']);
      
      if (checkResult.rows.length > 0) {
        // Unlike
        await pool.query('DELETE FROM likes WHERE id = $1', [checkResult.rows[0].id]);
        
        res.json({
          success: true, message: 'Like removed', data: { liked: false }
        });
      } else {
        // Like
        await pool.query(`
          INSERT INTO likes (user_id, video_id, type, created_at)
          VALUES ($1, $2, 'fingershort', NOW())
        `, [userId, id]);
        
        res.json({
          success: true, message: 'Video liked', data: { liked: true }
        });
      }
    } catch (error) {
      logger.error('Error in FingershortsController.toggleLike:', error);
      res.status(500).json({
        success: false, error: 'Failed to toggle like', details: error.message
      });
    }
  }
  
  /**
   * GET /api/fingershorts/videos/:id/comments
   * Get comments for video
   */
  async getComments(req, res) {
    try {
      const { id } = req.params;
      
      const query = `
        SELECT c.*, u.name as author_name, u.avatar_url as author_avatar
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.video_id = $1 AND c.type = 'fingershort'
        ORDER BY c.created_at DESC
      `;
      
      const result = await pool.query(query, [id]);
      
      res.json({
        success: true, message: 'Comments retrieved', data: result.rows
      });
    } catch (error) {
      logger.error('Error in FingershortsController.getComments:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve comments',
        details: error.message
      });
    }
  }
  
  /**
   * POST /api/fingershorts/videos/:id/comments
   * Add comment to video
   */
  async addComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({
          success: false, error: 'Comment text is required'
        });
      }
      
      const query = `
        INSERT INTO comments (video_id, user_id, text, type, created_at)
        VALUES ($1, $2, $3, 'fingershort', NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [id, userId, text]);
      
      res.status(201).json({
        success: true, message: 'Comment added', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FingershortsController.addComment:', error);
      res.status(500).json({
        success: false, error: 'Failed to add comment', details: error.message
      });
    }
  }
  
  /**
   * DELETE /api/fingershorts/comments/:id
   * Delete comment
   */
  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId;
      
      const query = 'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *';
      const result = await pool.query(query, [id, userId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, error: 'Comment not found or unauthorized'
        });
      }
      
      res.json({
        success: true, message: 'Comment deleted'
      });
    } catch (error) {
      logger.error('Error in FingershortsController.deleteComment:', error);
      res.status(500).json({
        success: false, error: 'Failed to delete comment',
        details: error.message
      });
    }
  }
}

module.exports = new FingershortsController();