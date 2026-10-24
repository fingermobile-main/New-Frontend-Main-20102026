/**
 * Lumina Digital Collectibles & Cultural Provenance Console Controller
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
    const uploadPath = path.join(__dirname, '../public/uploads/lumina');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `lumina_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

exports.uploadMiddleware = upload.single('asset');

exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(total_minted), 0) as total_minted_items,
        COALESCE(AVG(floor_price_fic), 250) as avg_floor_price_fic,
        COALESCE(AVG(royalty_pct), 7.5) as avg_royalty_pct,
        COUNT(DISTINCT category) as total_categories
      FROM lumina_gallery_console_items
    `);

    const categoriesResult = await pool.query(`
      SELECT category, COUNT(*) as count, COALESCE(SUM(total_minted), 0) as minted
      FROM lumina_gallery_console_items
      GROUP BY category
      ORDER BY count DESC
    `);

    const spawnsResult = await pool.query(`
      SELECT COUNT(*) as total_spawns FROM lumina_gallery_console_spawns
    `);

    res.json({
      success: true,
      data: {
        summary: statsResult.rows[0],
        categories: categoriesResult.rows,
        totalSpawns: parseInt(spawnsResult.rows[0].total_spawns, 10),
        engine: 'Lumina Digital Collectibles & Cultural Provenance Engine v3.2',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[LuminaGalleryController] getOverview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = 'SELECT * FROM lumina_gallery_console_items WHERE 1=1';
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
      query += ` AND (name ILIKE $${params.length} OR code ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[LuminaGalleryController] getItems error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM lumina_gallery_console_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Collectible item not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[LuminaGalleryController] getItemById error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      category,
      total_minted = 1000,
      floor_price_fic = 250.0,
      royalty_pct = 7.5
    } = req.body;

    if (!code || !name) {
      return res.status(400).json({ success: false, error: 'Code and name are required' });
    }

    const maxOrderRes = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM lumina_gallery_console_items');
    const displayOrder = maxOrderRes.rows[0].next_order;

    const insertResult = await pool.query(`
      INSERT INTO lumina_gallery_console_items (
        code, name, description, category, total_minted, floor_price_fic, royalty_pct, display_order
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *
    `, [
      code, name, description, category || 'Historical Artifacts', total_minted,
      floor_price_fic, royalty_pct, displayOrder
    ]);

    res.status(201).json({ success: true, data: insertResult.rows[0] });
  } catch (error) {
    console.error('[LuminaGalleryController] createItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      total_minted,
      floor_price_fic,
      royalty_pct
    } = req.body;

    const result = await pool.query(`
      UPDATE lumina_gallery_console_items
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        total_minted = COALESCE($4, total_minted),
        floor_price_fic = COALESCE($5, floor_price_fic),
        royalty_pct = COALESCE($6, royalty_pct),
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [name, description, category, total_minted, floor_price_fic, royalty_pct, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Collectible item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[LuminaGalleryController] updateItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM lumina_gallery_console_items WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Collectible item not found' });
    }
    res.json({ success: true, message: 'Collectible item deleted', id });
  } catch (error) {
    console.error('[LuminaGalleryController] deleteItem error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      UPDATE lumina_gallery_console_items
      SET status = CASE WHEN status = 'active' THEN 'frozen' ELSE 'active' END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Collectible item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[LuminaGalleryController] toggleFreeze error:', error);
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

    const sourceRes = await client.query('SELECT display_order FROM lumina_gallery_console_items WHERE id = $1', [sourceId]);
    const targetRes = await client.query('SELECT display_order FROM lumina_gallery_console_items WHERE id = $1', [targetId]);

    if (sourceRes.rows.length === 0 || targetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Items not found for reordering' });
    }

    const sourceOrder = sourceRes.rows[0].display_order;
    const targetOrder = targetRes.rows[0].display_order;

    await client.query('UPDATE lumina_gallery_console_items SET display_order = $1 WHERE id = $2', [targetOrder, sourceId]);
    await client.query('UPDATE lumina_gallery_console_items SET display_order = $1 WHERE id = $2', [sourceOrder, targetId]);

    await client.query('COMMIT');

    const items = await pool.query('SELECT * FROM lumina_gallery_console_items ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: items.rows });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[LuminaGalleryController] reorderItems error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
};

exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No media uploaded' });
    }

    const assetUrl = `/uploads/lumina/${req.file.filename}`;
    const { id } = req.params;

    if (id) {
      await pool.query(`
        UPDATE lumina_gallery_console_items
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
    console.error('[LuminaGalleryController] uploadAsset error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lumina_gallery_console_spawns ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[LuminaGalleryController] getSpawns error:', error);
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
      INSERT INTO lumina_gallery_console_spawns (sub_console_name, slug, endpoint, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [sub_console_name, slug, endpoint || `/api/lumina-gallery-console/spawns/${slug}`, category || 'Cultural Provenance']);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[LuminaGalleryController] createSpawn error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
