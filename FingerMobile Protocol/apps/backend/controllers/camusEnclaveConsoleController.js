/**
 * Camus Enclave & Hardware Security Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 10: Camus Hardware Enclaves, HSM Key Management, Attestation Proofs, Tamper Grids & Zero-Trust
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
    const uploadPath = path.join(__dirname, '../public/uploads/camus');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `camus_${Date.now()}_${basename}${ext}`);
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
        COUNT(CASE WHEN category = 'Hardware Security Modules' THEN 1 END) as total_hsm_modules,
        COUNT(CASE WHEN category = 'Enclave Partitions' THEN 1 END) as total_enclaves,
        COUNT(CASE WHEN category = 'Physical Security' THEN 1 END) as total_tamper_sensors,
        COUNT(CASE WHEN category = 'Cryptographic Proofs' THEN 1 END) as total_zk_provers,
        COALESCE(AVG(zero_trust_score), 100.0) as avg_trust_score
      FROM camus_enclave_console_items
    `);

    const categoriesResult = await pool.query(`
      SELECT category, COUNT(*) as count, COALESCE(AVG(zero_trust_score), 100.0) as avg_score
      FROM camus_enclave_console_items
      GROUP BY category
      ORDER BY count DESC
    `);

    const spawnsCount = await pool.query('SELECT COUNT(*) as total FROM camus_enclave_console_spawns');

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
    console.error('Error fetching camus enclave overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = 'SELECT * FROM camus_enclave_console_items WHERE 1=1';
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
      query += ` AND (name ILIKE $${params.length} OR code ILIKE $${params.length} OR hsm_slot ILIKE $${params.length})`;
    }

    query += ' ORDER BY display_order ASC, created_at ASC';

    const result = await pool.query(query, params);
    return res.json({ success: true, items: result.rows });
  } catch (err) {
    console.error('Error fetching camus enclave items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM camus_enclave_console_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    return res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const {
      name,
      code,
      category,
      status = 'active',
      hsm_slot = 'HSM-SLOT-01',
      key_algorithm = 'Ed25519 / Dilithium-3',
      attestation_state = 'Attested (Valid)',
      tamper_sensor_status = 'Pristine (No Breach)',
      zero_trust_score = 100.00,
      voice_tag = 'gbaski',
      notes = ''
    } = req.body;

    const id = `CAM-${Date.now().toString(36).toUpperCase()}`;

    const orderRes = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM camus_enclave_console_items');
    const display_order = orderRes.rows[0].next_order;

    const insertResult = await pool.query(`
      INSERT INTO camus_enclave_console_items (
        id, domain, name, code, category, status, display_order, hsm_slot,
        key_algorithm, attestation_state, tamper_sensor_status, zero_trust_score, voice_tag, notes
      ) VALUES ($1, 'camus_enclave', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [id, name, code, category, status, display_order, hsm_slot, key_algorithm, attestation_state, tamper_sensor_status, zero_trust_score, voice_tag, notes]);

    return res.status(201).json({ success: true, item: insertResult.rows[0] });
  } catch (err) {
    console.error('Error creating camus enclave item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      status,
      hsm_slot,
      key_algorithm,
      attestation_state,
      tamper_sensor_status,
      zero_trust_score,
      voice_tag,
      notes
    } = req.body;

    const updateResult = await pool.query(`
      UPDATE camus_enclave_console_items SET
        name = COALESCE($2, name),
        code = COALESCE($3, code),
        category = COALESCE($4, category),
        status = COALESCE($5, status),
        hsm_slot = COALESCE($6, hsm_slot),
        key_algorithm = COALESCE($7, key_algorithm),
        attestation_state = COALESCE($8, attestation_state),
        tamper_sensor_status = COALESCE($9, tamper_sensor_status),
        zero_trust_score = COALESCE($10, zero_trust_score),
        voice_tag = COALESCE($11, voice_tag),
        notes = COALESCE($12, notes),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id, name, code, category, status, hsm_slot, key_algorithm, attestation_state, tamper_sensor_status, zero_trust_score, voice_tag, notes]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, item: updateResult.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await pool.query('DELETE FROM camus_enclave_console_items WHERE id = $1 RETURNING id', [id]);
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    return res.json({ success: true, message: `Item ${id} deleted successfully` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const itemRes = await pool.query('SELECT status FROM camus_enclave_console_items WHERE id = $1', [id]);
    if (itemRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const currentStatus = itemRes.rows[0].status;
    const newStatus = currentStatus === 'active' ? 'frozen' : 'active';

    const updateRes = await pool.query(`
      UPDATE camus_enclave_console_items
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id, newStatus]);

    return res.json({ success: true, item: updateRes.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { sourceId, targetId } = req.body;
    if (!sourceId || !targetId) {
      return res.status(400).json({ success: false, message: 'sourceId and targetId are required' });
    }

    await client.query('BEGIN');

    const sourceRes = await client.query('SELECT id, display_order FROM camus_enclave_console_items WHERE id = $1', [sourceId]);
    const targetRes = await client.query('SELECT id, display_order FROM camus_enclave_console_items WHERE id = $1', [targetId]);

    if (sourceRes.rows.length === 0 || targetRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'One or both items not found' });
    }

    const sourceOrder = sourceRes.rows[0].display_order;
    const targetOrder = targetRes.rows[0].display_order;

    await client.query('UPDATE camus_enclave_console_items SET display_order = $2, updated_at = NOW() WHERE id = $1', [sourceId, targetOrder]);
    await client.query('UPDATE camus_enclave_console_items SET display_order = $2, updated_at = NOW() WHERE id = $1', [targetId, sourceOrder]);

    await client.query('COMMIT');

    const allItems = await client.query('SELECT * FROM camus_enclave_console_items ORDER BY display_order ASC');
    return res.json({ success: true, items: allItems.rows });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering camus enclave items:', err);
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

    const fileUrl = `/uploads/camus/${req.file.filename}`;

    const updateRes = await pool.query(`
      UPDATE camus_enclave_console_items
      SET enclave_cert_url = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id, fileUrl]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, item: updateRes.rows[0], fileUrl });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM camus_enclave_console_spawns ORDER BY created_at DESC');
    return res.json({ success: true, spawns: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSpawn = async (req, res) => {
  try {
    const { console_title, target_domain, route, icon_name = 'ShieldCheckIcon', badge_text = 'ENCLAVE', config = {} } = req.body;
    const id = `SPAWN-CAM-${Date.now().toString(36).toUpperCase()}`;

    const result = await pool.query(`
      INSERT INTO camus_enclave_console_spawns (id, console_title, target_domain, route, icon_name, badge_text, status, config)
      VALUES ($1, $2, $3, $4, $5, $6, 'active', $7)
      RETURNING *
    `, [id, console_title, target_domain, route, icon_name, badge_text, JSON.stringify(config)]);

    return res.status(201).json({ success: true, spawn: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
