/**
 * Universal UGC Save Controller
 * FingerMobile Protocol™
 * Handles content saving across platforms with privacy controls
 * Enforces member privacy control: allow_saving
 */

const db = require('../db');
const logger = require('../utils/logger');
const ugcPrivacyService = require('../services/ugcPrivacyService');

const getPool = () => db.pool || db;

class SaveController {
  constructor() {
    this.saveContent = this.saveContent.bind(this);
    this.unsaveContent = this.unsaveContent.bind(this);
    this.getUserSavedContent = this.getUserSavedContent.bind(this);
    this.getContentSavers = this.getContentSavers.bind(this);
    this.getUserSavedItems = this.getUserSavedContent;
  }

  /**
   * Save content
   * Enforces privacy control: allow_saving
   */
  async saveContent(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.user.id;

      // Check privacy permissions
      const hasPermission = await ugcPrivacyService.checkPermission(
        contentType,
        contentId,
        userId,
        'save'
      );

      if (!hasPermission || (typeof hasPermission === 'object' && hasPermission.allowed === false)) {
        return res.status(403).json({
          error: 'Save not allowed',
          code: 'SAVE_NOT_ALLOWED',
          message: typeof hasPermission === 'object' ? hasPermission.reason : 'Save not allowed'
        });
      }

      const pool = getPool();

      // Check if already saved
      const existingSave = await pool.query(`
        SELECT * FROM ugc_saved_content 
        WHERE user_id = ? AND content_type = ? AND content_id = ?
      `, [userId, contentType, contentId]);

      if (existingSave[0].length > 0) {
        return res.status(409).json({
          error: 'Content already saved',
          code: 'CONTENT_ALREADY_SAVED'
        });
      }

      // Save the content
      await pool.query(`
        INSERT INTO ugc_saved_content (user_id, content_type, content_id, saved_at)
        VALUES (?, ?, ?, NOW())
      `, [userId, contentType, contentId]);

      // Update content stats
      await this.updateContentSaveStats(contentType, contentId, 1);

      res.status(200).json({
        success: true,
        message: 'Content saved successfully'
      });
    } catch (error) {
      logger.error('Error saving content:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'SAVE_CONTENT_ERROR'
      });
    }
  }

  /**
   * Unsave content
   */
  async unsaveContent(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.user.id;

      const pool = getPool();

      // Remove the save
      const result = await pool.query(`
        DELETE FROM ugc_saved_content 
        WHERE user_id = ? AND content_type = ? AND content_id = ?
      `, [userId, contentType, contentId]);

      if (result[0].affectedRows === 0) {
        return res.status(404).json({
          error: 'Saved content not found',
          code: 'SAVED_CONTENT_NOT_FOUND'
        });
      }

      // Update content stats
      await this.updateContentSaveStats(contentType, contentId, -1);

      res.status(200).json({
        success: true,
        message: 'Content unsaved successfully'
      });
    } catch (error) {
      logger.error('Error unsaving content:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'UNSAVE_CONTENT_ERROR'
      });
    }
  }

  /**
   * Get user's saved content
   */
  async getUserSavedContent(req, res) {
    try {
      const userId = req.user.id;
      const { contentType, page = 1, limit = 20 } = req.query;

      const pool = getPool();

      let query = `
        SELECT sc.*, c.title as contentTitle, c.thumbnail_url as contentThumbnail, c.owner_id as contentOwnerId
        FROM ugc_saved_content sc
      `;

      // Dynamically join with the appropriate content table
      if (contentType) {
        const tableMap = {
          'post': 'ugc_posts',
          'image': 'ugc_images',
          'video': 'ugc_videos',
          'audio': 'ugc_audios',
          'document': 'ugc_documents',
          'link': 'ugc_links'
        };

        const tableName = tableMap[contentType] || 'ugc_generic_content';
        query += ` LEFT JOIN ${tableName} c ON sc.content_id = c.id `;
      } else {
        query += ' LEFT JOIN ugc_generic_content c ON sc.content_id = c.id ';
      }

      query += ' WHERE sc.user_id = ? ';

      const params = [userId];

      query += ' ORDER BY sc.saved_at DESC ';
      query += ' LIMIT ? OFFSET ? ';

      params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

      const results = await pool.query(query, params);

      res.status(200).json({
        success: true,
        savedContent: results[0]
      });
    } catch (error) {
      logger.error('Error getting user saved content:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_SAVED_CONTENT_ERROR'
      });
    }
  }

  /**
   * Get content savers
   */
  async getContentSavers(req, res) {
    try {
      const { contentType, contentId } = req.params;

      // Check privacy permissions
      const hasPermission = await ugcPrivacyService.checkPermission(
        contentType,
        contentId,
        req.user.id,
        'view'
      );

      if (!hasPermission) {
        return res.status(403).json({
          error: 'Access not allowed',
          code: 'ACCESS_DENIED'
        });
      }

      const pool = getPool();

      const savers = await pool.query(`
        SELECT u.id, u.username, u.display_name, u.avatar_url, sc.saved_at
        FROM ugc_saved_content sc
        JOIN Users u ON sc.user_id = u.id
        WHERE sc.content_type = ? AND sc.content_id = ?
        ORDER BY sc.saved_at DESC
      `, [contentType, contentId]);

      res.status(200).json({
        success: true,
        savers: savers[0]
      });
    } catch (error) {
      logger.error('Error getting content savers:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_CONTENT_SAVERS_ERROR'
      });
    }
  }

  // Helper methods
  async updateContentSaveStats(contentType, contentId, increment) {
    const pool = getPool();

    // Update save count in the appropriate content table
    const tableMap = {
      'post': 'ugc_posts',
      'image': 'ugc_images',
      'video': 'ugc_videos',
      'audio': 'ugc_audios',
      'document': 'ugc_documents',
      'link': 'ugc_links'
    };

    const tableName = tableMap[contentType] || 'ugc_generic_content';

    try {
      await pool.query(`
        UPDATE ${tableName}
        SET save_count = GREATEST(0, save_count + ?)
        WHERE id = ?
      `, [increment, contentId]);
    } catch (error) {
      // If the specific content table doesn't have save_count, update generic table
      try {
        await pool.query(`
          UPDATE ugc_generic_content
          SET save_count = GREATEST(0, save_count + ?)
          WHERE id = ?
        `, [increment, contentId]);
      } catch (e) {
        // Ignore errors if save_count column doesn't exist
        logger.warn('Could not update save count:', e.message);
      }
    }
  }
}

module.exports = new SaveController();
