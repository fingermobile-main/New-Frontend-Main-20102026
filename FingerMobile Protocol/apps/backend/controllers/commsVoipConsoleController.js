/**
 * Communications VoIP & WebRTC Relay Console Controller
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
    const uploadPath = path.join(__dirname, '../public/uploads/voip');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `voip_${Date.now()}_${basename}${ext}`);
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
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(concurrency_limit), 0) as total_concurrency_limit,
        COALESCE(SUM(active_peers_count), 0) as total_active_peers,
        COALESCE(AVG(latency_ms), 15) as avg_latency_ms,
        COALESCE(AVG(packet_loss_percent), 0.03) as avg_packet_loss_pct,
        COUNT(DISTINCT room_type) as total_room_types
      FROM comms_voip_console_items
    `);

    const typesResult = await pool.query(`
      SELECT room_type as category, COUNT(*) as count, COALESCE(SUM(active_peers_count), 0) as peers
      FROM comms_voip_console_items
      GROUP BY room_type
      ORDER BY count DESC
    `);

    const spawnsResult = await pool.query(`
      SELECT COUNT(*) as total_spawns FROM comms_voip_console_spawns
    `);

    res.json({
      success: true,
      data: {
        summary: statsResult.rows[0],
        categories: typesResult.rows,
        totalSpawns: parseInt(spawnsResult.rows[0].total_spawns, 10),
        engine: 'WebRTC STUN/TURN Mesh & Telco VoIP Relay Engine v3.1',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[CommsVoipController] getOverview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { category, room_type, status, search } = req.query;
    let query = 'SELECT * FROM comms_voip_console_items WHERE 1=1';
    const params = [];

    const filterType = category || room_type;
    if (filterType && filterType !== 'ALL') {
      params.push(filterType);
      query += ` AND room_type = $${params.length}`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (room_name ILIKE $${params.length} OR room_code ILIKE $${params.length} OR relay_cluster ILIKE $${params.length})`;
    }

    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[CommsVoipController] getItems error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM comms_voip_console_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'VoIP item not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[CommsVoipController] getItemById error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const {
      room_code,
      code,
      room_name,
      name,
      room_type,
      category,
      relay_cluster = 'Lagos-Citadel-TURN-01',
      concurrency_limit = 500,
      bitrate_kbps = 256,
      recording_enabled = true,
      emergency_broadcast_priority = false,
      stun_turn_health = 'optimal',
      packet_loss_percent = 0.02,
      latency_ms = 15,
      description
    } = req.body;

    const finalCode = room_code || code;
    const finalName = room_name || name;
    const finalType = room_type || category || 'audio_video_conference';

    if (!finalCode || !finalName) {
      return res.status(400).json({ success: false, error: 'Room code and name are required' });
    }

    const maxOrderRes = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM comms_voip_console_items');
    const displayOrder = maxOrderRes.rows[0].next_order;

    const insertResult = await pool.query(`
      INSERT INTO comms_voip_console_items (
        room_code, room_name, room_type, relay_cluster, concurrency_limit, bitrate_kbps,
        recording_enabled, emergency_broadcast_priority, stun_turn_health, packet_loss_percent,
        latency_ms, description, display_order
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      ) RETURNING *
    `, [
      finalCode, finalName, finalType, relay_cluster, concurrency_limit, bitrate_kbps,
      recording_enabled, emergency_broadcast_priority, stun_turn_health, packet_loss_percent,
      latency_ms, description, displayOrder
    ]);

    res.status(201).json({ success: true, data: insertResult.rows[0] });
  } catch (error) {
    console.error('[CommsVoipController] createItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      room_name,
      name,
      room_type,
      category,
      relay_cluster,
      concurrency_limit,
      bitrate_kbps,
      recording_enabled,
      emergency_broadcast_priority,
      stun_turn_health,
      packet_loss_percent,
      latency_ms,
      description
    } = req.body;

    const result = await pool.query(`
      UPDATE comms_voip_console_items
      SET
        room_name = COALESCE($1, room_name),
        room_type = COALESCE($2, room_type),
        relay_cluster = COALESCE($3, relay_cluster),
        concurrency_limit = COALESCE($4, concurrency_limit),
        bitrate_kbps = COALESCE($5, bitrate_kbps),
        recording_enabled = COALESCE($6, recording_enabled),
        emergency_broadcast_priority = COALESCE($7, emergency_broadcast_priority),
        stun_turn_health = COALESCE($8, stun_turn_health),
        packet_loss_percent = COALESCE($9, packet_loss_percent),
        latency_ms = COALESCE($10, latency_ms),
        description = COALESCE($11, description),
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `, [
      room_name || name, room_type || category, relay_cluster, concurrency_limit,
      bitrate_kbps, recording_enabled, emergency_broadcast_priority, stun_turn_health,
      packet_loss_percent, latency_ms, description, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'VoIP item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[CommsVoipController] updateItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM comms_voip_console_items WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'VoIP item not found' });
    }
    res.json({ success: true, message: 'VoIP item deleted', id });
  } catch (error) {
    console.error('[CommsVoipController] deleteItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      UPDATE comms_voip_console_items
      SET status = CASE WHEN status = 'active' THEN 'frozen' ELSE 'active' END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'VoIP item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[CommsVoipController] toggleFreeze error:', error);
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

    const sourceRes = await client.query('SELECT display_order FROM comms_voip_console_items WHERE id = $1', [sourceId]);
    const targetRes = await client.query('SELECT display_order FROM comms_voip_console_items WHERE id = $1', [targetId]);

    if (sourceRes.rows.length === 0 || targetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Items not found for reordering' });
    }

    const sourceOrder = sourceRes.rows[0].display_order;
    const targetOrder = targetRes.rows[0].display_order;

    await client.query('UPDATE comms_voip_console_items SET display_order = $1 WHERE id = $2', [targetOrder, sourceId]);
    await client.query('UPDATE comms_voip_console_items SET display_order = $1 WHERE id = $2', [sourceOrder, targetId]);

    await client.query('COMMIT');

    const items = await pool.query('SELECT * FROM comms_voip_console_items ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: items.rows });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[CommsVoipController] reorderItems error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
};

exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No VoIP asset uploaded' });
    }

    const assetUrl = `/uploads/voip/${req.file.filename}`;
    const { id } = req.params;

    if (id) {
      await pool.query(`
        UPDATE comms_voip_console_items
        SET asset_url = $1, updated_at = NOW()
        WHERE id = $2
      `, [assetUrl, id]);
    }

    res.json({
      success: true,
      data: {
        asset_url: assetUrl,
        filename: req.file.filename,
        size_bytes: req.file.size
      }
    });
  } catch (error) {
    console.error('[CommsVoipController] uploadAsset error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comms_voip_console_spawns ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[CommsVoipController] getSpawns error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createSpawn = async (req, res) => {
  try {
    const { sub_console_name, title, slug, domain, endpoint, category } = req.body;
    const finalTitle = sub_console_name || title;
    const finalSlug = slug || domain;

    if (!finalTitle || !finalSlug) {
      return res.status(400).json({ success: false, error: 'Console name and slug are required' });
    }

    const result = await pool.query(`
      INSERT INTO comms_voip_console_spawns (title, domain, badge, description, active_instances, status)
      VALUES ($1, $2, $3, $4, 1, 'active')
      RETURNING *
    `, [finalTitle, finalSlug, category || 'VoIP Mesh', `Dedicated VoIP mesh relay instance for ${finalTitle}`]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[CommsVoipController] createSpawn error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
