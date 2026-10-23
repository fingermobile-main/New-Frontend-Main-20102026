/**
 * Content Moderation, Trust, Safety & Ethics Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 7: Heuristic AI Flagging, Quarantine Strike Ledger, Minor/Child Shield, Appeals Tribunal, Copyright Content ID & Forensic Audits
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

// Multer storage for evidence manifests, forensic logs, tribunal filings, copyright certificates
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/moderation');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `mod_evidence_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 35 * 1024 * 1024 } // 35MB limit for forensic manifests and evidence bundles
});

const VALID_DOMAINS = [
  'heuristic_flagging_queue',
  'quarantine_strike_ledger',
  'minor_child_persona_shield',
  'appeals_tribunal_review',
  'copyright_content_id',
  'safety_audit_forensics'
];

/**
 * GET /api/content-moderation-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(total_cases_processed), 0) as total_cases_processed,
        COALESCE(SUM(quarantined_items_count), 0) as total_quarantined,
        COALESCE(AVG(risk_score), 0.0) as average_risk_score,
        COUNT(CASE WHEN domain = 'quarantine_strike_ledger' THEN 1 END) as total_strike_rules,
        COUNT(CASE WHEN domain = 'minor_child_persona_shield' THEN 1 END) as total_child_shields,
        COUNT(CASE WHEN domain = 'appeals_tribunal_review' THEN 1 END) as total_tribunal_chambers,
        COUNT(CASE WHEN domain = 'copyright_content_id' THEN 1 END) as total_copyright_engines,
        COALESCE(SUM(CASE WHEN strike_level != 'CLEAN' THEN quarantined_items_count ELSE 0 END), 0) as active_penalty_holds
      FROM content_moderation_console_items
    `);

    const domainBreakdown = await pool.query(`
      SELECT
        domain,
        COUNT(*) as count,
        COALESCE(SUM(total_cases_processed), 0) as domain_cases,
        COALESCE(SUM(quarantined_items_count), 0) as domain_quarantined,
        COALESCE(AVG(risk_score), 0.0) as avg_risk
      FROM content_moderation_console_items
      GROUP BY domain
      ORDER BY domain_cases DESC
    `);

    const spawnsCount = await pool.query(`SELECT COUNT(*) as total FROM content_moderation_console_spawns`);

    return res.json({
      success: true,
      data: {
        summary: statsResult.rows[0],
        domains: domainBreakdown.rows,
        totalSpawns: parseInt(spawnsCount.rows[0]?.total || 0, 10),
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Error fetching content moderation overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/content-moderation-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { domain } = req.query;
    let query = 'SELECT * FROM content_moderation_console_items';
    const params = [];

    if (domain && domain !== 'all') {
      if (!VALID_DOMAINS.includes(domain)) {
        return res.status(400).json({ success: false, message: `Invalid domain: ${domain}` });
      }
      query += ' WHERE domain = $1';
      params.push(domain);
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    const result = await pool.query(query, params);
    return res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (err) {
    console.error('Error listing content moderation items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/content-moderation-console/items/:id
 */
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM content_moderation_console_items WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Content moderation item not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error getting content moderation item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/content-moderation-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      domain,
      name,
      code,
      category,
      risk_score,
      strike_level,
      action_policy,
      total_cases_processed,
      quarantined_items_count,
      evidence_manifest_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    if (!domain || !name || !code || !category) {
      return res.status(400).json({
        success: false,
        message: 'domain, name, code, and category are required'
      });
    }

    if (!VALID_DOMAINS.includes(domain)) {
      return res.status(400).json({ success: false, message: `Invalid domain: ${domain}` });
    }

    // Auto-calculate next display_order for domain
    const orderRes = await pool.query(
      'SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM content_moderation_console_items WHERE domain = $1',
      [domain]
    );
    const nextOrder = orderRes.rows[0].next_order;

    const insertQuery = `
      INSERT INTO content_moderation_console_items (
        domain, name, code, category, status, display_order, risk_score,
        strike_level, action_policy, total_cases_processed, quarantined_items_count,
        evidence_manifest_url, voice_tag, notes, metadata
      ) VALUES ($1, $2, $3, $4, 'active', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      domain,
      name,
      code.toUpperCase().replace(/\s+/g, '-'),
      category,
      nextOrder,
      risk_score !== undefined ? parseFloat(risk_score) : 0.00,
      strike_level || 'CLEAN',
      action_policy || 'AUTO-FLAG',
      total_cases_processed !== undefined ? parseInt(total_cases_processed, 10) : 0,
      quarantined_items_count !== undefined ? parseInt(quarantined_items_count, 10) : 0,
      evidence_manifest_url || null,
      voice_tag || 'wahala',
      notes || null,
      metadata || {}
    ];

    const result = await pool.query(insertQuery, values);
    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Content moderation policy registered successfully'
    });
  } catch (err) {
    console.error('Error creating content moderation item:', err);
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'An item with this system code already exists' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/content-moderation-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      status,
      risk_score,
      strike_level,
      action_policy,
      total_cases_processed,
      quarantined_items_count,
      evidence_manifest_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    const fields = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
    if (code !== undefined) { fields.push(`code = $${idx++}`); values.push(code.toUpperCase()); }
    if (category !== undefined) { fields.push(`category = $${idx++}`); values.push(category); }
    if (status !== undefined) { fields.push(`status = $${idx++}`); values.push(status); }
    if (risk_score !== undefined) { fields.push(`risk_score = $${idx++}`); values.push(parseFloat(risk_score)); }
    if (strike_level !== undefined) { fields.push(`strike_level = $${idx++}`); values.push(strike_level); }
    if (action_policy !== undefined) { fields.push(`action_policy = $${idx++}`); values.push(action_policy); }
    if (total_cases_processed !== undefined) { fields.push(`total_cases_processed = $${idx++}`); values.push(parseInt(total_cases_processed, 10)); }
    if (quarantined_items_count !== undefined) { fields.push(`quarantined_items_count = $${idx++}`); values.push(parseInt(quarantined_items_count, 10)); }
    if (evidence_manifest_url !== undefined) { fields.push(`evidence_manifest_url = $${idx++}`); values.push(evidence_manifest_url); }
    if (voice_tag !== undefined) { fields.push(`voice_tag = $${idx++}`); values.push(voice_tag); }
    if (notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(notes); }
    if (metadata !== undefined) { fields.push(`metadata = $${idx++}`); values.push(metadata); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update' });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const updateQuery = `
      UPDATE content_moderation_console_items
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Content moderation item not found' });
    }

    return res.json({
      success: true,
      data: result.rows[0],
      message: 'Content moderation item updated successfully'
    });
  } catch (err) {
    console.error('Error updating content moderation item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PATCH /api/content-moderation-console/items/:id/freeze
 */
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await pool.query('SELECT status FROM content_moderation_console_items WHERE id = $1', [id]);
    if (current.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const nextStatus = current.rows[0].status === 'active' ? 'frozen' : 'active';
    const result = await pool.query(
      'UPDATE content_moderation_console_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [nextStatus, id]
    );

    return res.json({
      success: true,
      data: result.rows[0],
      message: `Content moderation item is now ${nextStatus}`
    });
  } catch (err) {
    console.error('Error toggling content moderation item freeze:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/content-moderation-console/reorder
 */
exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ success: false, message: 'orders array of { id, display_order } is required' });
    }

    await client.query('BEGIN');
    for (const item of orders) {
      await client.query(
        'UPDATE content_moderation_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [item.display_order, item.id]
      );
    }
    await client.query('COMMIT');

    return res.json({ success: true, message: 'Reordered items successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering content moderation items:', err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

/**
 * DELETE /api/content-moderation-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM content_moderation_console_items WHERE id = $1 RETURNING id, name', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    return res.json({
      success: true,
      message: `Decommissioned moderation rule "${result.rows[0].name}"`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting content moderation item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/content-moderation-console/upload
 */
exports.uploadMedia = [
  upload.single('media'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const fileUrl = `/uploads/moderation/${req.file.filename}`;
      const { itemId, field = 'evidence_manifest_url' } = req.body;

      if (itemId) {
        await pool.query(
          `UPDATE content_moderation_console_items SET ${field} = $1, updated_at = NOW() WHERE id = $2`,
          [fileUrl, itemId]
        );
      }

      return res.json({
        success: true,
        data: {
          fileUrl,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype
        },
        message: 'Evidence document / manifest uploaded successfully'
      });
    } catch (err) {
      console.error('Error uploading moderation evidence document:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
];

/**
 * POST /api/content-moderation-console/spawns
 */
exports.spawnConsole = async (req, res) => {
  try {
    const { console_title, target_domain, icon_name = 'ShieldAlert', badge_text = 'SAFETY-CORE', config = {} } = req.body;
    if (!console_title || !target_domain) {
      return res.status(400).json({ success: false, message: 'console_title and target_domain are required' });
    }

    const route = `/admin/moderation-${target_domain.replace(/_/g, '-')}`;

    const insertQuery = `
      INSERT INTO content_moderation_console_spawns (
        console_title, target_domain, route, icon_name, badge_text, status, config
      ) VALUES ($1, $2, $3, $4, $5, 'active', $6)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      console_title,
      target_domain,
      route,
      icon_name,
      badge_text,
      config
    ]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: `Spawned dynamic sovereign console "${console_title}"`
    });
  } catch (err) {
    console.error('Error spawning content moderation console:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/content-moderation-console/spawns
 */
exports.getSpawnedConsoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM content_moderation_console_spawns ORDER BY created_at DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error listing spawned content moderation consoles:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
