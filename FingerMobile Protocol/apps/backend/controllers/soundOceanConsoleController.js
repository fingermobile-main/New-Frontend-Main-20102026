/**
 * SoundOcean Sovereign Console Controller
 * Independent Audio Collector, Categorizer, Library & Archival Vault Microservice
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
    const uploadPath = path.join(__dirname, '../public/uploads/soundocean');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `ocean_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 250 * 1024 * 1024 } // 250MB limit for uncompressed FLAC / ZIP stem vaults
});

exports.uploadMiddleware = upload.single('asset');

exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(play_count), 0) as total_plays,
        COALESCE(SUM(download_count), 0) as total_downloads,
        COALESCE(SUM(file_size_mb), 0) as total_storage_mb,
        COALESCE(AVG(royalty_split_pct), 85) as avg_royalty_split_pct,
        COUNT(DISTINCT category) as total_categories
      FROM sound_ocean_library_items
    `);

    const categoriesResult = await pool.query(`
      SELECT category, COUNT(*) as count, COALESCE(SUM(play_count), 0) as plays
      FROM sound_ocean_library_items
      GROUP BY category
      ORDER BY count DESC
    `);

    const spawnsResult = await pool.query(`
      SELECT COUNT(*) as total_spawns FROM sound_ocean_console_spawns
    `);

    res.json({
      success: true,
      data: {
        summary: statsResult.rows[0],
        categories: categoriesResult.rows,
        totalSpawns: parseInt(spawnsResult.rows[0].total_spawns, 10),
        engine: 'SoundOcean Sovereign Ingestion & Library Microservice v3.4',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[SoundOceanController] getOverview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { category, status, search, genre } = req.query;
    let query = 'SELECT * FROM sound_ocean_library_items WHERE 1=1';
    const params = [];

    if (category && category !== 'ALL') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (genre && genre !== 'ALL') {
      params.push(genre);
      query += ` AND genre = $${params.length}`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR artist ILIKE $${params.length} OR code ILIKE $${params.length} OR uploader_name ILIKE $${params.length})`;
    }

    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[SoundOceanController] getItems error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM sound_ocean_library_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'SoundOcean item not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SoundOceanController] getItemById error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const {
      code,
      title,
      artist,
      genre,
      category,
      bpm = 120,
      key_signature = 'C Maj',
      bit_depth = 24,
      sample_rate_khz = 48,
      audio_format = 'FLAC',
      audio_url,
      stem_vault_file,
      stem_channels = '["Vocals", "Drums", "Bass", "Melody"]',
      file_size_mb = 35.0,
      uploader_id = 'member-sovereign',
      uploader_name = 'Community Creator',
      license_type = 'Creative Commons CC-BY 4.0',
      fic_price = 0,
      royalty_split_pct = 85.0
    } = req.body;

    if (!code || !title || !artist || !genre) {
      return res.status(400).json({ success: false, error: 'Code, title, artist, and genre are required' });
    }

    const maxOrderRes = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM sound_ocean_library_items');
    const displayOrder = maxOrderRes.rows[0].next_order;

    const parsedStems = typeof stem_channels === 'string' ? JSON.parse(stem_channels) : stem_channels;

    const insertResult = await pool.query(`
      INSERT INTO sound_ocean_library_items (
        code, title, artist, genre, category, bpm, key_signature, bit_depth, sample_rate_khz,
        audio_format, audio_url, stem_vault_file, stem_channels, file_size_mb, uploader_id,
        uploader_name, license_type, fic_price, royalty_split_pct, display_order
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      ) RETURNING *
    `, [
      code, title, artist, genre, category || 'Master Stems', bpm, key_signature, bit_depth,
      sample_rate_khz, audio_format, audio_url || 'https://cdn.fingermobileprotocol.com/soundocean/default.flac',
      stem_vault_file, JSON.stringify(parsedStems), file_size_mb, uploader_id, uploader_name,
      license_type, fic_price, royalty_split_pct, displayOrder
    ]);

    res.status(201).json({ success: true, data: insertResult.rows[0] });
  } catch (error) {
    console.error('[SoundOceanController] createItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      artist,
      genre,
      category,
      bpm,
      key_signature,
      bit_depth,
      sample_rate_khz,
      audio_format,
      stem_channels,
      file_size_mb,
      license_type,
      fic_price,
      royalty_split_pct,
      curation_status
    } = req.body;

    const result = await pool.query(`
      UPDATE sound_ocean_library_items
      SET
        title = COALESCE($1, title),
        artist = COALESCE($2, artist),
        genre = COALESCE($3, genre),
        category = COALESCE($4, category),
        bpm = COALESCE($5, bpm),
        key_signature = COALESCE($6, key_signature),
        bit_depth = COALESCE($7, bit_depth),
        sample_rate_khz = COALESCE($8, sample_rate_khz),
        audio_format = COALESCE($9, audio_format),
        stem_channels = COALESCE($10, stem_channels),
        file_size_mb = COALESCE($11, file_size_mb),
        license_type = COALESCE($12, license_type),
        fic_price = COALESCE($13, fic_price),
        royalty_split_pct = COALESCE($14, royalty_split_pct),
        curation_status = COALESCE($15, curation_status),
        updated_at = NOW()
      WHERE id = $16
      RETURNING *
    `, [
      title, artist, genre, category, bpm, key_signature, bit_depth, sample_rate_khz,
      audio_format, stem_channels ? JSON.stringify(stem_channels) : null, file_size_mb,
      license_type, fic_price, royalty_split_pct, curation_status, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'SoundOcean item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SoundOceanController] updateItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM sound_ocean_library_items WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'SoundOcean item not found' });
    }
    res.json({ success: true, message: 'SoundOcean item deleted', id });
  } catch (error) {
    console.error('[SoundOceanController] deleteItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      UPDATE sound_ocean_library_items
      SET status = CASE WHEN status = 'active' THEN 'frozen' ELSE 'active' END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'SoundOcean item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SoundOceanController] toggleFreeze error:', error);
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

    const sourceRes = await client.query('SELECT display_order FROM sound_ocean_library_items WHERE id = $1', [sourceId]);
    const targetRes = await client.query('SELECT display_order FROM sound_ocean_library_items WHERE id = $1', [targetId]);

    if (sourceRes.rows.length === 0 || targetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Items not found for reordering' });
    }

    const sourceOrder = sourceRes.rows[0].display_order;
    const targetOrder = targetRes.rows[0].display_order;

    await client.query('UPDATE sound_ocean_library_items SET display_order = $1 WHERE id = $2', [targetOrder, sourceId]);
    await client.query('UPDATE sound_ocean_library_items SET display_order = $1 WHERE id = $2', [sourceOrder, targetId]);

    await client.query('COMMIT');

    const items = await pool.query('SELECT * FROM sound_ocean_library_items ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: items.rows });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[SoundOceanController] reorderItems error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
};

exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No audio/stem file uploaded' });
    }

    const assetUrl = `/uploads/soundocean/${req.file.filename}`;
    const { id } = req.params;

    if (id) {
      await pool.query(`
        UPDATE sound_ocean_library_items
        SET audio_url = $1, file_size_mb = $2, updated_at = NOW()
        WHERE id = $3
      `, [assetUrl, (req.file.size / (1024 * 1024)).toFixed(2), id]);
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
    console.error('[SoundOceanController] uploadAsset error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sound_ocean_console_spawns ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[SoundOceanController] getSpawns error:', error);
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
      INSERT INTO sound_ocean_console_spawns (sub_console_name, slug, endpoint, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [sub_console_name, slug, endpoint || `/api/sound-ocean-console/spawns/${slug}`, category || 'Master Stems']);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[SoundOceanController] createSpawn error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
