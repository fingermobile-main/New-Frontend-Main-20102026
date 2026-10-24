/**
 * Subscription Models & Monetization Tiers Console Controller
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'fingermobile_platform_db',
  max: 20,
  idleTimeoutMillis: 30000,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/subscriptions');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `sub_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

exports.uploadMiddleware = upload.single('asset');

exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' OR status = 'draft' THEN 1 END) as frozen_count,
        COALESCE(SUM(subscriber_count), 0) as total_subscribers,
        COALESCE(AVG(monthly_fic), 0) as avg_monthly_fic,
        COALESCE(SUM(target_annual_volume_fic), 0) as target_annual_volume_fic,
        COUNT(DISTINCT category) as total_categories
      FROM platform_subscription_models
    `);

    const categoriesResult = await pool.query(`
      SELECT category, COUNT(*) as count, COALESCE(SUM(subscriber_count), 0) as subscribers
      FROM platform_subscription_models
      GROUP BY category
      ORDER BY count DESC
    `);

    const spawnsResult = await pool.query(`
      SELECT COUNT(*) as total_spawns FROM subscription_models_console_spawns
    `);

    res.json({
      success: true,
      data: {
        summary: statsResult.rows[0],
        categories: categoriesResult.rows,
        totalSpawns: parseInt(spawnsResult.rows[0].total_spawns, 10),
        engine: 'Sovereign Multi-Tier Monetization & Paywall Engine v3.1',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[SubscriptionModelsController] getOverview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = 'SELECT * FROM platform_subscription_models WHERE 1=1';
    const params = [];

    if (category && category !== 'ALL') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR id ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    query += ' ORDER BY sort_order ASC, id ASC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[SubscriptionModelsController] getItems error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM platform_subscription_models WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Subscription model not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SubscriptionModelsController] getItemById error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const {
      id,
      code,
      name,
      category = 'platform',
      monthly_fic = 0,
      annual_fic = 0,
      monthly_ngn = 0,
      annual_ngn = 0,
      is_free_tier = false,
      badge = 'Standard',
      description = '',
      features = '[]',
      subscriber_count = 0,
      target_annual_volume_fic = 0
    } = req.body;

    const finalId = id || code || `sub_${Date.now()}`;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const maxOrderRes = await pool.query('SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM platform_subscription_models');
    const sortOrder = maxOrderRes.rows[0].next_order;

    const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;

    const insertResult = await pool.query(`
      INSERT INTO platform_subscription_models (
        id, name, category, monthly_fic, annual_fic, monthly_ngn, annual_ngn,
        is_free_tier, badge, description, features, subscriber_count, target_annual_volume_fic, sort_order
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13, $14
      ) RETURNING *
    `, [
      finalId, name, category, monthly_fic, annual_fic, monthly_ngn, annual_ngn,
      is_free_tier, badge, description, JSON.stringify(parsedFeatures), subscriber_count,
      target_annual_volume_fic, sortOrder
    ]);

    res.status(201).json({ success: true, data: insertResult.rows[0] });
  } catch (error) {
    console.error('[SubscriptionModelsController] createItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      monthly_fic,
      annual_fic,
      monthly_ngn,
      annual_ngn,
      is_free_tier,
      badge,
      description,
      features,
      subscriber_count,
      target_annual_volume_fic
    } = req.body;

    const result = await pool.query(`
      UPDATE platform_subscription_models
      SET
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        monthly_fic = COALESCE($3, monthly_fic),
        annual_fic = COALESCE($4, annual_fic),
        monthly_ngn = COALESCE($5, monthly_ngn),
        annual_ngn = COALESCE($6, annual_ngn),
        is_free_tier = COALESCE($7, is_free_tier),
        badge = COALESCE($8, badge),
        description = COALESCE($9, description),
        features = COALESCE($10, features),
        subscriber_count = COALESCE($11, subscriber_count),
        target_annual_volume_fic = COALESCE($12, target_annual_volume_fic),
        updated_at = NOW()
      WHERE id = $13
      RETURNING *
    `, [
      name, category, monthly_fic, annual_fic, monthly_ngn, annual_ngn,
      is_free_tier, badge, description, features ? JSON.stringify(features) : null,
      subscriber_count, target_annual_volume_fic, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Subscription model not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SubscriptionModelsController] updateItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM platform_subscription_models WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Subscription model not found' });
    }
    res.json({ success: true, message: 'Subscription model deleted', id });
  } catch (error) {
    console.error('[SubscriptionModelsController] deleteItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      UPDATE platform_subscription_models
      SET status = CASE WHEN status = 'active' THEN 'frozen' ELSE 'active' END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Subscription model not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SubscriptionModelsController] toggleFreeze error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { sourceId, targetId } = req.body;
    if (!sourceId || !targetId) {
      return res.status(400).json({ success: false, error: 'sourceId and targetId are required' });
    }

    await client.query('BEGIN');

    const sourceRes = await client.query('SELECT sort_order FROM platform_subscription_models WHERE id = $1', [sourceId]);
    const targetRes = await client.query('SELECT sort_order FROM platform_subscription_models WHERE id = $1', [targetId]);

    if (sourceRes.rows.length === 0 || targetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Items not found for reordering' });
    }

    const sourceOrder = sourceRes.rows[0].sort_order;
    const targetOrder = targetRes.rows[0].sort_order;

    await client.query('UPDATE platform_subscription_models SET sort_order = $1 WHERE id = $2', [targetOrder, sourceId]);
    await client.query('UPDATE platform_subscription_models SET sort_order = $1 WHERE id = $2', [sourceOrder, targetId]);

    await client.query('COMMIT');

    const items = await pool.query('SELECT * FROM platform_subscription_models ORDER BY sort_order ASC, id ASC');
    res.json({ success: true, data: items.rows });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[SubscriptionModelsController] reorderItems error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
};

exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No asset uploaded' });
    }

    const assetUrl = `/uploads/subscriptions/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        asset_url: assetUrl,
        filename: req.file.filename,
        size_bytes: req.file.size
      }
    });
  } catch (error) {
    console.error('[SubscriptionModelsController] uploadAsset error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subscription_models_console_spawns ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[SubscriptionModelsController] getSpawns error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createSpawn = async (req, res) => {
  try {
    const { sub_console_name, slug, endpoint, category } = req.body;
    if (!sub_console_name || !slug) {
      return res.status(400).json({ success: false, error: 'Console name and slug are required' });
    }

    const result = await pool.query(`
      INSERT INTO subscription_models_console_spawns (sub_console_name, slug, endpoint, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [sub_console_name, slug, endpoint || `/api/subscription-models-console/spawns/${slug}`, category || 'Platform Tier']);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SubscriptionModelsController] createSpawn error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
