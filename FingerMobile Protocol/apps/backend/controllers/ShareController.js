/**
 * Universal UGC Share Controller
 * FingerMobile Protocol™
 * Handles content sharing across platforms with privacy controls
 * Enforces member privacy control: allow_sharing
 */

const db = require('../db');
const logger = require('../utils/logger');
const ugcPrivacyService = require('../services/ugcPrivacyService');

const getPool = () => db.pool || db;

class ShareController {
  constructor() {
    this.shareContent = this.shareContent.bind(this);
    this.getContentShares = this.getContentShares.bind(this);
    this.getUserSharedContent = this.getUserSharedContent.bind(this);
    this.getContentSharers = this.getContentSharers.bind(this);
    this.getShareStats = this.getContentShares;
    this.generateShareLink = this.shareContent;
  }

  /**
   * Share content
   * Enforces privacy control: allow_sharing
   */
  async shareContent(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.user.id;
      const { platform = 'universal', shareMessage = '' } = req.body;

      // Check privacy permissions
      const hasPermission = await ugcPrivacyService.checkPermission(
        contentType,
        contentId,
        userId,
        'share'
      );

      if (!hasPermission || (typeof hasPermission === 'object' && hasPermission.allowed === false)) {
        return res.status(403).json({
          error: 'Share not allowed',
          code: 'SHARE_NOT_ALLOWED',
          message: typeof hasPermission === 'object' ? hasPermission.reason : 'Share not allowed'
        });
      }

      const pool = getPool();

      // Record the share
      await pool.query(`
        INSERT INTO ugc_shares (user_id, content_type, content_id, platform, share_message, shared_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `, [userId, contentType, contentId, platform, shareMessage]);

      // Update content stats
      await this.updateContentShareStats(contentType, contentId, 1);

      res.status(200).json({
        success: true,
        message: 'Content shared successfully'
      });
    } catch (error) {
      logger.error('Error sharing content:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'SHARE_CONTENT_ERROR'
      });
    }
  }

  /**
   * Get content shares
   */
  async getContentShares(req, res) {
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

      const result = await pool.query(`
        SELECT COUNT(*) as totalShares
        FROM ugc_shares
        WHERE content_type = ? AND content_id = ?
      `, [contentType, contentId]);

      res.status(200).json({
        success: true,
        totalShares: result[0][0]?.totalShares || 0
      });
    } catch (error) {
      logger.error('Error getting content shares:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_CONTENT_SHARES_ERROR'
      });
    }
  }

  /**
   * Get user's shared content
   */
  async getUserSharedContent(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;

      const pool = getPool();

      const sharedContent = await pool.query(`
        SELECT s.*, c.title as contentTitle, c.thumbnail_url as contentThumbnail, c.owner_id as contentOwnerId
        FROM ugc_shares s
        LEFT JOIN ugc_generic_content c ON s.content_id = c.id
        WHERE s.user_id = ?
        ORDER BY s.shared_at DESC
        LIMIT ? OFFSET ?
      `, [userId, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);

      res.status(200).json({
        success: true,
        sharedContent: sharedContent[0]
      });
    } catch (error) {
      logger.error('Error getting user shared content:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_USER_SHARED_CONTENT_ERROR'
      });
    }
  }

  /**
   * Get content sharers
   */
  async getContentSharers(req, res) {
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

      const sharers = await pool.query(`
        SELECT u.id, u.username, u.display_name, u.avatar_url, s.shared_at, s.platform
        FROM ugc_shares s
        JOIN Users u ON s.user_id = u.id
        WHERE s.content_type = ? AND s.content_id = ?
        ORDER BY s.shared_at DESC
      `, [contentType, contentId]);

      res.status(200).json({
        success: true,
        sharers: sharers[0]
      });
    } catch (error) {
      logger.error('Error getting content sharers:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_CONTENT_SHARERS_ERROR'
      });
    }
  }

  // Helper methods
  async updateContentShareStats(contentType, contentId, increment) {
    const pool = getPool();

    // Update share count in the appropriate content table
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
        SET share_count = GREATEST(0, share_count + ?)
        WHERE id = ?
      `, [increment, contentId]);
    } catch (error) {
      // If the specific content table doesn't have share_count, update generic table
      try {
        await pool.query(`
          UPDATE ugc_generic_content
          SET share_count = GREATEST(0, share_count + ?)
          WHERE id = ?
        `, [increment, contentId]);
      } catch (e) {
        // Ignore errors if share_count column doesn't exist
        logger.warn('Could not update share count:', e.message);
      }
    }
  }
}

module.exports = new ShareController();
