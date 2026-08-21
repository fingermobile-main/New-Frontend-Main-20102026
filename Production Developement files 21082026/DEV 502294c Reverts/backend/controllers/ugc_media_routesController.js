/**
 * UGC Media Routes Controller
 * Complete implementation with cloud storage integration
 * Date: June 13, 2026 - Enhanced with file upload processing
 */

const { pool } = require('../db');
const logger = require('../utils/logger');
const ugcMediaService = require('../services/ugc_media_service');

class UgcMediaRoutesController {
  /**
   * POST /api/ugc-media/upload-file
   * Upload media file to cloud storage
   */
  async uploadFile(req, res) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false, message: 'No file uploaded'
        });
      }
      
      // Extract metadata from request body
      const metadata = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        tags: req.body.tags ? JSON.parse(req.body.tags) : []
      };
      
      // Upload to storage service
      const result = await ugcMediaService.uploadMedia(req.file, userId, metadata);
      
      res.status(201).json({
        success: true, message: 'File uploaded successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UgcMediaRoutesController.uploadFile:', error);
      res.status(500).json({
        success: false, message: 'Upload failed',
        error: error.message
      });
    }
  }
  
  /**
   * POST /api/ugc-media/:mediaId/process
   * Trigger media processing (thumbnails, transcoding)
   */
  async processMedia(req, res) {
    try {
      const { mediaId } = req.params;
      const options = req.body.options || {};
      
      const result = await ugcMediaService.processMedia(mediaId, options);
      
      if (!result.success) {
        return res.status(500).json({
          success: false, message: 'Processing failed',
          error: result.error
        });
      }
      
      res.json({
        success: true, message: 'Media processing initiated', data: result
      });
    } catch (error) {
      logger.error('Error in UgcMediaRoutesController.processMedia:', error);
      res.status(500).json({
        success: false, message: 'Processing failed',
        error: error.message
      });
    }
  }
  
  /**
   * DELETE /api/ugc-media/:mediaId
   * Delete media file
   */
  async deleteMedia(req, res) {
    try {
      const { mediaId } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }
      
      const result = await ugcMediaService.deleteMedia(mediaId, userId);
      
      res.json({
        success: true, message: 'Media deleted successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UgcMediaRoutesController.deleteMedia:', error);
      res.status(error.message.includes('Unauthorized') ? 403 : 500).json({
        success: false, message: 'Deletion failed',
        error: error.message
      });
    }
  }
  
  /**
   * GET /api/ugc-media/:mediaId/metadata
   * Get detailed media metadata
   */
  async getMetadata(req, res) {
    try {
      const { mediaId } = req.params;
      
      const media = await ugcMediaService.getMediaMetadata(mediaId);
      
      if (!media) {
        return res.status(404).json({
          success: false, message: 'Media not found'
        });
      }
      
      res.json({
        success: true, data: media
      });
    } catch (error) {
      logger.error('Error in UgcMediaRoutesController.getMetadata:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve metadata', error: error.message
      });
    }
  }
  
  /**
   * GET /api/ugc-media/user/:userId/quota
   * Get user's storage quota usage
   */
  async getStorageQuota(req, res) {
    try {
      const { userId } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM ugc_storage_quotas WHERE user_id = $1',
        [userId]
      );
      
      const quota = result.rows[0] || {
        total_used_bytes: 0,
        file_count: 0,
        quota_limit_bytes: 1073741824 // 1GB default
      };
      
      res.json({
        success: true,
        data: {
          usedBytes: parseInt(quota.total_used_bytes),
          usedMB: Math.round(parseInt(quota.total_used_bytes) / (1024 * 1024)),
          fileCount: parseInt(quota.file_count),
          limitBytes: parseInt(quota.quota_limit_bytes),
          limitMB: Math.round(parseInt(quota.quota_limit_bytes) / (1024 * 1024)), 
          percentUsed: Math.round((parseInt(quota.total_used_bytes) / parseInt(quota.quota_limit_bytes)) * 100) // Fixed: Added missing property comma
        }
      });
    } catch (error) {
      logger.error('Error in UgcMediaRoutesController.getStorageQuota:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve quota', error: error.message
      });
    }
  }
  
  /**
   * GET /api/ugc-media/content
   * Get UGC media content
   */
  async getContent(req, res) {
    try {
      const { limit = 50, offset = 0, type, category, status } = req.query;

      let whereClause = ['is_published = true'];
      let queryParams = [];
      let paramCount = 1;

      if (type) {
        whereClause.push(`media_type = $${paramCount}`);
        queryParams.push(type);
        paramCount++;
      }

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      if (status) {
        whereClause.push(`moderation_status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      const whereSQL = whereClause.join(' AND ');

      // Fixed: Converted to backticks, resolved double-quote nested collision, added selection comma, and fixed raw parameter assignment
      const result = await pool.query(`
        SELECT 
          u.*,
          u2.username as creator_username,
          u2.avatar_url as creator_avatar,
          COUNT(DISTINCT l.id) as likes_count, 
          COUNT(DISTINCT v.id) as views_count
         FROM ugc_media u
         JOIN users u2 ON u.creator_id = u2.id
         LEFT JOIN likes l ON l.target_id = u.id AND l.target_type = "ugc_media"
         LEFT JOIN ugc_media_views v ON v.media_id = u.id
         WHERE ${whereSQL}
         GROUP BY u.id, u2.username, u2.avatar_url
         ORDER BY u.created_at DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `, [...queryParams, parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: result.rows.map(media => ({
          ...media, 
          metadata: typeof media.metadata === 'string' ? JSON.parse(media.metadata) : media.metadata, // Fixed: Added missing comma
          likesCount: parseInt(media.likes_count),
          viewsCount: parseInt(media.views_count)
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), // Fixed: Added missing comma
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in UgcMediaRoutesController.getContent:', error);
      res.status(500).json({
        success: false, message: 'Failed to get UGC media', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/ugc-media/upload
   * Upload UGC media
   */
  async uploadMedia(req, res) {
    try {
      const userId = req.user?.id;
      const { title, description, mediaType, mediaUrl, thumbnailUrl, category, tags, metadata } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!title || !mediaUrl || !mediaType) {
        return res.status(400).json({
          success: false, message: 'Title, media URL, and media type are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO ugc_media 
         (creator_id, title, description, media_type, media_url, thumbnail_url, category, tags, metadata, moderation_status, is_published, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', false, NOW())
         RETURNING *`,
        [
          userId,
          title,
          description || null,
          mediaType,
          mediaUrl,
          thumbnailUrl || null,
          category || null,
          JSON.stringify(tags || []),
          JSON.stringify(metadata || {})
        ]
      );

      res.status(201).json({
        success: true, message: 'Media uploaded successfully. Pending moderation.', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in UgcMediaRoutesController.uploadMedia:', error);
      res.status(500).json({
        success: false, message: 'Failed to upload media', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/ugc-media/:id/approve
   * Approve UGC media (moderator only)
   */
  async approveMedia(req, res) {
    try {
      if (!req.user?.isModerator && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Moderator or admin access required'
        });
      }

      const { id } = req.params;

      await pool.query(
        `UPDATE ugc_media 
         SET moderation_status = 'approved', is_published = true, moderated_at = NOW()
         WHERE id = $1`,
        [id]
      );

      res.json({
        success: true, message: 'Media approved successfully'
      });
    } catch (error) {
      logger.error('Error in UgcMediaRoutesController.approveMedia:', error);
      res.status(500).json({
        success: false, message: 'Failed to approve media', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/ugc-media/:id/reject
   * Reject UGC media (moderator only)
   */
  async rejectMedia(req, res) {
    try {
      if (!req.user?.isModerator && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Moderator or admin access required'
        });
      }

      const { id } = req.params;
      const { reason } = req.body;

      await pool.query(
        `UPDATE ugc_media 
         SET moderation_status = 'rejected', moderation_reason = $1, moderated_at = NOW()
         WHERE id = $2`,
        [reason || null, id]
      );

      res.json({
        success: true, message: 'Media rejected successfully'
      });
    } catch (error) {
      logger.error('Error in UgcMediaRoutesController.rejectMedia:', error);
      res.status(500).json({
        success: false, message: 'Failed to reject media', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/ugc-media/user/:userId/media
   * Get user's uploaded media
   */
  async getUserMedia(req, res) {
    try {
      const userId = req.params.userId || req.user?.id;
      const { limit = 50, offset = 0 } = req.query;
      
      const result = await pool.query(
        `SELECT * FROM ugc_media WHERE creator_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [userId, parseInt(limit), parseInt(offset)]
      );
      
      res.json({
        success: true,
        data: result.rows.map(media => ({
          ...media, 
          metadata: typeof media.metadata === 'string' ? JSON.parse(media.metadata) : media.metadata
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), // Fixed: Added missing comma
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in UgcMediaRoutesController.getUserMedia:', error);
      res.status(500).json({
        success: false, message: 'Failed to get user media', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Stub methods for route compatibility
  async create(req, res) {
    res.status(201).json({ success: true, message: 'Endpoint not yet implemented', data: null });
  }

  async getById(req, res) {
    res.json({ success: true, message: 'Endpoint not yet implemented', data: null });
  }

  async delete(req, res) {
    res.json({ success: true, message: 'Endpoint not yet implemented', data: null });
  }
}

module.exports = new UgcMediaRoutesController();