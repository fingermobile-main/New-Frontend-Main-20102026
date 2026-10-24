/**
 * SoundRiver Sovereign Console Controller
 * Independent Real-Time Stream Engine & BeatwaveNG Seeder/Feeder Microservice
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
    const uploadPath = path.join(__dirname, '../public/uploads/soundriver');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `river_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for audio streams & bumpers
});

exports.uploadMiddleware = upload.single('asset');

exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' OR status = 'muted' THEN 1 END) as frozen_count,
        COALESCE(SUM(active_listeners), 0) as total_active_listeners,
        COALESCE(MAX(peak_listeners), 0) as peak_listeners,
        COALESCE(AVG(target_bitrate_kbps), 320) as avg_bitrate_kbps,
        COALESCE(AVG(buffer_health_pct), 99.8) as avg_buffer_health_pct,
        COUNT(DISTINCT category) as total_categories
      FROM sound_river_stream_items
    `);

    const categoriesResult = await pool.query(`
      SELECT category, COUNT(*) as count, COALESCE(SUM(active_listeners), 0) as listeners
      FROM sound_river_stream_items
      GROUP BY category
      ORDER BY count DESC
    `);

    const spawnsResult = await pool.query(`
      SELECT COUNT(*) as total_spawns FROM sound_river_console_spawns
    `);

    res.json({
      success: true,
      data: {
        summary: statsResult.rows[0],
        categories: categoriesResult.rows,
        totalSpawns: parseInt(spawnsResult.rows[0].total_spawns, 10),
        engine: 'SoundRiver Autonomous Stream & BeatwaveNG Feeder Engine v3.4',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[SoundRiverController] getOverview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = 'SELECT * FROM sound_river_stream_items WHERE 1=1';
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
      query += ` AND (station_name ILIKE $${params.length} OR code ILIKE $${params.length} OR current_track_title ILIKE $${params.length} OR current_track_artist ILIKE $${params.length})`;
    }

    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[SoundRiverController] getItems error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM sound_river_stream_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'SoundRiver stream item not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SoundRiverController] getItemById error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const {
      code,
      station_name,
      category,
      active_listeners = 100,
      peak_listeners = 5000,
      target_bitrate_kbps = 320,
      codec = 'AAC-LC',
      current_track_id,
      current_track_title,
      current_track_artist,
      current_track_url,
      next_track_title,
      crossfade_seconds = 4,
      feed_mode = 'auto_seed',
      buffer_health_pct = 99.8
    } = req.body;

    if (!code || !station_name) {
      return res.status(400).json({ success: false, error: 'Code and station_name are required' });
    }

    const maxOrderRes = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM sound_river_stream_items');
    const displayOrder = maxOrderRes.rows[0].next_order;

    const insertResult = await pool.query(`
      INSERT INTO sound_river_stream_items (
        code, station_name, category, active_listeners, peak_listeners, target_bitrate_kbps,
        codec, current_track_id, current_track_title, current_track_artist, current_track_url,
        next_track_title, crossfade_seconds, feed_mode, buffer_health_pct, display_order
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING *
    `, [
      code, station_name, category || 'Live Beatwave Feeder', active_listeners, peak_listeners,
      target_bitrate_kbps, codec, current_track_id || null, current_track_title || 'Autonomous River Stream',
      current_track_artist || 'SoundOcean Feeder', current_track_url || null, next_track_title || null,
      crossfade_seconds, feed_mode, buffer_health_pct, displayOrder
    ]);

    res.status(201).json({ success: true, data: insertResult.rows[0] });
  } catch (error) {
    console.error('[SoundRiverController] createItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      station_name,
      category,
      active_listeners,
      peak_listeners,
      target_bitrate_kbps,
      codec,
      current_track_id,
      current_track_title,
      current_track_artist,
      current_track_url,
      next_track_title,
      crossfade_seconds,
      feed_mode,
      buffer_health_pct
    } = req.body;

    const result = await pool.query(`
      UPDATE sound_river_stream_items
      SET
        station_name = COALESCE($1, station_name),
        category = COALESCE($2, category),
        active_listeners = COALESCE($3, active_listeners),
        peak_listeners = COALESCE($4, peak_listeners),
        target_bitrate_kbps = COALESCE($5, target_bitrate_kbps),
        codec = COALESCE($6, codec),
        current_track_id = COALESCE($7, current_track_id),
        current_track_title = COALESCE($8, current_track_title),
        current_track_artist = COALESCE($9, current_track_artist),
        current_track_url = COALESCE($10, current_track_url),
        next_track_title = COALESCE($11, next_track_title),
        crossfade_seconds = COALESCE($12, crossfade_seconds),
        feed_mode = COALESCE($13, feed_mode),
        buffer_health_pct = COALESCE($14, buffer_health_pct),
        updated_at = NOW()
      WHERE id = $15
      RETURNING *
    `, [
      station_name, category, active_listeners, peak_listeners, target_bitrate_kbps,
      codec, current_track_id, current_track_title, current_track_artist,
      current_track_url, next_track_title, crossfade_seconds, feed_mode,
      buffer_health_pct, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'SoundRiver stream item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SoundRiverController] updateItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM sound_river_stream_items WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'SoundRiver stream item not found' });
    }
    res.json({ success: true, message: 'SoundRiver stream item deleted', id });
  } catch (error) {
    console.error('[SoundRiverController] deleteItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      UPDATE sound_river_stream_items
      SET status = CASE WHEN status = 'active' THEN 'frozen' ELSE 'active' END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'SoundRiver stream item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SoundRiverController] toggleFreeze error:', error);
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

    const sourceRes = await client.query('SELECT display_order FROM sound_river_stream_items WHERE id = $1', [sourceId]);
    const targetRes = await client.query('SELECT display_order FROM sound_river_stream_items WHERE id = $1', [targetId]);

    if (sourceRes.rows.length === 0 || targetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Items not found for reordering' });
    }

    const sourceOrder = sourceRes.rows[0].display_order;
    const targetOrder = targetRes.rows[0].display_order;

    await client.query('UPDATE sound_river_stream_items SET display_order = $1 WHERE id = $2', [targetOrder, sourceId]);
    await client.query('UPDATE sound_river_stream_items SET display_order = $1 WHERE id = $2', [sourceOrder, targetId]);

    await client.query('COMMIT');

    const items = await pool.query('SELECT * FROM sound_river_stream_items ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: items.rows });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[SoundRiverController] reorderItems error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
};

exports.seedNextTrackFromOcean = async (req, res) => {
  try {
    const { id } = req.params;
    const { genre } = req.body;

    let oceanQuery = `
      SELECT * FROM sound_ocean_library_items
      WHERE status = 'active'
    `;
    const params = [];
    if (genre) {
      params.push(genre);
      oceanQuery += ' AND genre = $1';
    }
    oceanQuery += ' ORDER BY RANDOM() LIMIT 1';

    const oceanRes = await pool.query(oceanQuery, params);
    if (oceanRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No active tracks found in SoundOcean library to seed' });
    }

    const track = oceanRes.rows[0];

    const updatedRes = await pool.query(`
      UPDATE sound_river_stream_items
      SET
        current_track_id = $1,
        current_track_title = $2,
        current_track_artist = $3,
        current_track_url = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [track.id, track.title, track.artist, track.audio_url, id]);

    // Increment play count in sound_ocean
    await pool.query('UPDATE sound_ocean_library_items SET play_count = play_count + 1 WHERE id = $1', [track.id]);

    res.json({
      success: true,
      message: `Stream seeded with "${track.title}" by ${track.artist} from SoundOcean library`,
      data: updatedRes.rows[0],
      seededTrack: track
    });
  } catch (error) {
    console.error('[SoundRiverController] seedNextTrackFromOcean error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No audio asset uploaded' });
    }

    const assetUrl = `/uploads/soundriver/${req.file.filename}`;
    const { id } = req.params;

    if (id) {
      await pool.query(`
        UPDATE sound_river_stream_items
        SET current_track_url = $1, updated_at = NOW()
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
    console.error('[SoundRiverController] uploadAsset error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sound_river_console_spawns ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[SoundRiverController] getSpawns error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createSpawn = async (req, res) => {
  try {
    const { sub_console_name, slug, endpoint, category } = req.body;
    if (!sub_console_name || !slug) {
      return res.status(400).json({ success: false, error: 'sub_console_name and slug are required' });
    }

    const result = await pool.query(`
      INSERT INTO sound_river_console_spawns (sub_console_name, slug, endpoint, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [sub_console_name, slug, endpoint || `/api/sound-river-console/spawns/${slug}`, category || 'Live Beatwave Feeder']);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SoundRiverController] createSpawn error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
