/**
 * Sound River & Sound Ocean Sonic Console Controller
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 * Phase 18: 320kbps Sonic River, 192kHz Audiophile FLAC, Spatial 3D Audio & African Voice Engine
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
    const uploadPath = path.join(__dirname, '../public/uploads/sonic');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `sonic_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for FLAC master audio files & stems
});

exports.uploadMiddleware = upload.single('asset');

exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(MAX(bitrate_kbps), 9216) as max_bitrate_kbps,
        COALESCE(MAX(sample_rate_khz), 192) as max_sample_rate_khz,
        COALESCE(AVG(latency_ms), 20) as avg_latency_ms
      FROM sound_sonic_console_items
    `);

    const categoriesResult = await pool.query(`
      SELECT category, COUNT(*) as count, COALESCE(AVG(bitrate_kbps), 0) as avg_bitrate
      FROM sound_sonic_console_items
      GROUP BY category
      ORDER BY count DESC
    `);

    const spawnsCount = await pool.query('SELECT COUNT(*) as total FROM sound_sonic_console_spawns');

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
    console.error('Error fetching sound sonic overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = 'SELECT * FROM sound_sonic_console_items WHERE 1=1';
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
      query += ` AND (name ILIKE $${params.length} OR code ILIKE $${params.length} OR category ILIKE $${params.length})`;
    }

    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query, params);
    return res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (err) {
    console.error('Error fetching sound sonic items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM sound_sonic_console_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sound sonic item not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching sound sonic item by id:', err);
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
      bitrate_kbps,
      sample_rate_khz,
      latency_ms,
      channels,
      status
    } = req.body;

    if (!code || !name || !category) {
      return res.status(400).json({
        success: false,
        message: 'code, name, and category are required fields'
      });
    }

    const orderRes = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM sound_sonic_console_items');
    const nextOrder = orderRes.rows[0].next_order;

    const insertResult = await pool.query(`
      INSERT INTO sound_sonic_console_items (
        code, name, description, category, bitrate_kbps,
        sample_rate_khz, latency_ms, channels, status, display_order, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `, [
      code,
      name,
      description || '',
      category,
      parseInt(bitrate_kbps || 320, 10),
      parseInt(sample_rate_khz || 48, 10),
      parseInt(latency_ms || 20, 10),
      parseInt(channels || 2, 10),
      status || 'active',
      nextOrder
    ]);

    return res.status(201).json({
      success: true,
      message: 'Sound sonic channel created successfully',
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating sound sonic item:', err);
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
      bitrate_kbps,
      sample_rate_khz,
      latency_ms,
      channels,
      status
    } = req.body;

    const updateResult = await pool.query(`
      UPDATE sound_sonic_console_items SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        bitrate_kbps = COALESCE($4, bitrate_kbps),
        sample_rate_khz = COALESCE($5, sample_rate_khz),
        latency_ms = COALESCE($6, latency_ms),
        channels = COALESCE($7, channels),
        status = COALESCE($8, status),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `, [
      name,
      description,
      category,
      bitrate_kbps !== undefined ? parseInt(bitrate_kbps, 10) : null,
      sample_rate_khz !== undefined ? parseInt(sample_rate_khz, 10) : null,
      latency_ms !== undefined ? parseInt(latency_ms, 10) : null,
      channels !== undefined ? parseInt(channels, 10) : null,
      status,
      id
    ]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sound sonic item not found' });
    }

    return res.json({
      success: true,
      message: 'Sound sonic channel updated successfully',
      data: updateResult.rows[0]
    });
  } catch (err) {
    console.error('Error updating sound sonic item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await pool.query('DELETE FROM sound_sonic_console_items WHERE id = $1 RETURNING id', [id]);
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sound sonic item not found' });
    }
    return res.json({ success: true, message: 'Sound sonic channel deleted successfully', id });
  } catch (err) {
    console.error('Error deleting sound sonic item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const itemRes = await pool.query('SELECT status FROM sound_sonic_console_items WHERE id = $1', [id]);
    if (itemRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sound sonic channel not found' });
    }

    const currentStatus = itemRes.rows[0].status;
    const nextStatus = currentStatus === 'active' ? 'frozen' : 'active';

    const result = await pool.query(`
      UPDATE sound_sonic_console_items
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [nextStatus, id]);

    return res.json({
      success: true,
      message: `Sound sonic channel is now ${nextStatus}`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error toggling freeze state on sound sonic item:', err);
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

    const sourceRes = await client.query('SELECT id, display_order FROM sound_sonic_console_items WHERE id = $1', [sourceId]);
    const targetRes = await client.query('SELECT id, display_order FROM sound_sonic_console_items WHERE id = $1', [targetId]);

    if (sourceRes.rows.length === 0 || targetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'One or both items not found' });
    }

    const sourceOrder = sourceRes.rows[0].display_order;
    const targetOrder = targetRes.rows[0].display_order;

    await client.query('UPDATE sound_sonic_console_items SET display_order = $2, updated_at = NOW() WHERE id = $1', [sourceId, targetOrder]);
    await client.query('UPDATE sound_sonic_console_items SET display_order = $2, updated_at = NOW() WHERE id = $1', [targetId, sourceOrder]);

    await client.query('COMMIT');

    const allItems = await client.query('SELECT * FROM sound_sonic_console_items ORDER BY display_order ASC');
    return res.json({
      success: true,
      message: 'Sound sonic channels reordered successfully in transaction',
      data: allItems.rows
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in reordering sound sonic items:', err);
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

    const assetUrl = `/uploads/sonic/${req.file.filename}`;

    if (id) {
      await pool.query(`
        UPDATE sound_sonic_console_items
        SET asset_url = $1, updated_at = NOW()
        WHERE id = $2
      `, [assetUrl, id]);
    }

    return res.json({
      success: true,
      message: 'Sonic master stem / FLAC audio ingested directly to server with zero localStorage fallback',
      asset_url: assetUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Error uploading sonic asset:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sound_sonic_console_spawns ORDER BY created_at DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching sound sonic spawns:', err);
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
      INSERT INTO sound_sonic_console_spawns (
        parent_console, sub_console_name, slug, endpoint, category, status, created_at
      ) VALUES ('sound-sonic-console', $1, $2, $3, $4, 'active', NOW())
      RETURNING *
    `, [sub_console_name, slug, endpoint, category || 'Sonic Stream']);

    return res.status(201).json({
      success: true,
      message: `Sub-Console "${sub_console_name}" spawned and registered in PostgreSQL`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error spawning sound sonic sub-console:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
