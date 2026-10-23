/**
 * Gaming & SuperVi Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 1: SuperVi Game Engine, Physics, Characters, Powerups, Leaderboards, Daily Challenges, Voice Lines
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

// Multer storage for character sprites, 3D glb models & audio stems
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/gaming');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `game_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for high-res sprites and audio stems
});

const VALID_DOMAINS = [
  'supervi_core',
  'characters_roster',
  'powerups_catalog',
  'leaderboards_ranks',
  'daily_challenges',
  'voice_audio_lines'
];

/**
 * GET /api/gaming-supervi-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(reward_fic), 0) as total_fic_rewards,
        COUNT(CASE WHEN domain = 'characters_roster' THEN 1 END) as total_characters,
        COUNT(CASE WHEN domain = 'powerups_catalog' THEN 1 END) as total_powerups,
        COUNT(CASE WHEN domain = 'leaderboards_ranks' THEN 1 END) as total_leaderboards,
        COUNT(CASE WHEN domain = 'daily_challenges' THEN 1 END) as total_challenges
      FROM gaming_supervi_console_items
    `);

    const domainCounts = await pool.query(`
      SELECT domain, COUNT(*) as count,
        COALESCE(SUM(reward_fic), 0) as domain_fic
      FROM gaming_supervi_console_items
      GROUP BY domain
    `);

    const spawnsCount = await pool.query(`SELECT COUNT(*) as count FROM gaming_supervi_console_spawns`);

    return res.status(200).json({
      success: true,
      data: {
        summary: statsResult.rows[0],
        domains: domainCounts.rows,
        totalSpawns: parseInt(spawnsCount.rows[0]?.count || '0', 10),
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('[GamingSuperViConsole] getOverview error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve overview metrics', error: err.message });
  }
};

/**
 * GET /api/gaming-supervi-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { domain } = req.query;
    let query = 'SELECT * FROM gaming_supervi_console_items';
    const params = [];

    if (domain && domain !== 'all') {
      query += ' WHERE domain = $1';
      params.push(domain);
    }

    query += ' ORDER BY domain ASC, display_order ASC, created_at DESC';

    const result = await pool.query(query, params);
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('[GamingSuperViConsole] getItems error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve gaming console items', error: err.message });
  }
};

/**
 * POST /api/gaming-supervi-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      domain,
      name,
      code,
      category,
      reward_fic,
      score_multiplier,
      duration_seconds,
      cooldown_seconds,
      character_asset_url,
      audio_stem_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    if (!domain || !name || !code) {
      return res.status(400).json({ success: false, message: 'Domain, name, and code are required fields' });
    }

    if (!VALID_DOMAINS.includes(domain)) {
      return res.status(400).json({ success: false, message: `Invalid domain. Must be one of: ${VALID_DOMAINS.join(', ')}` });
    }

    const orderRes = await pool.query(
      'SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM gaming_supervi_console_items WHERE domain = $1',
      [domain]
    );
    const display_order = orderRes.rows[0].next_order;
    const id = `game_${domain.slice(0, 4)}_${Date.now()}`;

    const insertQuery = `
      INSERT INTO gaming_supervi_console_items (
        id, domain, name, code, category, status, display_order,
        reward_fic, score_multiplier, duration_seconds, cooldown_seconds,
        character_asset_url, audio_stem_url, voice_tag, notes, metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, 'active', $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      id,
      domain,
      name,
      code,
      category || 'Gameplay Asset',
      display_order,
      parseFloat(reward_fic) || 0,
      parseFloat(score_multiplier) || 1.00,
      parseInt(duration_seconds, 10) || 0,
      parseInt(cooldown_seconds, 10) || 0,
      character_asset_url || null,
      audio_stem_url || null,
      voice_tag || 'sharp',
      notes || '',
      JSON.stringify(metadata || {})
    ];

    const result = await pool.query(insertQuery, values);

    return res.status(201).json({
      success: true,
      message: `Created gaming console item "${name}" successfully`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[GamingSuperViConsole] createItem error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create gaming item', error: err.message });
  }
};

/**
 * PUT /api/gaming-supervi-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      reward_fic,
      score_multiplier,
      duration_seconds,
      cooldown_seconds,
      character_asset_url,
      audio_stem_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    const existing = await pool.query('SELECT * FROM gaming_supervi_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Gaming item with ID "${id}" not found` });
    }

    const item = existing.rows[0];

    const updateQuery = `
      UPDATE gaming_supervi_console_items SET
        name = COALESCE($1, name),
        code = COALESCE($2, code),
        category = COALESCE($3, category),
        reward_fic = COALESCE($4, reward_fic),
        score_multiplier = COALESCE($5, score_multiplier),
        duration_seconds = COALESCE($6, duration_seconds),
        cooldown_seconds = COALESCE($7, cooldown_seconds),
        character_asset_url = COALESCE($8, character_asset_url),
        audio_stem_url = COALESCE($9, audio_stem_url),
        voice_tag = COALESCE($10, voice_tag),
        notes = COALESCE($11, notes),
        metadata = COALESCE($12, metadata),
        updated_at = NOW()
      WHERE id = $13
      RETURNING *
    `;

    const values = [
      name ?? item.name,
      code ?? item.code,
      category ?? item.category,
      reward_fic !== undefined ? parseFloat(reward_fic) : item.reward_fic,
      score_multiplier !== undefined ? parseFloat(score_multiplier) : item.score_multiplier,
      duration_seconds !== undefined ? parseInt(duration_seconds, 10) : item.duration_seconds,
      cooldown_seconds !== undefined ? parseInt(cooldown_seconds, 10) : item.cooldown_seconds,
      character_asset_url !== undefined ? character_asset_url : item.character_asset_url,
      audio_stem_url !== undefined ? audio_stem_url : item.audio_stem_url,
      voice_tag !== undefined ? voice_tag : item.voice_tag,
      notes !== undefined ? notes : item.notes,
      metadata ? JSON.stringify(metadata) : item.metadata,
      id
    ];

    const result = await pool.query(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: `Gaming item "${id}" updated successfully`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[GamingSuperViConsole] updateItem error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update gaming item', error: err.message });
  }
};

/**
 * PATCH /api/gaming-supervi-console/items/:id/freeze
 */
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT status, name FROM gaming_supervi_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Gaming item "${id}" not found` });
    }

    const currentStatus = existing.rows[0].status;
    const newStatus = currentStatus === 'frozen' ? 'active' : 'frozen';

    const result = await pool.query(
      'UPDATE gaming_supervi_console_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    return res.status(200).json({
      success: true,
      message: `Gaming item "${existing.rows[0].name}" status toggled to "${newStatus}"`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[GamingSuperViConsole] toggleFreeze error:', err);
    return res.status(500).json({ success: false, message: 'Failed to toggle freeze state', error: err.message });
  }
};

/**
 * POST /api/gaming-supervi-console/reorder
 */
exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { orders } = req.body;
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ success: false, message: 'An array of { id, display_order } is required' });
    }

    await client.query('BEGIN');
    for (const entry of orders) {
      await client.query(
        'UPDATE gaming_supervi_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [entry.display_order, entry.id]
      );
    }
    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: `Successfully re-sequenced ${orders.length} gaming items transactionally`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[GamingSuperViConsole] reorderItems error:', err);
    return res.status(500).json({ success: false, message: 'Transactional reordering failed', error: err.message });
  } finally {
    client.release();
  }
};

/**
 * DELETE /api/gaming-supervi-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM gaming_supervi_console_items WHERE id = $1 RETURNING name', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Gaming item "${id}" not found` });
    }
    return res.status(200).json({
      success: true,
      message: `Gaming item "${result.rows[0].name}" purged successfully`
    });
  } catch (err) {
    console.error('[GamingSuperViConsole] deleteItem error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete gaming item', error: err.message });
  }
};

/**
 * POST /api/gaming-supervi-console/upload
 */
exports.uploadMiddleware = upload.single('media');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file received in multipart/form-data request' });
    }

    const publicUrl = `/uploads/gaming/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'Gaming asset successfully uploaded to Express disk storage',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        url: publicUrl
      }
    });
  } catch (err) {
    console.error('[GamingSuperViConsole] uploadMedia error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process file upload', error: err.message });
  }
};

/**
 * POST /api/gaming-supervi-console/spawns
 */
exports.createSpawn = async (req, res) => {
  try {
    const { console_title, target_domain, route, icon_name, badge_text, config } = req.body;
    if (!console_title || !target_domain) {
      return res.status(400).json({ success: false, message: 'console_title and target_domain are required' });
    }

    const id = `game_spawn_${Date.now()}`;
    const generatedRoute = route || `/gaming-operations/${target_domain}/${id}`;

    const result = await pool.query(`
      INSERT INTO gaming_supervi_console_spawns (
        id, console_title, target_domain, route, icon_name, badge_text, status, config, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'active', $7, NOW())
      RETURNING *
    `, [
      id,
      console_title,
      target_domain,
      generatedRoute,
      icon_name || 'Gamepad2',
      badge_text || 'Active Console',
      JSON.stringify(config || {})
    ]);

    return res.status(201).json({
      success: true,
      message: `Spawned autonomous gaming console "${console_title}" successfully`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[GamingSuperViConsole] createSpawn error:', err);
    return res.status(500).json({ success: false, message: 'Failed to spawn gaming console', error: err.message });
  }
};

/**
 * GET /api/gaming-supervi-console/spawns
 */
exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gaming_supervi_console_spawns ORDER BY created_at DESC');
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('[GamingSuperViConsole] getSpawns error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve spawned gaming consoles', error: err.message });
  }
};
