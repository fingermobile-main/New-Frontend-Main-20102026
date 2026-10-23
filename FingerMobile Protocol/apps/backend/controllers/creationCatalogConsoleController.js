/**
 * Creation, Widgets, Screen Catalog & Subscriptions Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 4: Screen Catalog Management, Rotational Rails (2h widgets), Subscriptions Matrix, Guardian AI SEO Indexer & Dynamic File Routing
 */

const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Reusable pool matching backend database environment
const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'fingermobile_platform_db',
  max: 20,
  idleTimeoutMillis: 30000,
});

// Multer storage for screen screenshots, widget artwork, subscription badges, SEO sitemaps
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/catalog');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `cat_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 } // 40MB limit for high-res screen mockups
});

const VALID_DOMAINS = [
  'screen_catalog_management',
  'rotational_rails_widgets',
  'subscriptions_tier_matrix',
  'guardian_ai_seo_indexer',
  'dynamic_media_file_routing',
  'custom_console_builder'
];

/**
 * GET /api/creation-catalog-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COUNT(CASE WHEN domain = 'screen_catalog_management' THEN 1 END) as total_screens,
        COUNT(CASE WHEN domain = 'rotational_rails_widgets' THEN 1 END) as total_rotational_rails,
        COUNT(CASE WHEN domain = 'subscriptions_tier_matrix' THEN 1 END) as total_subscription_tiers,
        COALESCE(AVG(seo_index_score), 100) as average_seo_score,
        COALESCE(SUM(tier_pricing_fic), 0) as total_tier_pricing_fic
      FROM creation_catalog_console_items
    `);

    const domainBreakdown = await pool.query(`
      SELECT
        domain,
        COUNT(*) as count,
        COALESCE(SUM(tier_pricing_fic), 0) as domain_fic,
        COALESCE(AVG(seo_index_score), 100) as avg_seo
      FROM creation_catalog_console_items
      GROUP BY domain
      ORDER BY count DESC
    `);

    const spawnsCount = await pool.query(`SELECT COUNT(*) as total FROM creation_catalog_console_spawns`);

    return res.json({
      success: true,
      data: {
        summary: statsResult.rows[0],
        domains: domainBreakdown.rows,
        totalSpawns: parseInt(spawnsCount.rows[0]?.total || 0, 10),
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Error fetching creation catalog overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/creation-catalog-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { domain } = req.query;
    let query = 'SELECT * FROM creation_catalog_console_items';
    const params = [];

    if (domain && domain !== 'all') {
      query += ' WHERE domain = $1';
      params.push(domain);
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    const result = await pool.query(query, params);
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching creation catalog items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/creation-catalog-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      domain,
      name,
      code,
      category,
      route_path,
      rotation_hours,
      tier_pricing_fic,
      seo_index_score,
      media_asset_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    if (!domain || !name || !code || !category) {
      return res.status(400).json({
        success: false,
        message: 'Fields domain, name, code, and category are required'
      });
    }

    if (!VALID_DOMAINS.includes(domain)) {
      return res.status(400).json({
        success: false,
        message: `Invalid domain "${domain}". Valid domains: ${VALID_DOMAINS.join(', ')}`
      });
    }

    // Determine next display_order for this domain
    const orderRes = await pool.query(
      'SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM creation_catalog_console_items WHERE domain = $1',
      [domain]
    );
    const nextOrder = orderRes.rows[0].next_order;

    const id = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const insertResult = await pool.query(`
      INSERT INTO creation_catalog_console_items (
        id, domain, name, code, category, status, display_order,
        route_path, rotation_hours, tier_pricing_fic, seo_index_score,
        media_asset_url, voice_tag, notes, metadata,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, 'active', $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        NOW(), NOW()
      ) RETURNING *
    `, [
      id,
      domain,
      name,
      code,
      category,
      nextOrder,
      route_path || null,
      rotation_hours ? parseFloat(rotation_hours) : 2.0,
      tier_pricing_fic ? parseFloat(tier_pricing_fic) : 0.0,
      seo_index_score ? parseFloat(seo_index_score) : 100.0,
      media_asset_url || null,
      voice_tag || 'gbaski',
      notes || null,
      metadata ? JSON.stringify(metadata) : '{}'
    ]);

    return res.status(201).json({
      success: true,
      message: `Catalog asset "${name}" registered into PostgreSQL and pushed live`,
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating creation catalog item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/creation-catalog-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      route_path,
      rotation_hours,
      tier_pricing_fic,
      seo_index_score,
      media_asset_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    const existingRes = await pool.query('SELECT * FROM creation_catalog_console_items WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Catalog item "${id}" not found` });
    }

    const current = existingRes.rows[0];

    const updatedResult = await pool.query(`
      UPDATE creation_catalog_console_items SET
        name = COALESCE($1, name),
        code = COALESCE($2, code),
        category = COALESCE($3, category),
        route_path = COALESCE($4, route_path),
        rotation_hours = COALESCE($5, rotation_hours),
        tier_pricing_fic = COALESCE($6, tier_pricing_fic),
        seo_index_score = COALESCE($7, seo_index_score),
        media_asset_url = COALESCE($8, media_asset_url),
        voice_tag = COALESCE($9, voice_tag),
        notes = COALESCE($10, notes),
        metadata = COALESCE($11, metadata),
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `, [
      name !== undefined ? name : current.name,
      code !== undefined ? code : current.code,
      category !== undefined ? category : current.category,
      route_path !== undefined ? route_path : current.route_path,
      rotation_hours !== undefined ? parseFloat(rotation_hours) : current.rotation_hours,
      tier_pricing_fic !== undefined ? parseFloat(tier_pricing_fic) : current.tier_pricing_fic,
      seo_index_score !== undefined ? parseFloat(seo_index_score) : current.seo_index_score,
      media_asset_url !== undefined ? media_asset_url : current.media_asset_url,
      voice_tag !== undefined ? voice_tag : current.voice_tag,
      notes !== undefined ? notes : current.notes,
      metadata !== undefined ? JSON.stringify(metadata) : current.metadata,
      id
    ]);

    return res.json({
      success: true,
      message: `Catalog asset "${updatedResult.rows[0].name}" updated in PostgreSQL`,
      data: updatedResult.rows[0]
    });
  } catch (err) {
    console.error('Error updating creation catalog item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PATCH /api/creation-catalog-console/items/:id/freeze
 */
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT status, name FROM creation_catalog_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Catalog item "${id}" not found` });
    }

    const currentStatus = existing.rows[0].status;
    const newStatus = currentStatus === 'active' ? 'frozen' : 'active';

    const result = await pool.query(
      'UPDATE creation_catalog_console_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    return res.json({
      success: true,
      message: `Catalog asset "${existing.rows[0].name}" status toggled to "${newStatus}"`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error toggling freeze on creation catalog item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/creation-catalog-console/reorder
 */
exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty orders array' });
    }

    await client.query('BEGIN');
    for (const item of orders) {
      await client.query(
        'UPDATE creation_catalog_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [item.display_order, item.id]
      );
    }
    await client.query('COMMIT');

    return res.json({
      success: true,
      message: `Successfully re-sequenced ${orders.length} catalog items transactionally`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering creation catalog items:', err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

/**
 * DELETE /api/creation-catalog-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT name FROM creation_catalog_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Catalog item "${id}" not found` });
    }

    await pool.query('DELETE FROM creation_catalog_console_items WHERE id = $1', [id]);
    return res.json({
      success: true,
      message: `Purged catalog item "${existing.rows[0].name}" from registry`
    });
  } catch (err) {
    console.error('Error deleting creation catalog item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/creation-catalog-console/upload
 */
exports.uploadMiddleware = upload.single('media');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/catalog/${req.file.filename}`;
    const { itemId, field } = req.body;

    if (itemId) {
      const targetField = field || 'media_asset_url';
      await pool.query(
        `UPDATE creation_catalog_console_items SET ${targetField} = $1, updated_at = NOW() WHERE id = $2`,
        [fileUrl, itemId]
      );
    }

    return res.json({
      success: true,
      message: 'Catalog asset uploaded successfully directly to Express backend',
      data: {
        fileUrl,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (err) {
    console.error('Error uploading catalog media:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/creation-catalog-console/spawns
 */
exports.createSpawn = async (req, res) => {
  try {
    const { console_title, target_domain, icon_name, badge_text, config } = req.body;

    if (!console_title || !target_domain) {
      return res.status(400).json({
        success: false,
        message: 'console_title and target_domain are required'
      });
    }

    const id = `cat_spw_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const routeSlug = console_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const route = `/admin/catalog-console/${routeSlug}`;

    const insertResult = await pool.query(`
      INSERT INTO creation_catalog_console_spawns (
        id, console_title, target_domain, route, icon_name, badge_text, status, config, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 'active', $7, NOW()
      ) RETURNING *
    `, [
      id,
      console_title,
      target_domain,
      route,
      icon_name || 'Layout',
      badge_text || 'SOVEREIGN',
      config ? JSON.stringify(config) : '{}'
    ]);

    return res.status(201).json({
      success: true,
      message: `Creation catalog console "${console_title}" dynamically spawned at ${route}`,
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating creation catalog console spawn:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/creation-catalog-console/spawns
 */
exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM creation_catalog_console_spawns ORDER BY created_at DESC'
    );
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching creation catalog console spawns:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
