/**
 * Voice Feed Controller
 * Complete implementation for voice/audio feed platform
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class VoiceFeedController {
  /**
   * GET /api/voicefeed/posts
   * Get voice posts/feed
   */
  async getPosts(req, res) {
    try {
      const { limit = 50, offset = 0, category, sortBy = 'created_at' } = req.query;

      let whereClause = ['v.is_published = true'];
      let queryParams = [];
      let paramCount = 1;

      if (category) {
        whereClause.push(`v.category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      const whereSQL = whereClause.join(' AND ');
      const validSort = ['created_at', 'duration_seconds', 'title'].includes(sortBy) ? sortBy : 'created_at';

      const result = await pool.query(`SELECT 
          v.*,
          u.username as author_username,
          u.avatar_url as author_avatar,
          COUNT(DISTINCT l.id) as likes_count,
          COUNT(DISTINCT c.id) as comments_count, 
          COUNT(DISTINCT p.id) as plays_count
         FROM voicefeed_posts v
         JOIN users u ON v.author_id = u.id
         LEFT JOIN voicefeed_likes l ON l.post_id = v.id
         LEFT JOIN voicefeed_comments c ON c.post_id = v.id
         LEFT JOIN voicefeed_plays p ON p.post_id = v.id
         WHERE ${whereSQL}
         GROUP BY v.id, u.username, u.avatar_url
         ORDER BY v.${validSort} DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`, [...queryParams, parseInt(limit, 10), parseInt(offset, 10)]);

      res.json({
        success: true,
        data: result.rows.map(post => ({
          ...post,
          durationSeconds: parseInt(post.duration_seconds),
          likesCount: parseInt(post.likes_count),
          commentsCount: parseInt(post.comments_count),
          playsCount: parseInt(post.plays_count)
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in VoiceFeedController.getPosts:', error);
      res.status(500).json({
        success: false, message: 'Failed to get voice posts', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/voicefeed/posts
   * Create voice post
   */
  async createPost(req, res) {
    try {
      const userId = req.user?.id;
      const { title, audioUrl, durationSeconds, category, tags } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!title || !audioUrl) {
        return res.status(400).json({
          success: false, message: 'Title and audio URL are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO voicefeed_posts 
         (author_id, title, audio_url, duration_seconds, category, tags, is_published, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
         RETURNING *`,
        [
          userId,
          title,
          audioUrl,
          durationSeconds ? parseInt(durationSeconds) : null,
          category || null,
          JSON.stringify(tags || [])
        ]
      );

      res.status(201).json({
        success: true, message: 'Voice post created successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in VoiceFeedController.createPost:', error);
      res.status(500).json({
        success: false, message: 'Failed to create voice post', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/voicefeed/posts/:id/play
   * Record voice post play
   */
  async recordPlay(req, res) {
    try {
      const userId = req.user?.id;
      const { id: postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      await pool.query(
        `INSERT INTO voicefeed_plays (user_id, post_id, played_at)
         VALUES ($1, $2, NOW())`,
        [userId, postId]
      );

      res.json({
        success: true, message: 'Play recorded'
      });
    } catch (error) {
      logger.error('Error in VoiceFeedController.recordPlay:', error);
      res.status(500).json({
        success: false, message: 'Failed to record play', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/voicefeed/trending
   * Get trending voice posts
   */
  async getTrending(req, res) {
    try {
      const { limit = 20, timeframe = '7d' } = req.query;

      let timeFilter = '';
      if (timeframe === '24h') {
        timeFilter = 'AND vp.played_at >= NOW() - INTERVAL \'24 hours\'';
      } else if (timeframe === '7d') {
        timeFilter = 'AND vp.played_at >= NOW() - INTERVAL \'7 days\'';
      }

      const result = await pool.query(`SELECT 
          v.*,
          u.username as author_username,
          u.avatar_url as author_avatar,
          COUNT(DISTINCT vp.id) as plays_count, 
          COUNT(DISTINCT l.id) as likes_count
         FROM voicefeed_posts v
         JOIN users u ON v.author_id = u.id
         LEFT JOIN voicefeed_plays vp ON v.id = vp.post_id ${timeFilter}
         LEFT JOIN voicefeed_likes l ON l.post_id = v.id WHERE v.is_published = true
         GROUP BY v.id, u.username, u.avatar_url
         ORDER BY plays_count DESC
         LIMIT $1`, [parseInt(limit)]);

      res.json({
        success: true,
        data: result.rows.map(post => ({
          ...post,
          durationSeconds: parseInt(post.duration_seconds),
          playsCount: parseInt(post.plays_count), likesCount: parseInt(post.likes_count)
        }))
      });
    } catch (error) {
      logger.error('Error in VoiceFeedController.getTrending:', error);
      res.status(500).json({
        success: false, message: 'Failed to get trending posts', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new VoiceFeedController();
