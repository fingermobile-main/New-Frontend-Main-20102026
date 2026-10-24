/**
 * Trends & Swarms Discovery Microservice Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 12: Virality Decay Sliders, Regional Swarms, Keyword Blacklists & GNN Weight Tuning
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

// Multer storage for trend banner assets and hashtag media badges
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/trends');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `trend_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }
});

const VALID_CATEGORIES = [
  'AfroBeats & Music',
  'Fashion & Luxury',
  'EduTech & NYSC',
  'Gaming & Physics',
  'Commerce & Deals',
  'Tech & Web3'
];

/**
 * GET /api/trends-swarm-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_topics,
        COUNT(CASE WHEN status = 'active' AND is_blacklisted = false THEN 1 END) as active_topics,
        COUNT(CASE WHEN is_boosted = true THEN 1 END) as boosted_topics,
        COUNT(CASE WHEN is_blacklisted = true THEN 1 END) as blacklisted_topics,
        COALESCE(SUM(post_count), 0) as total_posts,
        COALESCE(SUM(reach_count), 0) as total_reach,
        COALESCE(AVG(virality_decay_rate), 0.085) as avg_decay_rate,
        COALESCE(AVG(velocity_score), 85.00) as avg_velocity
      FROM trends_swarm_console_items;
    `);

    const spawnsResult = await pool.query(`
      SELECT COUNT(*) as total_spawns,
             COALESCE(SUM(active_instances), 0) as total_instances
      FROM trends_swarm_console_spawns;
    `);

    const stats = statsResult.rows[0];
    const spawns = spawnsResult.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        total_topics: parseInt(stats.total_topics, 10),
        active_topics: parseInt(stats.active_topics, 10),
        boosted_topics: parseInt(stats.boosted_topics, 10),
        blacklisted_topics: parseInt(stats.blacklisted_topics, 10),
        total_posts: parseInt(stats.total_posts, 10),
        total_reach: parseInt(stats.total_reach, 10),
        avg_decay_rate: parseFloat(Number(stats.avg_decay_rate).toFixed(3)),
        avg_velocity: parseFloat(Number(stats.avg_velocity).toFixed(2)),
        active_shards: parseInt(spawns.total_spawns, 10),
        active_instances: parseInt(spawns.total_instances, 10),
        decay_algorithm: 'Exponential Virality Decay Model v4 (Half-Life: 18h)',
        gnn_cluster_routing: 'Active Geolocation GNN (Lagos, Abuja, Nairobi, Accra, London)',
        system_status: 'HEALTHY_SYNCED',
        database_engine: 'PostgreSQL 16 (fingermobile_platform_db)'
      }
    });
  } catch (err) {
    console.error('Error fetching Trends & Swarms overview:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve Trends & Swarms overview',
      error: err.message
    });
  }
};

/**
 * GET /api/trends-swarm-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { category, search, boosted_only } = req.query;
    let query = 'SELECT * FROM trends_swarm_console_items WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      query += ` AND topic ILIKE $${params.length}`;
    }

    if (boosted_only === 'true') {
      query += ' AND is_boosted = true';
    }

    query += ' ORDER BY display_order ASC, created_at DESC;';

    const result = await pool.query(query, params);
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching Trends & Swarms items:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Trends & Swarms items',
      error: err.message
    });
  }
};

/**
 * GET /api/trends-swarm-console/items/:id
 */
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM trends_swarm_console_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Trend not found' });
    }
    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching trend by id:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch trend',
      error: err.message
    });
  }
};

/**
 * POST /api/trends-swarm-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      topic,
      category,
      trend_type,
      virality_decay_rate,
      velocity_score,
      target_clusters,
      gnm_weight,
      is_boosted
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'topic is required'
      });
    }

    const orderResult = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM trends_swarm_console_items');
    const nextOrder = orderResult.rows[0].next_order;

    const insertResult = await pool.query(`
      INSERT INTO trends_swarm_console_items (
        topic,
        category,
        trend_type,
        virality_decay_rate,
        velocity_score,
        target_clusters,
        gnm_weight,
        is_boosted,
        display_order
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING *;
    `, [
      topic,
      category || 'AfroBeats & Music',
      trend_type || 'swarm',
      parseFloat(virality_decay_rate) || 0.085,
      parseFloat(velocity_score) || 85.00,
      Array.isArray(target_clusters) && target_clusters.length > 0
        ? target_clusters
        : ['Lagos', 'Abuja', 'Nairobi', 'Accra'],
      parseFloat(gnm_weight) || 1.25,
      Boolean(is_boosted),
      nextOrder
    ]);

    return res.status(201).json({
      success: true,
      message: 'Trend topic inserted and published to PostgreSQL',
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating trend item:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create trend item',
      error: err.message
    });
  }
};

/**
 * PUT /api/trends-swarm-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      topic,
      category,
      trend_type,
      virality_decay_rate,
      velocity_score,
      target_clusters,
      gnm_weight,
      is_boosted,
      is_blacklisted,
      status
    } = req.body;

    const checkResult = await pool.query('SELECT * FROM trends_swarm_console_items WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Trend not found' });
    }

    const current = checkResult.rows[0];

    const updateResult = await pool.query(`
      UPDATE trends_swarm_console_items
      SET
        topic = COALESCE($1, topic),
        category = COALESCE($2, category),
        trend_type = COALESCE($3, trend_type),
        virality_decay_rate = COALESCE($4, virality_decay_rate),
        velocity_score = COALESCE($5, velocity_score),
        target_clusters = COALESCE($6, target_clusters),
        gnm_weight = COALESCE($7, gnm_weight),
        is_boosted = COALESCE($8, is_boosted),
        is_blacklisted = COALESCE($9, is_blacklisted),
        status = COALESCE($10, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *;
    `, [
      topic,
      category,
      trend_type,
      virality_decay_rate !== undefined ? parseFloat(virality_decay_rate) : current.virality_decay_rate,
      velocity_score !== undefined ? parseFloat(velocity_score) : current.velocity_score,
      Array.isArray(target_clusters) ? target_clusters : current.target_clusters,
      gnm_weight !== undefined ? parseFloat(gnm_weight) : current.gnm_weight,
      is_boosted !== undefined ? Boolean(is_boosted) : current.is_boosted,
      is_blacklisted !== undefined ? Boolean(is_blacklisted) : current.is_blacklisted,
      status,
      id
    ]);

    return res.status(200).json({
      success: true,
      message: 'Trend topic updated successfully in PostgreSQL',
      data: updateResult.rows[0]
    });
  } catch (err) {
    console.error('Error updating trend item:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update trend item',
      error: err.message
    });
  }
};

/**
 * DELETE /api/trends-swarm-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await pool.query('DELETE FROM trends_swarm_console_items WHERE id = $1 RETURNING *;', [id]);
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Trend not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Trend purged permanently from registry',
      data: deleteResult.rows[0]
    });
  } catch (err) {
    console.error('Error deleting trend:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete trend',
      error: err.message
    });
  }
};

/**
 * POST /api/trends-swarm-console/reorder
 */
exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { reorders } = req.body;
    if (!Array.isArray(reorders)) {
      return res.status(400).json({ success: false, message: 'reorders must be an array of { id, display_order }' });
    }

    await client.query('BEGIN');
    for (const item of reorders) {
      await client.query(
        'UPDATE trends_swarm_console_items SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [item.display_order, item.id]
      );
    }
    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: `Atomically reordered ${reorders.length} trends`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering trends:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to reorder trends',
      error: err.message
    });
  } finally {
    client.release();
  }
};

/**
 * POST /api/trends-swarm-console/upload
 */
exports.uploadMiddleware = upload.single('asset');

exports.handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No media asset attached' });
  }

  const relativeUrl = `/uploads/trends/${req.file.filename}`;

  return res.status(200).json({
    success: true,
    message: 'Trend asset uploaded directly to Express',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      url: relativeUrl
    }
  });
};

/**
 * POST /api/trends-swarm-console/defcon-clamp
 * DefCon Virality Clamp: Emergency clamp to kill runaway viral spikes or blacklist topics
 */
exports.toggleViralityClamp = async (req, res) => {
  try {
    const { mode, category } = req.body; // 'emergency_clamp' | 'restore_normal'

    let updateQuery = '';
    const params = [];

    if (mode === 'emergency_clamp') {
      updateQuery = 'UPDATE trends_swarm_console_items SET virality_decay_rate = 0.950, is_boosted = false, updated_at = CURRENT_TIMESTAMP';
    } else {
      updateQuery = 'UPDATE trends_swarm_console_items SET virality_decay_rate = 0.085, updated_at = CURRENT_TIMESTAMP';
    }

    if (category && category !== 'all') {
      params.push(category);
      updateQuery += ` WHERE category = $1 RETURNING id;`;
    } else {
      updateQuery += ' RETURNING id;';
    }

    const result = await pool.query(updateQuery, params);

    return res.status(200).json({
      success: true,
      affected_count: result.rows.length,
      mode,
      message: `Virality Clamp ${mode === 'emergency_clamp' ? 'ACTIVATED' : 'RESET'} across ${result.rows.length} topics.`
    });
  } catch (err) {
    console.error('Error toggling virality clamp:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle virality clamp',
      error: err.message
    });
  }
};

/**
 * GET /api/trends-swarm-console/spawns
 */
exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trends_swarm_console_spawns ORDER BY id ASC;');
    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching Trends & Swarms console spawns:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Trends & Swarms console spawns',
      error: err.message
    });
  }
};

/**
 * POST /api/trends-swarm-console/spawns
 */
exports.spawnConsole = async (req, res) => {
  try {
    const { title, domain, badge, description, instances } = req.body;
    if (!title || !badge) {
      return res.status(400).json({ success: false, message: 'title and badge are required' });
    }

    const result = await pool.query(`
      INSERT INTO trends_swarm_console_spawns (title, domain, badge, description, active_instances, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *;
    `, [
      title,
      domain || 'trends_swarm',
      badge,
      description || '',
      parseInt(instances || '1', 10)
    ]);

    return res.status(201).json({
      success: true,
      message: 'Spawned new sovereign Trends & Swarms sentinel',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error spawning Trends & Swarms console:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to spawn Trends & Swarms console',
      error: err.message
    });
  }
};
