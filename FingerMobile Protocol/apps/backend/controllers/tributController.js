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

  /**
   * GET /api/tribut/overview
   * Returns complete telemetry and status breakdown for Tribut Management Console
   */
  async getOverview(req, res) {
    try {
      const statsRes = await pool.query(`
        SELECT
          COUNT(*) as total_pins,
          COUNT(CASE WHEN status = 'published' AND (is_censored = false OR is_censored IS NULL) THEN 1 END) as active_pins,
          COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_pins,
          COUNT(CASE WHEN is_censored = true OR status = 'censored' THEN 1 END) as censored_pins,
          COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_pins,
          COUNT(CASE WHEN comments_paused = true THEN 1 END) as comments_paused_pins,
          COUNT(CASE WHEN is_pinned_to_tribut = true OR is_pinned_to_gallery = true THEN 1 END) as pinned_pins
        FROM tribut_posts
        WHERE status != 'deleted';
      `);

      const categoriesRes = await pool.query(`
        SELECT category, COUNT(*) as count
        FROM tribut_posts
        WHERE status != 'deleted'
        GROUP BY category
        ORDER BY count DESC;
      `);

      const uploadsCountRes = await pool.query(`
        SELECT COUNT(*) as total_uploads
        FROM tribut_media_uploads
        WHERE status != 'deleted';
      `);

      const boardsCountRes = await pool.query(`
        SELECT COUNT(*) as total_boards
        FROM tribut_project_boards;
      `);

      return res.status(200).json({
        success: true,
        data: {
          summary: statsRes.rows[0] || {},
          categories: categoriesRes.rows || [],
          totalUploads: parseInt(uploadsCountRes.rows[0]?.total_uploads || '0', 10),
          totalBoards: parseInt(boardsCountRes.rows[0]?.total_boards || '0', 10),
          engine: 'Tribut Sovereign Pin & Showcase Engine v4.2',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      if (logger.error) logger.error('Error fetching tribut overview:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch overview', error: error.message });
    }
  }

  /**
   * GET /api/tribut/admin/pins
   * Fetch all Tribut pins for administrative and moderation micro-management
   */
  async getAllPinsAdmin(req, res) {
    try {
      const { category, status, search, priority, limit = 100, offset = 0 } = req.query;
      let query = "SELECT * FROM tribut_posts WHERE status != 'deleted'";
      const params = [];

      if (category && category !== 'ALL' && category !== 'all') {
        params.push(category);
        query += ` AND category = $${params.length}`;
      }

      if (status && status !== 'ALL' && status !== 'all') {
        if (status === 'censored') {
          query += ` AND (is_censored = true OR status = 'censored')`;
        } else if (status === 'comments_paused') {
          query += ` AND comments_paused = true`;
        } else if (status === 'active') {
          query += ` AND status = 'published' AND (is_censored = false OR is_censored IS NULL)`;
        } else {
          params.push(status);
          query += ` AND status = $${params.length}`;
        }
      }

      if (priority && priority !== 'ALL' && priority !== 'all') {
        params.push(priority);
        query += ` AND priority = $${params.length}`;
      }

      if (search) {
        params.push(`%${search.trim()}%`);
        query += ` AND (title ILIKE $${params.length} OR caption ILIKE $${params.length} OR board_name ILIKE $${params.length} OR uploader_name ILIKE $${params.length})`;
      }

      query += ` ORDER BY COALESCE(display_order, 999) ASC, created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2};`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const result = await pool.query(query, params);
      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    } catch (error) {
      if (logger.error) logger.error('Error in getAllPinsAdmin:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch admin pins', error: error.message });
    }
  }

  /**
   * PUT /api/tribut/pins/:id
   * Update pin metadata, category, cover photo, shopping details
   */
  async updatePin(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        caption,
        category,
        boardName,
        priority,
        coverImageUrl,
        isPinnedToTribut,
        tags,
        shoppingMetadata
      } = req.body;

      const result = await pool.query(`
        UPDATE tribut_posts
        SET
          title = COALESCE($1, title),
          caption = COALESCE($2, caption),
          category = COALESCE($3, category),
          board_name = COALESCE($4, board_name),
          priority = COALESCE($5, priority),
          cover_image_url = COALESCE($6, cover_image_url),
          is_pinned_to_tribut = COALESCE($7, is_pinned_to_tribut),
          is_pinned_to_gallery = COALESCE($7, is_pinned_to_gallery),
          tags = CASE WHEN $8::jsonb IS NOT NULL THEN $8::jsonb ELSE tags END,
          shopping_metadata = CASE WHEN $9::jsonb IS NOT NULL THEN $9::jsonb ELSE shopping_metadata END,
          updated_at = NOW()
        WHERE id = $10
        RETURNING *;
      `, [
        title,
        caption,
        category,
        boardName,
        priority,
        coverImageUrl,
        isPinnedToTribut,
        tags ? JSON.stringify(tags) : null,
        shoppingMetadata ? JSON.stringify(shoppingMetadata) : null,
        id
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Pin not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Pin updated successfully in PostgreSQL',
        data: result.rows[0]
      });
    } catch (error) {
      if (logger.error) logger.error('Error updating pin:', error);
      return res.status(500).json({ success: false, message: 'Failed to update pin', error: error.message });
    }
  }

  /**
   * PATCH /api/tribut/pins/:id/freeze
   * Freeze/Vault pin from public feed
   */
  async toggleFreeze(req, res) {
    try {
      const { id } = req.params;
      const current = await pool.query('SELECT status FROM tribut_posts WHERE id = $1', [id]);
      if (current.rows.length === 0) return res.status(404).json({ success: false, message: 'Pin not found' });

      const newStatus = current.rows[0].status === 'frozen' ? 'published' : 'frozen';
      const updated = await pool.query(
        'UPDATE tribut_posts SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;',
        [newStatus, id]
      );
      return res.status(200).json({
        success: true,
        message: `Pin ${newStatus === 'frozen' ? 'frozen/vaulted from feed' : 'restored to active feed'}`,
        data: updated.rows[0]
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to toggle freeze', error: error.message });
    }
  }

  /**
   * PATCH /api/tribut/pins/:id/censor
   * Censor/Uncensor post with Guardian AI visual censor shield
   */
  async toggleCensor(req, res) {
    try {
      const { id } = req.params;
      const current = await pool.query('SELECT is_censored FROM tribut_posts WHERE id = $1', [id]);
      if (current.rows.length === 0) return res.status(404).json({ success: false, message: 'Pin not found' });

      const newCensored = !current.rows[0].is_censored;
      const newStatus = newCensored ? 'censored' : 'published';
      const updated = await pool.query(
        'UPDATE tribut_posts SET is_censored = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *;',
        [newCensored, newStatus, id]
      );
      return res.status(200).json({
        success: true,
        message: `Pin ${newCensored ? 'censored with visual privacy shield' : 'uncensored and visual shield cleared'}`,
        data: updated.rows[0]
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to toggle censor', error: error.message });
    }
  }

  /**
   * PATCH /api/tribut/pins/:id/suspend
   * Suspend/Unsuspend creator/pin
   */
  async toggleSuspend(req, res) {
    try {
      const { id } = req.params;
      const current = await pool.query('SELECT status FROM tribut_posts WHERE id = $1', [id]);
      if (current.rows.length === 0) return res.status(404).json({ success: false, message: 'Pin not found' });

      const newStatus = current.rows[0].status === 'suspended' ? 'published' : 'suspended';
      const updated = await pool.query(
        'UPDATE tribut_posts SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;',
        [newStatus, id]
      );
      return res.status(200).json({
        success: true,
        message: `Pin ${newStatus === 'suspended' ? 'suspended from all platform operations' : 'reactivated'}`,
        data: updated.rows[0]
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to toggle suspend', error: error.message });
    }
  }

  /**
   * PATCH /api/tribut/pins/:id/pause-comments
   * Pause commenting / Lock discussions
   */
  async togglePauseComments(req, res) {
    try {
      const { id } = req.params;
      const current = await pool.query('SELECT comments_paused FROM tribut_posts WHERE id = $1', [id]);
      if (current.rows.length === 0) return res.status(404).json({ success: false, message: 'Pin not found' });

      const newPaused = !current.rows[0].comments_paused;
      const updated = await pool.query(
        'UPDATE tribut_posts SET comments_paused = $1, updated_at = NOW() WHERE id = $2 RETURNING *;',
        [newPaused, id]
      );
      return res.status(200).json({
        success: true,
        message: `Commenting on pin ${newPaused ? 'paused / locked' : 'unlocked and resumed'}`,
        data: updated.rows[0]
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to toggle comment state', error: error.message });
    }
  }

  /**
   * POST /api/tribut/pins/:id/report
   * Report pin with reason and record in moderation log
   */
  async reportPin(req, res) {
    try {
      const { id } = req.params;
      const { reason = 'Inappropriate content / copyright breach' } = req.body;
      const updated = await pool.query(`
        UPDATE tribut_posts
        SET
          report_count = COALESCE(report_count, 0) + 1,
          moderation_notes = CONCAT(COALESCE(moderation_notes, ''), E'\\n[' || NOW() || '] ' || $1),
          updated_at = NOW()
        WHERE id = $2
        RETURNING *;
      `, [reason, id]);
      if (updated.rows.length === 0) return res.status(404).json({ success: false, message: 'Pin not found' });
      return res.status(200).json({
        success: true,
        message: `Report recorded. Pin now has ${updated.rows[0].report_count} flag(s).`,
        data: updated.rows[0]
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to record report', error: error.message });
    }
  }

  /**
   * POST /api/tribut/pins/reorder
   * Priority resequencing in PostgreSQL
   */
  async reorderPins(req, res) {
    try {
      const { sourceId, targetId } = req.body;
      if (!sourceId || !targetId) {
        return res.status(400).json({ success: false, message: 'sourceId and targetId are required' });
      }

      const rows = await pool.query('SELECT id, display_order FROM tribut_posts WHERE id IN ($1, $2)', [sourceId, targetId]);
      if (rows.rows.length < 2) {
        return res.status(404).json({ success: false, message: 'Pins not found' });
      }

      const sourceOrder = rows.rows.find(r => r.id === sourceId).display_order || 1;
      const targetOrder = rows.rows.find(r => r.id === targetId).display_order || 2;

      await pool.query('UPDATE tribut_posts SET display_order = $1 WHERE id = $2', [targetOrder, sourceId]);
      await pool.query('UPDATE tribut_posts SET display_order = $1 WHERE id = $2', [sourceOrder, targetId]);

      const updated = await pool.query("SELECT * FROM tribut_posts WHERE status != 'deleted' ORDER BY COALESCE(display_order, 999) ASC, created_at DESC LIMIT 100;");
      return res.status(200).json({
        success: true,
        message: 'Tribut pins priority resequenced in PostgreSQL',
        data: updated.rows
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to reorder pins', error: error.message });
    }
  }

  /**
   * POST /api/tribut/upload-pack
   * Direct Multipart/Form-Data upload for 1. Images, 2. Cover photo, 3. Videos
   * Persists straight to PostgreSQL without localStorage fallback
   */
  async uploadMediaPack(req, res) {
    try {
      const files = req.files || {};
      const { deviceType = 'desktop', devicePlatform = 'macOS', deviceName = 'Hardware Camera / Upload Terminal' } = req.body;
      const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';

      const results = {
        images: [],
        cover: null,
        videos: []
      };

      if (files.cover && files.cover.length > 0) {
        const c = files.cover[0];
        const coverUrl = `/uploads/tribut/${c.filename}`;
        results.cover = coverUrl;
        await pool.query(`
          INSERT INTO tribut_media_uploads (
            user_id, device_name, device_type, device_platform, file_name, original_name,
            file_path, file_url, mime_type, file_size_bytes, media_type, status, is_pinned_to_tribut
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'cover', 'uploaded', true);
        `, [userId, deviceName, deviceType, devicePlatform, c.filename, c.originalname, c.path, coverUrl, c.mimetype, c.size]);
      }

      if (files.images && files.images.length > 0) {
        for (const img of files.images) {
          const imgUrl = `/uploads/tribut/${img.filename}`;
          results.images.push(imgUrl);
          await pool.query(`
            INSERT INTO tribut_media_uploads (
              user_id, device_name, device_type, device_platform, file_name, original_name,
              file_path, file_url, mime_type, file_size_bytes, media_type, status, is_pinned_to_tribut
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'image', 'uploaded', true);
          `, [userId, deviceName, deviceType, devicePlatform, img.filename, img.originalname, img.path, imgUrl, img.mimetype, img.size]);
        }
      }

      if (files.video && files.video.length > 0) {
        for (const vid of files.video) {
          const vidUrl = `/uploads/tribut/${vid.filename}`;
          results.videos.push(vidUrl);
          await pool.query(`
            INSERT INTO tribut_media_uploads (
              user_id, device_name, device_type, device_platform, file_name, original_name,
              file_path, file_url, mime_type, file_size_bytes, media_type, status, is_pinned_to_tribut
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'video', 'uploaded', true);
          `, [userId, deviceName, deviceType, devicePlatform, vid.filename, vid.originalname, vid.path, vidUrl, vid.mimetype, vid.size]);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Media pack (Images, Cover, Videos) uploaded direct to Express backend & persisted to PostgreSQL!',
        data: results
      });
    } catch (error) {
      if (logger.error) logger.error('Error in uploadMediaPack:', error);
      return res.status(500).json({ success: false, message: 'Failed to process media pack upload', error: error.message });
    }
  }
}

module.exports = new TributController();
