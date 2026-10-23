const fs = require('fs');
const path = require('path');
const { pool } = require('../db');
const logger = require('../utils/logger') || console;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads/tribut');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

class TributController {
  /**
   * POST /api/tribut/upload
   * Handles direct hardware media upload (from Phone, Laptop, Desktop)
   * Records media and hardware device telemetry in tribut_media_uploads
   */
  async uploadMedia(req, res) {
    try {
      if (!req.file && (!req.files || req.files.length === 0) && !req.body.base64Data) {
        return res.status(400).json({
          success: false,
          message: 'No file or media data received from hardware device'
        });
      }

      const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
      const batchUploadId = req.body.batchUploadId || `batch-${Date.now()}`;
      const deviceId = req.body.deviceId || 'device-local-hw';
      const deviceName = req.body.deviceName || 'Personal Hardware Device';
      const deviceType = req.body.deviceType || 'desktop';
      const devicePlatform = req.body.devicePlatform || 'macOS';
      const browserClient = req.body.browserClient || 'Chrome / WebKit';
      let screenResolution = { width: 1920, height: 1080, pixelRatio: 1 };
      let hardwareSpecs = {};

      try {
        if (req.body.screenResolution) {
          screenResolution = typeof req.body.screenResolution === 'string'
            ? JSON.parse(req.body.screenResolution)
            : req.body.screenResolution;
        }
        if (req.body.hardwareSpecs) {
          hardwareSpecs = typeof req.body.hardwareSpecs === 'string'
            ? JSON.parse(req.body.hardwareSpecs)
            : req.body.hardwareSpecs;
        }
      } catch (e) {
        // Fallback default
      }

      const filesToProcess = [];

      if (req.file) {
        filesToProcess.push({
          filename: req.file.filename,
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          path: req.file.path,
          url: `/uploads/tribut/${req.file.filename}`
        });
      } else if (req.files && req.files.length > 0) {
        req.files.forEach(f => {
          filesToProcess.push({
            filename: f.filename,
            originalname: f.originalname,
            size: f.size,
            mimetype: f.mimetype,
            path: f.path,
            url: `/uploads/tribut/${f.filename}`
          });
        });
      } else if (req.body.base64Data) {
        // Base64 fallback
        const matches = req.body.base64Data.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).json({ success: false, message: 'Invalid base64 payload' });
        }
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const ext = mimeType.split('/')[1] || 'webp';
        const filename = `device-upload-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        filesToProcess.push({
          filename,
          originalname: req.body.originalName || filename,
          size: buffer.length,
          mimetype: mimeType,
          path: filePath,
          url: `/uploads/tribut/${filename}`
        });
      }

      // Persist each uploaded item into tribut_media_uploads with hardware device properties
      const persistedUploads = [];
      for (const item of filesToProcess) {
        const mediaType = item.mimetype.startsWith('video/') ? 'video' : 'image';
        try {
          const insertRes = await pool.query(`
            INSERT INTO tribut_media_uploads (
              user_id,
              device_id,
              device_name,
              device_type,
              device_platform,
              browser_client,
              screen_resolution,
              hardware_specs,
              file_name,
              original_name,
              file_path,
              file_url,
              mime_type,
              file_size_bytes,
              media_type,
              status,
              is_pinned_to_tribut
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'uploaded', true
            )
            RETURNING *;
          `, [
            userId,
            deviceId,
            deviceName,
            deviceType,
            devicePlatform,
            browserClient,
            JSON.stringify(screenResolution),
            JSON.stringify(hardwareSpecs),
            item.filename,
            item.originalname,
            item.path,
            item.url,
            item.mimetype,
            item.size,
            mediaType
          ]);
          persistedUploads.push(insertRes.rows[0]);
        } catch (dbErr) {
          if (logger.warn) logger.warn('Failed to insert tribut_media_uploads record:', dbErr.message);
          persistedUploads.push({
            file_url: item.url,
            original_name: item.originalname,
            file_size_bytes: item.size,
            mime_type: item.mimetype,
            device_type: deviceType,
            device_platform: devicePlatform
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Media uploaded from device successfully',
        count: persistedUploads.length,
        data: persistedUploads.length === 1 ? persistedUploads[0] : persistedUploads,
        urls: persistedUploads.map(u => u.file_url)
      });
    } catch (error) {
      if (logger.error) logger.error('Tribut media upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process hardware media upload',
        error: error.message
      });
    }
  }

  /**
   * POST /api/tribut/pins
   * Saves and pins a design to Tribut with all hardware device properties
   */
  async createPin(req, res) {
    try {
      const {
        title,
        description,
        category = 'fashion',
        boardName = 'Smart Home Lagos 2026',
        aspectRatio = '2:3',
        mediaType = 'image',
        mediaUrl,
        multiMediaUrls = [],
        videoUrl,
        colorPalette = [],
        promptRecipe,
        priority = 'high',
        shoppingMetadata = {},
        deviceType = 'desktop',
        devicePlatform = 'macOS',
        hardwareMetadata = {},
        isPinnedToTribut = true,
        isPinnedToGallery = true,
        uploaderName = 'Ibrahim Danjuma (You)',
        uploaderHandle = '@ibrahim_d',
        tags = []
      } = req.body;

      if (!title || !mediaUrl) {
        return res.status(400).json({
          success: false,
          message: 'Title and mediaUrl are required'
        });
      }

      const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';

      const insertQuery = `
        INSERT INTO tribut_posts (
          user_id,
          title,
          caption,
          image_url,
          thumbnail_url,
          category,
          aspect_ratio,
          dimensions,
          camera_model,
          tags,
          status,
          device_type,
          device_platform,
          hardware_metadata,
          media_type,
          multi_media_urls,
          video_url,
          color_palette,
          prompt_recipe,
          shopping_metadata,
          is_pinned_to_gallery,
          is_pinned_to_tribut,
          board_name,
          priority,
          uploader_name,
          uploader_handle,
          guardian_quality_score,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, NOW(), NOW()
        )
        RETURNING *;
      `;

      const dimensions = hardwareMetadata.resolution || { width: 1080, height: 1620 };
      const cameraModel = hardwareMetadata.cameraModel || `${deviceType.toUpperCase()} Hardware Sensor`;
      const isPinned = isPinnedToTribut !== undefined ? isPinnedToTribut : isPinnedToGallery;

      const values = [
        userId,
        title,
        description || '',
        mediaUrl,
        mediaUrl,
        category,
        aspectRatio,
        JSON.stringify(dimensions),
        cameraModel,
        JSON.stringify(tags.length ? tags : [category, 'creator-studio', deviceType]),
        'published',
        deviceType,
        devicePlatform,
        JSON.stringify(hardwareMetadata),
        mediaType,
        JSON.stringify(multiMediaUrls),
        videoUrl || null,
        JSON.stringify(colorPalette),
        promptRecipe || null,
        JSON.stringify(shoppingMetadata),
        isPinned,
        isPinned,
        boardName,
        priority,
        uploaderName,
        uploaderHandle,
        96.5
      ];

      const result = await pool.query(insertQuery, values);
      const savedPin = result.rows[0];

      return res.status(201).json({
        success: true,
        message: 'Design created and pinned to Tribut successfully',
        data: savedPin
      });
    } catch (error) {
      if (logger.error) logger.error('Error creating tribut pin:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create pin in database',
        error: error.message
      });
    }
  }

  /**
   * GET /api/tribut/pins
   * Fetch all Tribut pins
   */
  async getPins(req, res) {
    try {
      const { category, deviceType, pinnedOnly } = req.query;
      let query = 'SELECT * FROM tribut_posts WHERE status NOT IN (\'deleted\', \'suspended\', \'frozen\', \'archived\')';
      const params = [];

      if (category && category !== 'all') {
        params.push(category);
        query += ` AND category = $${params.length}`;
      }
      if (deviceType && deviceType !== 'all') {
        params.push(deviceType);
        query += ` AND device_type = $${params.length}`;
      }
      if (pinnedOnly === 'true') {
        query += ' AND (is_pinned_to_tribut = true OR is_pinned_to_gallery = true)';
      }

      query += ' ORDER BY created_at DESC LIMIT 100;';

      const result = await pool.query(query, params);
      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    } catch (error) {
      if (logger.error) logger.error('Error fetching tribut pins:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tribut pins',
        error: error.message
      });
    }
  }

  /**
   * GET /api/tribut/uploads
   * Fetch uploaded media items with hardware device properties
   */
  async getUploads(req, res) {
    try {
      const { deviceType, status = 'active', limit = 50 } = req.query;
      let query = 'SELECT * FROM tribut_media_uploads WHERE status NOT IN (\'deleted\', \'suspended\', \'frozen\', \'archived\')';
      const params = [];

      if (deviceType && deviceType !== 'all') {
        params.push(deviceType);
        query += ` AND device_type = $${params.length}`;
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1};`;
      params.push(parseInt(limit, 10));

      const result = await pool.query(query, params);
      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    } catch (error) {
      if (logger.error) logger.error('Error fetching tribut uploads:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tribut uploads',
        error: error.message
      });
    }
  }

  /**
   * PATCH /api/tribut/pins/:id/pin-status
   * Toggle pin to Tribut
   */
  async togglePinStatus(req, res) {
    try {
      const { id } = req.params;
      const { isPinned } = req.body;
      const pinValue = isPinned !== undefined ? isPinned : true;
      const result = await pool.query(
        `UPDATE tribut_posts 
         SET is_pinned_to_tribut = $1, is_pinned_to_gallery = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [pinValue, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Pin not found' });
      }
      return res.status(200).json({
        success: true,
        message: `Tribut pin status updated to: ${result.rows[0].is_pinned_to_tribut ? 'PINNED' : 'UNPINNED'}`,
        data: result.rows[0]
      });
    } catch (error) {
      if (logger.error) logger.error('Error toggling pin status:', error);
      return res.status(500).json({ success: false, message: 'Failed to update pin status' });
    }
  }

  /**
   * DELETE /api/tribut/pins/batch
   * Batch delete multiple items/projects/videos/images/cards
   */
  async batchDeletePins(req, res) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Array of item IDs is required for batch deletion'
        });
      }

      // Mark status as deleted in tribut_posts
      const resultPosts = await pool.query(
        'UPDATE tribut_posts SET status = \'deleted\', updated_at = NOW() WHERE id = ANY($1::uuid[]) RETURNING id;',
        [ids]
      );

      // Also mark in tribut_media_uploads if linked
      await pool.query(
        'UPDATE tribut_media_uploads SET status = \'deleted\', updated_at = NOW() WHERE tribut_post_id = ANY($1::uuid[]) OR id = ANY($1::uuid[]);',
        [ids]
      );

      return res.status(200).json({
        success: true,
        message: `Successfully deleted ${resultPosts.rows.length} item(s) in batch`,
        deletedIds: resultPosts.rows.map(r => r.id),
        requestedCount: ids.length
      });
    } catch (error) {
      if (logger.error) logger.error('Error in batch deleting tribut pins:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to batch delete items',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/tribut/pins/:id
   * Single item deletion
   */
  async deletePin(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'UPDATE tribut_posts SET status = \'deleted\', updated_at = NOW() WHERE id = $1 RETURNING *;',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }

      await pool.query(
        'UPDATE tribut_media_uploads SET status = \'deleted\', updated_at = NOW() WHERE tribut_post_id = $1 OR id = $1;',
        [id]
      );

      return res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      if (logger.error) logger.error('Error deleting pin:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete item',
        error: error.message
      });
    }
  }
}

module.exports = new TributController();
