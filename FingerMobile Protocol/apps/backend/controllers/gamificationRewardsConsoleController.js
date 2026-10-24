/**
 * Gamification, Quests & Rewards Citadel Console Controller
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 * Phase 20: XP Multipliers, Badge Minting, Seasonal Quest Ladders, Login Streaks & FIC Reward Pools
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
    const uploadPath = path.join(__dirname, '../public/uploads/rewards');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `reward_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 } // 40MB limit for badge art, trophy 3D models and sound stems
});

exports.uploadMiddleware = upload.single('asset');

exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(total_participants), 0) as total_participants,
        COALESCE(SUM(reward_budget_fic), 0) as total_reward_budget_fic,
        COALESCE(MAX(multiplier_cap), 25.0) as peak_multiplier_cap
      FROM gamification_rewards_console_items
    `);

    const categoriesResult = await pool.query(`
      SELECT category, COUNT(*) as count, COALESCE(SUM(reward_budget_fic), 0) as total_budget
      FROM gamification_rewards_console_items
      GROUP BY category
      ORDER BY count DESC
    `);

    const spawnsCount = await pool.query('SELECT COUNT(*) as total FROM gamification_rewards_console_spawns');

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
    console.error('Error fetching gamification rewards overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = 'SELECT * FROM gamification_rewards_console_items WHERE 1=1';
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
    console.error('Error fetching gamification rewards items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM gamification_rewards_console_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reward item not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching reward item by id:', err);
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
      multiplier_cap,
      total_participants,
      reward_budget_fic,
      status
    } = req.body;

    if (!code || !name || !category) {
      return res.status(400).json({
        success: false,
        message: 'code, name, and category are required fields'
      });
    }

    const orderRes = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM gamification_rewards_console_items');
    const nextOrder = orderRes.rows[0].next_order;

    const insertResult = await pool.query(`
      INSERT INTO gamification_rewards_console_items (
        code, name, description, category, multiplier_cap,
        total_participants, reward_budget_fic, status, display_order, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      code,
      name,
      description || '',
      category,
      parseFloat(multiplier_cap || 5.0),
      parseInt(total_participants || 10000, 10),
      parseFloat(reward_budget_fic || 50000.0),
      status || 'active',
      nextOrder
    ]);

    return res.status(201).json({
      success: true,
      message: 'Gamification reward module created successfully',
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating gamification rewards item:', err);
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
      multiplier_cap,
      total_participants,
      reward_budget_fic,
      status
    } = req.body;

    const updateResult = await pool.query(`
      UPDATE gamification_rewards_console_items SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        multiplier_cap = COALESCE($4, multiplier_cap),
        total_participants = COALESCE($5, total_participants),
        reward_budget_fic = COALESCE($6, reward_budget_fic),
        status = COALESCE($7, status),
        updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [
      name,
      description,
      category,
      multiplier_cap !== undefined ? parseFloat(multiplier_cap) : null,
      total_participants !== undefined ? parseInt(total_participants, 10) : null,
      reward_budget_fic !== undefined ? parseFloat(reward_budget_fic) : null,
      status,
      id
    ]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reward item not found' });
    }

    return res.json({
      success: true,
      message: 'Gamification reward module updated successfully',
      data: updateResult.rows[0]
    });
  } catch (err) {
    console.error('Error updating gamification rewards item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await pool.query('DELETE FROM gamification_rewards_console_items WHERE id = $1 RETURNING id', [id]);
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reward item not found' });
    }
    return res.json({ success: true, message: 'Gamification reward module deleted successfully', id });
  } catch (err) {
    console.error('Error deleting gamification rewards item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const itemRes = await pool.query('SELECT status FROM gamification_rewards_console_items WHERE id = $1', [id]);
    if (itemRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reward module not found' });
    }

    const currentStatus = itemRes.rows[0].status;
    const nextStatus = currentStatus === 'active' ? 'frozen' : 'active';

    const result = await pool.query(`
      UPDATE gamification_rewards_console_items
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [nextStatus, id]);

    return res.json({
      success: true,
      message: `Gamification reward module is now ${nextStatus}`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error toggling freeze state on reward item:', err);
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

    const sourceRes = await client.query('SELECT id, display_order FROM gamification_rewards_console_items WHERE id = $1', [sourceId]);
    const targetRes = await client.query('SELECT id, display_order FROM gamification_rewards_console_items WHERE id = $1', [targetId]);

    if (sourceRes.rows.length === 0 || targetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'One or both items not found' });
    }

    const sourceOrder = sourceRes.rows[0].display_order;
    const targetOrder = targetRes.rows[0].display_order;

    await client.query('UPDATE gamification_rewards_console_items SET display_order = $2, updated_at = NOW() WHERE id = $1', [sourceId, targetOrder]);
    await client.query('UPDATE gamification_rewards_console_items SET display_order = $2, updated_at = NOW() WHERE id = $1', [targetId, sourceOrder]);

    await client.query('COMMIT');

    const allItems = await client.query('SELECT * FROM gamification_rewards_console_items ORDER BY display_order ASC');
    return res.json({
      success: true,
      message: 'Gamification reward modules reordered successfully in transaction',
      data: allItems.rows
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in reordering reward items:', err);
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

    const assetUrl = `/uploads/rewards/${req.file.filename}`;

    if (id) {
      await pool.query(`
        UPDATE gamification_rewards_console_items
        SET asset_url = $1, updated_at = NOW()
        WHERE id = $2
      `, [assetUrl, id]);
    }

    return res.json({
      success: true,
      message: 'Badge/Trophy art ingested directly to server with zero localStorage fallback',
      asset_url: assetUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Error uploading reward asset:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gamification_rewards_console_spawns ORDER BY created_at DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching reward spawns:', err);
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
      INSERT INTO gamification_rewards_console_spawns (
        parent_console, sub_console_name, slug, endpoint, category, status, created_at
      ) VALUES ('gamification-rewards-console', $1, $2, $3, $4, 'active', NOW())
      RETURNING *
    `, [sub_console_name, slug, endpoint, category || 'Rewards Ladder']);

    return res.status(201).json({
      success: true,
      message: `Sub-Console "${sub_console_name}" spawned and registered in PostgreSQL`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error spawning reward sub-console:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
