/**
 * Universal UGC Download Controller
 * FingerMobile Protocol™
 * Handles content downloads across platforms with privacy controls
 * Enforces member privacy control: allow_download
 */

const db = require('../db');
const logger = require('../utils/logger');
const ugcPrivacyService = require('../services/ugcPrivacyService');

const getPool = () => db.pool || db;

class DownloadController {
  constructor() {
    this.requestDownload = this.requestDownload.bind(this);
    this.getContentDownloads = this.getContentDownloads.bind(this);
    this.getUserDownloads = this.getUserDownloads.bind(this);
    this.downloadContent = this.downloadContent.bind(this);
    this.getDownloadStats = this.getContentDownloads;
  }

  /**
   * Request to download content
   * Enforces privacy control: allow_download
   */
  async requestDownload(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.user.id;

      // Check privacy permissions
      const hasPermission = await ugcPrivacyService.checkPermission(
        contentType,
        contentId,
        userId,
        'download'
      );

      if (!hasPermission || (typeof hasPermission === 'object' && hasPermission.allowed === false)) {
        return res.status(403).json({
          error: 'Download not allowed',
          code: 'DOWNLOAD_NOT_ALLOWED',
          message: typeof hasPermission === 'object' ? hasPermission.reason : 'Download not allowed'
        });
      }

      const pool = getPool();

      // Generate a temporary download token
      const downloadToken = await this.generateDownloadToken(userId, contentType, contentId);

      // Log the download request
      await this.logDownloadRequest(userId, contentType, contentId, req.ip);

      res.status(200).json({
        success: true,
        message: 'Download authorized',
        downloadToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
    } catch (error) {
      logger.error('Error requesting download:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'DOWNLOAD_REQUEST_ERROR'
      });
    }
  }

  /**
   * Get content download statistics
   */
  async getContentDownloads(req, res) {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.user.id;

      // Check privacy permissions
      const hasPermission = await ugcPrivacyService.checkPermission(
        contentType,
        contentId,
        userId,
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
        SELECT COUNT(*) as totalDownloads
        FROM ugc_downloads
        WHERE content_type = ? AND content_id = ?
        AND status = 'completed'
      `, [contentType, contentId]);

      res.status(200).json({
        success: true,
        downloads: result[0][0]?.totalDownloads || 0
      });
    } catch (error) {
      logger.error('Error getting content downloads:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'CONTENT_DOWNLOADS_ERROR'
      });
    }
  }

  /**
   * Get user's download history
   */
  async getUserDownloads(req, res) {
    try {
      const userId = req.user.id;

      const pool = getPool();

      // Fixed: Added proper mapping for content type to table
      const contentTypeToTableMap = {
        'post': 'ugc_posts',
        'image': 'ugc_images',
        'video': 'ugc_videos',
        'audio': 'ugc_audios',
        'document': 'ugc_documents',
        'link': 'ugc_links'
      };

      const contentType = req.query.contentType || 'post'; // Default content type
      const table = contentTypeToTableMap[contentType] || 'ugc_generic_content';

      const downloads = await pool.query(`
        SELECT ud.*, c.title as contentTitle, c.owner_id as contentOwnerId
        FROM ugc_downloads ud
        LEFT JOIN ?? c ON ud.content_id = c.id
        WHERE ud.user_id = ?
        ORDER BY ud.created_at DESC
        LIMIT 50
      `, [table, userId]);

      res.status(200).json({
        success: true,
        downloads: downloads[0]
      });
    } catch (error) {
      logger.error('Error getting user downloads:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'USER_DOWNLOADS_ERROR'
      });
    }
  }

  /**
   * Direct download endpoint using token (no auth required after token verification)
   */
  async downloadContent(req, res) {
    try {
      const { token } = req.params;

      // Verify download token
      const downloadRecord = await this.verifyDownloadToken(token);

      if (!downloadRecord) {
        return res.status(403).json({
          error: 'Invalid or expired download token',
          code: 'INVALID_TOKEN'
        });
      }

      // Update download status to completed
      await this.updateDownloadStatus(downloadRecord.id, 'completed');

      // Serve the actual content file
      // This would typically stream the file to the client
      // For now, returning a placeholder response
      res.status(200).json({
        success: true,
        message: 'Download authorized',
        contentInfo: {
          type: downloadRecord.content_type,
          id: downloadRecord.content_id,
          userId: downloadRecord.user_id
        }
      });

      // In a real implementation, this would serve the actual file:
      /*
      res.download(filePath, (err) => {
        if (err) {
          logger.error('Error serving download:', err);
          // Still log as completed even if serving failed
          this.updateDownloadStatus(downloadRecord.id, 'completed_with_error');
        }
      });
      */

    } catch (error) {
      logger.error('Error in direct download:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'DIRECT_DOWNLOAD_ERROR'
      });
    }
  }

  // Helper methods
  async generateDownloadToken(userId, contentType, contentId) {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');

    const pool = getPool();

    await pool.query(`
      INSERT INTO ugc_download_tokens (token, user_id, content_type, content_id, expires_at)
      VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))
    `, [token, userId, contentType, contentId]);

    return token;
  }

  async verifyDownloadToken(token) {
    const pool = getPool();

    const result = await pool.query(`
      SELECT *
      FROM ugc_download_tokens
      WHERE token = ? AND expires_at > NOW()
      AND status = 'active'
      LIMIT 1
    `, [token]);

    return result[0][0] || null;
  }

  async logDownloadRequest(userId, contentType, contentId, ipAddress) {
    const pool = getPool();

    await pool.query(`
      INSERT INTO ugc_downloads (user_id, content_type, content_id, ip_address, status)
      VALUES (?, ?, ?, ?, 'pending')
    `, [userId, contentType, contentId, ipAddress]);
  }

  async updateDownloadStatus(downloadId, status) {
    const pool = getPool();

    await pool.query(`
      UPDATE ugc_downloads
      SET status = ?, completed_at = NOW()
      WHERE id = ?
    `, [status, downloadId]);
  }
}

module.exports = new DownloadController();
