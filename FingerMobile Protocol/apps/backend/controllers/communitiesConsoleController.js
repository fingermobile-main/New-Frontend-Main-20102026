const { identityDb } = require('../db/db');
const logger = require('../config/logger');

class CommunitiesConsoleController {
  /**
   * GET /api/communities-console/overview
   * Returns health, counts, and active telemetry for all 11 community domains
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
          COALESCE(SUM(fic_bounty), 0) as total_bounty_fic
        FROM communities_console_items
        GROUP BY service_key;
      `;

      const { rows } = await identityDb.query(summaryQuery);

      const services = [
        'forum', 'mii', 'fingershorts', 'groups', 'gems',
        'blogs', 'hallmarks', 'discover', 'discovery', 'tribute', 'trends'
      ];

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
          healthScore: found && found.frozen_items > 0 ? 92 : 99,
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
      logger.error('CommunitiesConsoleController.getOverview error:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch community console overview' });
    }
  }

  /**
   * GET /api/communities-console/service/:serviceKey
   * Get paginated items for a specific community service with search and category filters
   */
  async getServiceItems(req, res) {
    try {
      const { serviceKey } = req.params;
      const { search, status, category, limit = 50, offset = 0 } = req.query;

      let query = `
        SELECT *
        FROM communities_console_items
        WHERE service_key = $1
      `;
      const params = [serviceKey];

      if (status && status !== 'all') {
        params.push(status);
        query += ` AND status = $${params.length}`;
      }

      if (category && category !== 'all') {
        params.push(category);
        query += ` AND category = $${params.length}`;
      }

      if (search && search.trim()) {
        params.push(`%${search.trim().toLowerCase()}%`);
        query += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(slug) LIKE $${params.length})`;
      }

      query += ` ORDER BY display_order ASC, created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2};`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const { rows } = await identityDb.query(query, params);

      // Total count query
      let countQuery = 'SELECT COUNT(*) as total FROM communities_console_items WHERE service_key = $1';
      const countParams = [serviceKey];
      if (status && status !== 'all') {
        countParams.push(status);
        countQuery += ` AND status = $${countParams.length}`;
      }
      if (category && category !== 'all') {
        countParams.push(category);
        countQuery += ` AND category = $${countParams.length}`;
      }
      if (search && search.trim()) {
        countParams.push(`%${search.trim().toLowerCase()}%`);
        countQuery += ` AND (LOWER(title) LIKE $${countParams.length} OR LOWER(description) LIKE $${countParams.length})`;
      }

      const countResult = await identityDb.query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0]?.total || '0', 10);

      return res.json({
        success: true,
        serviceKey,
        total: totalCount,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        items: rows
      });
    } catch (err) {
      logger.error('CommunitiesConsoleController.getServiceItems error:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch service items' });
    }
  }

  /**
   * POST /api/communities-console/service/:serviceKey
   * Create a new item for a community service
   */
  async createItem(req, res) {
    try {
      const { serviceKey } = req.params;
      const {
        title,
        slug,
        category = 'General',
        description = '',
        media_url = '',
        media_type = 'image',
        status = 'active',
        fic_bounty = 0,
        tags = [],
        voice_prompt = '',
        author_name = 'Platform Admin'
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, error: 'Title is required' });
      }

      // Compute display order (highest + 1)
      const orderRes = await identityDb.query(
        'SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM communities_console_items WHERE service_key = $1;',
        [serviceKey]
      );
      const display_order = orderRes.rows[0]?.next_order || 1;

      const generatedSlug = slug && slug.trim()
        ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const insertQuery = `
        INSERT INTO communities_console_items (
          service_key, title, slug, category, description,
          media_url, media_type, status, display_order, fic_bounty,
          tags, voice_prompt, author_name, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
        RETURNING *;
      `;

      const values = [
        serviceKey,
        title.trim(),
        generatedSlug,
        category,
        description,
        media_url,
        media_type,
        status,
        display_order,
        fic_bounty,
        Array.isArray(tags) ? tags : [],
        voice_prompt,
        author_name
      ];

      const { rows } = await identityDb.query(insertQuery, values);
      return res.status(201).json({ success: true, item: rows[0] });
    } catch (err) {
      logger.error('CommunitiesConsoleController.createItem error:', err);
      return res.status(500).json({ success: false, error: 'Failed to create community item' });
    }
  }

  /**
   * PUT /api/communities-console/service/:serviceKey/:id
   * Update item metadata, status, tags, and bounties
   */
  async updateItem(req, res) {
    try {
      const { serviceKey, id } = req.params;
      const {
        title,
        slug,
        category,
        description,
        media_url,
        media_type,
        status,
        fic_bounty,
        tags,
        voice_prompt,
        display_order
      } = req.body;

      const currentRes = await identityDb.query(
        'SELECT * FROM communities_console_items WHERE id = $1 AND service_key = $2;',
        [id, serviceKey]
      );
      if (currentRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }

      const curr = currentRes.rows[0];

      const updateQuery = `
        UPDATE communities_console_items
        SET 
          title = $1,
          slug = $2,
          category = $3,
          description = $4,
          media_url = $5,
          media_type = $6,
          status = $7,
          fic_bounty = $8,
          tags = $9,
          voice_prompt = $10,
          display_order = $11,
          updated_at = NOW()
        WHERE id = $12 AND service_key = $13
        RETURNING *;
      `;

      const values = [
        title !== undefined ? title : curr.title,
        slug !== undefined ? slug : curr.slug,
        category !== undefined ? category : curr.category,
        description !== undefined ? description : curr.description,
        media_url !== undefined ? media_url : curr.media_url,
        media_type !== undefined ? media_type : curr.media_type,
        status !== undefined ? status : curr.status,
        fic_bounty !== undefined ? fic_bounty : curr.fic_bounty,
        tags !== undefined ? (Array.isArray(tags) ? tags : curr.tags) : curr.tags,
        voice_prompt !== undefined ? voice_prompt : curr.voice_prompt,
        display_order !== undefined ? display_order : curr.display_order,
        id,
        serviceKey
      ];

      const { rows } = await identityDb.query(updateQuery, values);
      return res.json({ success: true, item: rows[0] });
    } catch (err) {
      logger.error('CommunitiesConsoleController.updateItem error:', err);
      return res.status(500).json({ success: false, error: 'Failed to update community item' });
    }
  }

  /**
   * DELETE /api/communities-console/service/:serviceKey/:id
   * Delete or archive an item
   */
  async deleteItem(req, res) {
    try {
      const { serviceKey, id } = req.params;
      const result = await identityDb.query(
        'DELETE FROM communities_console_items WHERE id = $1 AND service_key = $2 RETURNING id;',
        [id, serviceKey]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }
      return res.json({ success: true, message: `Item ${id} deleted successfully` });
    } catch (err) {
      logger.error('CommunitiesConsoleController.deleteItem error:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete community item' });
    }
  }

  /**
   * POST /api/communities-console/service/:serviceKey/reorder
   * Rearrange items up/down by setting new display_order
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
          'UPDATE communities_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2 AND service_key = $3;',
          [item.display_order, item.id, serviceKey]
        );
      }
      await identityDb.query('COMMIT');

      return res.json({ success: true, message: `Successfully reordered ${orders.length} items in ${serviceKey}` });
    } catch (err) {
      await identityDb.query('ROLLBACK');
      logger.error('CommunitiesConsoleController.reorderItems error:', err);
      return res.status(500).json({ success: false, error: 'Failed to reorder items' });
    }
  }

  /**
   * POST /api/communities-console/service/:serviceKey/:id/toggle-freeze
   * Freeze or unfreeze an item or microservice category
   */
  async toggleFreeze(req, res) {
    try {
      const { serviceKey, id } = req.params;
      const currentRes = await identityDb.query(
        'SELECT status FROM communities_console_items WHERE id = $1 AND service_key = $2;',
        [id, serviceKey]
      );
      if (currentRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }

      const currentStatus = currentRes.rows[0].status;
      const nextStatus = currentStatus === 'frozen' ? 'active' : 'frozen';

      const updateRes = await identityDb.query(
        'UPDATE communities_console_items SET status = $1, updated_at = NOW() WHERE id = $2 AND service_key = $3 RETURNING *;',
        [nextStatus, id, serviceKey]
      );

      return res.json({
        success: true,
        item: updateRes.rows[0],
        message: `Item status changed to ${nextStatus.toUpperCase()}`
      });
    } catch (err) {
      logger.error('CommunitiesConsoleController.toggleFreeze error:', err);
      return res.status(500).json({ success: false, error: 'Failed to toggle freeze state' });
    }
  }

  /**
   * POST /api/communities-console/upload
   * Multipart/form-data media upload
   */
  async uploadMedia(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No media file provided' });
      }

      const mediaUrl = `/uploads/communities/${req.file.filename}`;
      return res.status(201).json({
        success: true,
        url: mediaUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      });
    } catch (err) {
      logger.error('CommunitiesConsoleController.uploadMedia error:', err);
      return res.status(500).json({ success: false, error: 'Media upload failed' });
    }
  }

  /**
   * POST /api/communities-console/spawn-console
   * One-Click Console Spawner: register a brand new operational console
   */
  async spawnConsole(req, res) {
    try {
      const {
        console_id,
        name,
        service_key,
        route,
        description = '',
        icon = 'Layers',
        config = {}
      } = req.body;

      if (!console_id || !name || !service_key || !route) {
        return res.status(400).json({ success: false, error: 'console_id, name, service_key, and route are required' });
      }

      const insertQuery = `
        INSERT INTO communities_console_spawns (console_id, name, service_key, route, description, icon, config)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (console_id) DO UPDATE SET
          name = EXCLUDED.name,
          route = EXCLUDED.route,
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          config = EXCLUDED.config
        RETURNING *;
      `;

      const { rows } = await identityDb.query(insertQuery, [
        console_id,
        name,
        service_key,
        route,
        description,
        icon,
        JSON.stringify(config)
      ]);

      return res.status(201).json({
        success: true,
        console: rows[0],
        message: `Successfully spawned new operational console: ${name}`
      });
    } catch (err) {
      logger.error('CommunitiesConsoleController.spawnConsole error:', err);
      return res.status(500).json({ success: false, error: 'Failed to spawn console' });
    }
  }

  /**
   * GET /api/communities-console/spawns
   * Returns all dynamically spawned consoles
   */
  async getSpawnedConsoles(req, res) {
    try {
      const { rows } = await identityDb.query(
        'SELECT * FROM communities_console_spawns ORDER BY created_at DESC;'
      );
      return res.json({ success: true, consoles: rows });
    } catch (err) {
      logger.error('CommunitiesConsoleController.getSpawnedConsoles error:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch spawned consoles' });
    }
  }
}

module.exports = new CommunitiesConsoleController();
