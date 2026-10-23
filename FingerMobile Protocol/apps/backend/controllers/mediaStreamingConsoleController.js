const { identityDb } = require('../db/db');
const logger = require('../config/logger');

class MediaStreamingConsoleController {
  /**
   * GET /api/media-streaming-console/overview
   * Returns live metrics, counts, and health status for BeatwaveNG, Dancia-4Tv, and VideoBox
   */
  async getOverview(req, res) {
    try {
      const summaryQuery = `
        SELECT 
          service_key,
          COUNT(*) as total_items,
          COUNT(*) FILTER (WHERE status = 'active') as active_items,
          COUNT(*) FILTER (WHERE status = 'frozen') as frozen_items,
          COUNT(*) FILTER (WHERE status = 'draft') as draft_items,
          COALESCE(SUM(fic_bounty), 0) as total_bounty_fic,
          COALESCE(SUM(license_fee_fic), 0) as total_license_fic,
          COALESCE(AVG(bpm) FILTER (WHERE bpm > 0), 120) as avg_bpm,
          COALESCE(SUM(views), 0) as total_views,
          COALESCE(SUM(likes), 0) as total_likes
        FROM media_streaming_console_items
        GROUP BY service_key;
      `;

      const { rows } = await identityDb.query(summaryQuery);
      const services = ['beatwaveng', 'dancia4tv', 'videobox'];

      const overviewMap = {};
      services.forEach(key => {
        const found = rows.find(r => r.service_key === key);
        overviewMap[key] = {
          serviceKey: key,
          totalItems: found ? parseInt(found.total_items, 10) : 0,
          activeItems: found ? parseInt(found.active_items, 10) : 0,
          frozenItems: found ? parseInt(found.frozen_items, 10) : 0,
          draftItems: found ? parseInt(found.draft_items, 10) : 0,
          totalBountyFic: found ? parseFloat(found.total_bounty_fic) : 0,
          totalLicenseFic: found ? parseFloat(found.total_license_fic) : 0,
          avgBpm: found ? Math.round(parseFloat(found.avg_bpm)) : 120,
          totalViews: found ? parseInt(found.total_views, 10) : 0,
          totalLikes: found ? parseInt(found.total_likes, 10) : 0,
          healthScore: found && found.frozen_items > 0 ? 94 : 99,
          status: found && found.frozen_items > 0 ? 'degraded' : 'healthy'
        };
      });

      return res.json({
        success: true,
        timestamp: new Date().toISOString(),
        totalServices: services.length,
        services: overviewMap
      });
    } catch (err) {
      logger.error('MediaStreamingConsoleController.getOverview error:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch media streaming console overview' });
    }
  }

  /**
   * GET /api/media-streaming-console/service/:serviceKey
   * Get paginated items for a specific streaming service with search and category filters
   */
  async getServiceItems(req, res) {
    try {
      const { serviceKey } = req.params;
      const {
        category,
        status,
        search,
        page = 1,
        limit = 50
      } = req.query;

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 50;
      const offset = (pageNum - 1) * limitNum;

      let query = `
        SELECT 
          id,
          service_key,
          entity_id,
          title,
          slug,
          category,
          subcategory,
          description,
          media_url,
          media_type,
          thumbnail_url,
          duration_seconds,
          bpm,
          musical_key,
          stream_latency_mode,
          resolution,
          status,
          display_order,
          fic_bounty,
          license_fee_fic,
          tags,
          voice_prompt,
          creator_name,
          views,
          likes,
          metadata,
          created_at,
          updated_at
        FROM media_streaming_console_items
        WHERE service_key = $1
      `;
      const params = [serviceKey];
      let paramIndex = 2;

      if (category && category !== 'ALL') {
        query += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (status && status !== 'ALL') {
        query += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (search && search.trim()) {
        query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR creator_name ILIKE $${paramIndex} OR slug ILIKE $${paramIndex})`;
        params.push(`%${search.trim()}%`);
        paramIndex++;
      }

      // Order strictly by display_order ascending, then id ascending
      query += ` ORDER BY display_order ASC, id ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limitNum, offset);

      const countQuery = `
        SELECT COUNT(*) as total
        FROM media_streaming_console_items
        WHERE service_key = $1
        ${category && category !== 'ALL' ? 'AND category = $2' : ''}
        ${status && status !== 'ALL' ? (category && category !== 'ALL' ? 'AND status = $3' : 'AND status = $2') : ''}
      `;
      const countParams = [serviceKey];
      if (category && category !== 'ALL') countParams.push(category);
      if (status && status !== 'ALL') countParams.push(status);

      const [itemsRes, countRes] = await Promise.all([
        identityDb.query(query, params),
        identityDb.query(countQuery, countParams)
      ]);

      const total = parseInt(countRes.rows[0]?.total || 0, 10);

      return res.json({
        success: true,
        serviceKey,
        data: itemsRes.rows,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (err) {
      logger.error('MediaStreamingConsoleController.getServiceItems error:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve media items' });
    }
  }

  /**
   * POST /api/media-streaming-console/service/:serviceKey
   * Create a new media track, stream channel, or video reel
   */
  async createItem(req, res) {
    try {
      const { serviceKey } = req.params;
      const {
        title,
        slug,
        category = 'General',
        subcategory = '',
        description = '',
        media_url = '',
        media_type = 'audio',
        thumbnail_url = '',
        duration_seconds = 0,
        bpm = 120,
        musical_key = 'C Major',
        stream_latency_mode = 'ultra_low',
        resolution = '1080p',
        status = 'active',
        fic_bounty = 0,
        license_fee_fic = 0,
        tags = [],
        voice_prompt = 'owo_ni_koko',
        creator_name = 'Master Studio',
        metadata = {}
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, error: 'Title is required' });
      }

      const generatedSlug = slug && slug.trim()
        ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
        : title.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

      // Calculate next display_order
      const orderRes = await identityDb.query(
        'SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM media_streaming_console_items WHERE service_key = $1;',
        [serviceKey]
      );
      const nextOrder = parseInt(orderRes.rows[0]?.next_order || 1, 10);

      const insertQuery = `
        INSERT INTO media_streaming_console_items (
          service_key,
          title,
          slug,
          category,
          subcategory,
          description,
          media_url,
          media_type,
          thumbnail_url,
          duration_seconds,
          bpm,
          musical_key,
          stream_latency_mode,
          resolution,
          status,
          display_order,
          fic_bounty,
          license_fee_fic,
          tags,
          voice_prompt,
          creator_name,
          metadata,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, NOW(), NOW()
        ) RETURNING *;
      `;

      const values = [
        serviceKey,
        title.trim(),
        generatedSlug,
        category,
        subcategory,
        description,
        media_url,
        media_type,
        thumbnail_url,
        parseInt(duration_seconds, 10) || 0,
        parseInt(bpm, 10) || 120,
        musical_key,
        stream_latency_mode,
        resolution,
        status,
        nextOrder,
        parseFloat(fic_bounty) || 0,
        parseFloat(license_fee_fic) || 0,
        Array.isArray(tags) ? tags : [tags].filter(Boolean),
        voice_prompt,
        creator_name,
        JSON.stringify(metadata)
      ];

      const { rows } = await identityDb.query(insertQuery, values);

      return res.status(201).json({
        success: true,
        item: rows[0],
        message: `Successfully created ${rows[0].title} in ${serviceKey}`
      });
    } catch (err) {
      logger.error('MediaStreamingConsoleController.createItem error:', err);
      return res.status(500).json({ success: false, error: 'Failed to create media item' });
    }
  }

  /**
   * PUT /api/media-streaming-console/service/:serviceKey/:id
   * Update item fields, stems, metadata or status
   */
  async updateItem(req, res) {
    try {
      const { serviceKey, id } = req.params;
      const {
        title,
        slug,
        category,
        subcategory,
        description,
        media_url,
        media_type,
        thumbnail_url,
        duration_seconds,
        bpm,
        musical_key,
        stream_latency_mode,
        resolution,
        status,
        display_order,
        fic_bounty,
        license_fee_fic,
        tags,
        voice_prompt,
        creator_name,
        metadata
      } = req.body;

      const updateQuery = `
        UPDATE media_streaming_console_items SET
          title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          category = COALESCE($3, category),
          subcategory = COALESCE($4, subcategory),
          description = COALESCE($5, description),
          media_url = COALESCE($6, media_url),
          media_type = COALESCE($7, media_type),
          thumbnail_url = COALESCE($8, thumbnail_url),
          duration_seconds = COALESCE($9, duration_seconds),
          bpm = COALESCE($10, bpm),
          musical_key = COALESCE($11, musical_key),
          stream_latency_mode = COALESCE($12, stream_latency_mode),
          resolution = COALESCE($13, resolution),
          status = COALESCE($14, status),
          display_order = COALESCE($15, display_order),
          fic_bounty = COALESCE($16, fic_bounty),
          license_fee_fic = COALESCE($17, license_fee_fic),
          tags = COALESCE($18, tags),
          voice_prompt = COALESCE($19, voice_prompt),
          creator_name = COALESCE($20, creator_name),
          metadata = COALESCE($21, metadata),
          updated_at = NOW()
        WHERE id = $22 AND service_key = $23
        RETURNING *;
      `;

      const values = [
        title,
        slug,
        category,
        subcategory,
        description,
        media_url,
        media_type,
        thumbnail_url,
        duration_seconds !== undefined ? parseInt(duration_seconds, 10) : null,
        bpm !== undefined ? parseInt(bpm, 10) : null,
        musical_key,
        stream_latency_mode,
        resolution,
        status,
        display_order !== undefined ? parseInt(display_order, 10) : null,
        fic_bounty !== undefined ? parseFloat(fic_bounty) : null,
        license_fee_fic !== undefined ? parseFloat(license_fee_fic) : null,
        tags ? (Array.isArray(tags) ? tags : [tags]) : null,
        voice_prompt,
        creator_name,
        metadata ? JSON.stringify(metadata) : null,
        id,
        serviceKey
      ];

      const { rows } = await identityDb.query(updateQuery, values);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Media item not found' });
      }

      return res.json({
        success: true,
        item: rows[0],
        message: `Successfully updated item #${id}`
      });
    } catch (err) {
      logger.error('MediaStreamingConsoleController.updateItem error:', err);
      return res.status(500).json({ success: false, error: 'Failed to update media item' });
    }
  }

  /**
   * DELETE /api/media-streaming-console/service/:serviceKey/:id
   * Permanently delete an item from PostgreSQL
   */
  async deleteItem(req, res) {
    try {
      const { serviceKey, id } = req.params;
      const deleteRes = await identityDb.query(
        'DELETE FROM media_streaming_console_items WHERE id = $1 AND service_key = $2 RETURNING id, title;',
        [id, serviceKey]
      );

      if (deleteRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Media item not found' });
      }

      return res.json({
        success: true,
        message: `Item #${id} (${deleteRes.rows[0].title}) deleted successfully`
      });
    } catch (err) {
      logger.error('MediaStreamingConsoleController.deleteItem error:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete media item' });
    }
  }

  /**
   * POST /api/media-streaming-console/service/:serviceKey/reorder
   * Atomic transactional batch reordering of items (Up / Down rearrangement)
   */
  async reorderItems(req, res) {
    try {
      const { serviceKey } = req.params;
      const { orders } = req.body; // Array of { id: number, display_order: number }

      if (!Array.isArray(orders) || orders.length === 0) {
        return res.status(400).json({ success: false, error: 'Orders array is required' });
      }

      await identityDb.query('BEGIN');
      for (const item of orders) {
        await identityDb.query(
          'UPDATE media_streaming_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2 AND service_key = $3;',
          [item.display_order, item.id, serviceKey]
        );
      }
      await identityDb.query('COMMIT');

      return res.json({ success: true, message: `Successfully reordered ${orders.length} items in ${serviceKey}` });
    } catch (err) {
      await identityDb.query('ROLLBACK');
      logger.error('MediaStreamingConsoleController.reorderItems error:', err);
      return res.status(500).json({ success: false, error: 'Failed to reorder items' });
    }
  }

  /**
   * POST /api/media-streaming-console/service/:serviceKey/:id/toggle-freeze
   * Freeze or unfreeze a media item, stream or stem
   */
  async toggleFreeze(req, res) {
    try {
      const { serviceKey, id } = req.params;
      const currentRes = await identityDb.query(
        'SELECT status FROM media_streaming_console_items WHERE id = $1 AND service_key = $2;',
        [id, serviceKey]
      );
      if (currentRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Media item not found' });
      }

      const currentStatus = currentRes.rows[0].status;
      const nextStatus = currentStatus === 'active' ? 'frozen' : 'active';

      const updateRes = await identityDb.query(
        'UPDATE media_streaming_console_items SET status = $1, updated_at = NOW() WHERE id = $2 AND service_key = $3 RETURNING *;',
        [nextStatus, id, serviceKey]
      );

      return res.json({
        success: true,
        item: updateRes.rows[0],
        message: `Item status changed to ${nextStatus.toUpperCase()}`
      });
    } catch (err) {
      logger.error('MediaStreamingConsoleController.toggleFreeze error:', err);
      return res.status(500).json({ success: false, error: 'Failed to toggle freeze state' });
    }
  }

  /**
   * POST /api/media-streaming-console/upload
   * Multipart/form-data media upload saving to public/uploads/media/
   */
  async uploadMedia(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No media file provided' });
      }

      const mediaUrl = `/uploads/media/${req.file.filename}`;
      return res.status(201).json({
        success: true,
        url: mediaUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      });
    } catch (err) {
      logger.error('MediaStreamingConsoleController.uploadMedia error:', err);
      return res.status(500).json({ success: false, error: 'Media upload failed' });
    }
  }

  /**
   * POST /api/media-streaming-console/spawn-console
   * One-Click Console Spawner: register a brand new operational media sub-console
   */
  async spawnConsole(req, res) {
    try {
      const {
        console_name,
        slug,
        service_key,
        description = '',
        config = {}
      } = req.body;

      if (!console_name || !service_key) {
        return res.status(400).json({ success: false, error: 'Console name and service key are required' });
      }

      const consoleSlug = slug || console_name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

      const insertRes = await identityDb.query(
        `INSERT INTO media_streaming_console_spawns 
          (console_name, slug, service_key, description, config, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 'active', NOW(), NOW())
         ON CONFLICT (slug) DO UPDATE SET 
           console_name = EXCLUDED.console_name,
           config = EXCLUDED.config,
           updated_at = NOW()
         RETURNING *;`,
        [console_name, consoleSlug, service_key, description, JSON.stringify(config)]
      );

      return res.status(201).json({
        success: true,
        spawnedConsole: insertRes.rows[0],
        message: `Successfully spawned console: ${console_name}`
      });
    } catch (err) {
      logger.error('MediaStreamingConsoleController.spawnConsole error:', err);
      return res.status(500).json({ success: false, error: 'Failed to spawn console' });
    }
  }

  /**
   * GET /api/media-streaming-console/spawned-consoles
   * List all dynamically spawned media consoles
   */
  async listSpawnedConsoles(req, res) {
    try {
      const { rows } = await identityDb.query(
        'SELECT * FROM media_streaming_console_spawns ORDER BY created_at DESC;'
      );
      return res.json({ success: true, count: rows.length, consoles: rows });
    } catch (err) {
      logger.error('MediaStreamingConsoleController.listSpawnedConsoles error:', err);
      return res.status(500).json({ success: false, error: 'Failed to list spawned consoles' });
    }
  }
}

module.exports = new MediaStreamingConsoleController();
