/**
 * General Controller
 * Complete implementation for general platform endpoints
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class GeneralController {
  /**
   * GET /api/general/health
   * Health check endpoint
   */
  async healthCheck(req, res) {
    try {
      await pool.query('SELECT NOW() as timestamp');

      res.json({
        success: true, data: {
          status: 'healthy',
          timestamp: new Date().toISOString(), database: 'connected', uptime: process.uptime()
        }
      });
    } catch (error) {
      logger.error('Error in GeneralController.healthCheck:', error);
      res.status(500).json({
        success: false, message: 'Service unhealthy', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/general/stats
   * Get platform statistics
   */
  async getPlatformStats(req, res) {
    try {
      const stats = await pool.query(` SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM posts WHERE is_published = true) as total_posts,
          (SELECT COUNT(*) FROM comments) as total_comments,
          (SELECT COUNT(*) FROM likes) as total_likes,
          (SELECT COUNT(*) FROM followers) as total_followers
      `);

      res.json({
        success: true,
        data: {
          totalUsers: parseInt(stats.rows[0].total_users) || 0,
          totalPosts: parseInt(stats.rows[0].total_posts) || 0,
          totalComments: parseInt(stats.rows[0].total_comments) || 0,
          totalLikes: parseInt(stats.rows[0].total_likes) || 0, totalFollowers: parseInt(stats.rows[0].total_followers) || 0
        }
      });
    } catch (error) {
      logger.error('Error in GeneralController.getPlatformStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to get statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/general/config
   * Get platform configuration
   */
  async getConfig(req, res) {
    try {
      // In production, fetch from config table or environment variables
      const config = {
        platformName: 'FingerMobile Protocol', version: '1.0.0',
        features: {
          registration: true,
          socialLogin: true,
          twoFactorAuth: true,
          biometricAuth: true,
          gamification: true,
          elearning: true,
          ecommerce: true,
          mediaUpload: true,
          videoEditing: true,
          voiceFeatures: true
        }, limits: {
          maxUploadSize: '10MB',
          maxPostLength: 5000,
          maxCommentLength: 1000
        }
      };

      res.json({
        success: true, data: config
      });
    } catch (error) {
      logger.error('Error in GeneralController.getConfig:', error);
      res.status(500).json({
        success: false, message: 'Failed to get configuration', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/general/search
   * Global search across platform
   */
  async search(req, res) {
    try {
      const { query, type, limit = 20 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false, message: 'Search query is required'
        });
      }

      let results = [];

      // Search users
      if (!type || type === 'users') {
        const users = await pool.query(
          `SELECT id, username, avatar_url, bio, 'user' as type
           FROM users
           WHERE username ILIKE $1 OR bio ILIKE $1
           LIMIT $2` [`%${query}%`, parseInt(limit)]
        );
        results = [...results, ...users.rows];
      }

      // Search posts
      if (!type || type === 'posts') {
        const posts = await pool.query(
          `SELECT p.id, p.title, p.content, u.username as author, 'post' as type
           FROM posts p
           JOIN users u ON p.author_id = u.id
           WHERE p.title ILIKE $1 OR p.content ILIKE $1
           AND p.is_published = true
           LIMIT $2`,
          [`%${query}%`, parseInt(limit)]
        );
        results = [...results, ...posts.rows];
      }

      res.json({
        success: true,
        data: {
          query,
          results, count: results.length
        }
      });
    } catch (error) {
      logger.error('Error in GeneralController.search:', error);
      res.status(500).json({
        success: false, message: 'Failed to search', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/general/feedback
   * Submit user feedback
   */
  async submitFeedback(req, res) {
    try {
      const userId = req.user?.id;
      const { type, subject, message, rating } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!type || !message) {
        return res.status(400).json({
          success: false, message: 'Type and message are required'
        });
      }

      await pool.query(
        `INSERT INTO feedback (user_id, type, subject, message, rating, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [userId, type, subject || null, message, rating || null]
      );

      res.status(201).json({
        success: true, message: 'Feedback submitted successfully'
      });
    } catch (error) {
      logger.error('Error in GeneralController.submitFeedback:', error);
      res.status(500).json({
        success: false, message: 'Failed to submit feedback', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  async getAll(req, res) { res.json([]); }
}

module.exports = new GeneralController();
