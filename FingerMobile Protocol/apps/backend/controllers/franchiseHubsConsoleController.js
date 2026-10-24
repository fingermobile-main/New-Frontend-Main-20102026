/**
 * Franchise & Regional Hubs Management Console Controller
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 * Phase 15: Regional Licensing, Territorial Geo-Zones, Merchant Accreditation & Tax Compliance
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
    const uploadPath = path.join(__dirname, '../public/uploads/franchise');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `fran_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for franchise charters & certificates
});

exports.uploadMiddleware = upload.single('asset');

exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(merchants), 0) as total_merchants,
        COALESCE(AVG(revenue_share_pct), 10.0) as avg_revenue_share_pct,
        COUNT(DISTINCT territory) as total_territories,
        COUNT(DISTINCT currency) as total_currencies
      FROM franchise_hubs_console_items
    `);

    const categoriesResult = await pool.query(`
      SELECT category, COUNT(*) as count, COALESCE(SUM(merchants), 0) as merchants
      FROM franchise_hubs_console_items
      GROUP BY category
      ORDER BY count DESC
    `);

    const spawnsCount = await pool.query('SELECT COUNT(*) as total FROM franchise_hubs_console_spawns');

    return res.json({
      success: true,
      data: {
        summary: statsResult.rows[0],
        categories: categoriesResult.rows,
        totalSpawns: parseInt(spawnsCount.rows[0]?.total || 0, 10),
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Error fetching franchise hubs overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = 'SELECT * FROM franchise_hubs_console_items WHERE 1=1';
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
      query += ` AND (name ILIKE $${params.length} OR code ILIKE $${params.length} OR territory ILIKE $${params.length})`;
    }

    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query, params);
    return res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (err) {
    console.error('Error fetching franchise items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM franchise_hubs_console_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Franchise hub item not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching franchise item by id:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      category,
      territory,
      merchants,
      revenue_share_pct,
      tax_compliance_status,
      currency,
      status
    } = req.body;

    if (!code || !name || !category || !territory) {
      return res.status(400).json({
        success: false,
        message: 'code, name, category, and territory are required fields'
      });
    }

    const orderRes = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM franchise_hubs_console_items');
    const nextOrder = orderRes.rows[0].next_order;

    const insertResult = await pool.query(`
      INSERT INTO franchise_hubs_console_items (
        code, name, description, category, territory, merchants,
        revenue_share_pct, tax_compliance_status, currency, status, display_order, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *
    `, [
      code,
      name,
      description || '',
      category,
      territory,
      parseInt(merchants || 0, 10),
      parseFloat(revenue_share_pct || 10.0),
      tax_compliance_status || 'Compliant',
      currency || 'NGN',
      status || 'active',
      nextOrder
    ]);

    return res.status(201).json({
      success: true,
      message: 'Franchise hub created successfully',
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating franchise item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      territory,
      merchants,
      revenue_share_pct,
      tax_compliance_status,
      currency,
      status
    } = req.body;

    const updateResult = await pool.query(`
      UPDATE franchise_hubs_console_items SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        territory = COALESCE($4, territory),
        merchants = COALESCE($5, merchants),
        revenue_share_pct = COALESCE($6, revenue_share_pct),
        tax_compliance_status = COALESCE($7, tax_compliance_status),
        currency = COALESCE($8, currency),
        status = COALESCE($9, status),
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      name,
      description,
      category,
      territory,
      merchants !== undefined ? parseInt(merchants, 10) : null,
      revenue_share_pct !== undefined ? parseFloat(revenue_share_pct) : null,
      tax_compliance_status,
      currency,
      status,
      id
    ]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Franchise hub item not found' });
    }

    return res.json({
      success: true,
      message: 'Franchise hub updated successfully',
      data: updateResult.rows[0]
    });
  } catch (err) {
    console.error('Error updating franchise item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await pool.query('DELETE FROM franchise_hubs_console_items WHERE id = $1 RETURNING id', [id]);
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Franchise hub item not found' });
    }
    return res.json({ success: true, message: 'Franchise hub deleted successfully', id });
  } catch (err) {
    console.error('Error deleting franchise item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const itemRes = await pool.query('SELECT status FROM franchise_hubs_console_items WHERE id = $1', [id]);
    if (itemRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Franchise hub not found' });
    }

    const currentStatus = itemRes.rows[0].status;
    const nextStatus = currentStatus === 'active' ? 'frozen' : 'active';

    const result = await pool.query(`
      UPDATE franchise_hubs_console_items
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [nextStatus, id]);

    return res.json({
      success: true,
      message: `Franchise hub is now ${nextStatus}`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error toggling freeze state on franchise item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { sourceId, targetId } = req.body;
    if (!sourceId || !targetId) {
      return res.status(400).json({ success: false, message: 'sourceId and targetId are required for reordering' });
    }

    await client.query('BEGIN');

    const sourceRes = await client.query('SELECT id, display_order FROM franchise_hubs_console_items WHERE id = $1', [sourceId]);
    const targetRes = await client.query('SELECT id, display_order FROM franchise_hubs_console_items WHERE id = $1', [targetId]);

    if (sourceRes.rows.length === 0 || targetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'One or both items not found' });
    }

    const sourceOrder = sourceRes.rows[0].display_order;
    const targetOrder = targetRes.rows[0].display_order;

    await client.query('UPDATE franchise_hubs_console_items SET display_order = $2, updated_at = NOW() WHERE id = $1', [sourceId, targetOrder]);
    await client.query('UPDATE franchise_hubs_console_items SET display_order = $2, updated_at = NOW() WHERE id = $1', [targetId, sourceOrder]);

    await client.query('COMMIT');

    const allItems = await client.query('SELECT * FROM franchise_hubs_console_items ORDER BY display_order ASC');
    return res.json({
      success: true,
      message: 'Franchise hubs reordered successfully in transaction',
      data: allItems.rows
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in reordering franchise items:', err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

exports.uploadAsset = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const assetUrl = `/uploads/franchise/${req.file.filename}`;

    if (id) {
      await pool.query(`
        UPDATE franchise_hubs_console_items
        SET asset_url = $1, updated_at = NOW()
        WHERE id = $2
      `, [assetUrl, id]);
    }

    return res.json({
      success: true,
      message: 'Franchise asset uploaded directly to server with zero localStorage fallback',
      asset_url: assetUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Error uploading franchise asset:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM franchise_hubs_console_spawns ORDER BY created_at DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching franchise spawns:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSpawn = async (req, res) => {
  try {
    const { sub_console_name, slug, endpoint, category } = req.body;
    if (!sub_console_name || !slug || !endpoint) {
      return res.status(400).json({
        success: false,
        message: 'sub_console_name, slug, and endpoint are required'
      });
    }

    const result = await pool.query(`
      INSERT INTO franchise_hubs_console_spawns (
        parent_console, sub_console_name, slug, endpoint, category, status, created_at
      ) VALUES ('franchise-hubs-console', $1, $2, $3, $4, 'active', NOW())
      RETURNING *
    `, [sub_console_name, slug, endpoint, category || 'Regional Hub']);

    return res.status(201).json({
      success: true,
      message: `Sub-Console "${sub_console_name}" spawned and registered in PostgreSQL`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error spawning franchise sub-console:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
