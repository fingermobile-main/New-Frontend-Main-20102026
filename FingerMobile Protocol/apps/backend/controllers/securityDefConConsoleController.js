/**
 * Security, DefCon Threats & Hardware Enclaves Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 5: Camus Hardware Enclaves, Threat Heuristics, DDoS Throttles, Cryptographic Vaults, ZK Privacy & DefCon Isolation
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

// Multer storage for security certificates, attestation proofs, eBPF binaries, runbooks
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/security');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `sec_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 } // 40MB limit for forensic logs and attestation proofs
});

const VALID_DOMAINS = [
  'camus_hardware_enclave',
  'threat_heuristics_ddos',
  'cryptographic_key_vaults',
  'zk_privacy_audits',
  'zero_trust_access',
  'incident_containment'
];

/**
 * GET /api/security-defcon-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(blocked_events), 0) as total_blocked_events,
        COALESCE(SUM(packets_per_sec), 0) as total_packets_per_sec,
        COALESCE(AVG(security_rating), 100) as average_security_rating,
        COUNT(CASE WHEN domain = 'camus_hardware_enclave' THEN 1 END) as total_enclaves,
        COUNT(CASE WHEN domain = 'cryptographic_key_vaults' THEN 1 END) as total_vaults,
        COUNT(CASE WHEN domain = 'zk_privacy_audits' THEN 1 END) as total_zk_provers,
        COUNT(CASE WHEN domain = 'threat_heuristics_ddos' THEN 1 END) as total_ddos_shields,
        COUNT(CASE WHEN threat_severity = 'CRITICAL' THEN 1 END) as critical_threat_nodes
      FROM security_defcon_console_items
    `);

    const domainBreakdown = await pool.query(`
      SELECT
        domain,
        COUNT(*) as count,
        COALESCE(SUM(blocked_events), 0) as domain_blocked,
        COALESCE(AVG(security_rating), 100) as avg_rating
      FROM security_defcon_console_items
      GROUP BY domain
      ORDER BY count DESC
    `);

    const spawnsCount = await pool.query(`SELECT COUNT(*) as total FROM security_defcon_console_spawns`);

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
    console.error('Error fetching security defcon overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/security-defcon-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { domain } = req.query;
    let query = 'SELECT * FROM security_defcon_console_items';
    const params = [];

    if (domain && domain !== 'all') {
      query += ' WHERE domain = $1';
      params.push(domain);
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    const result = await pool.query(query, params);
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching security defcon items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/security-defcon-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      domain,
      name,
      code,
      category,
      enclave_zone,
      threat_severity,
      packets_per_sec,
      blocked_events,
      security_rating,
      enclave_cert_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    if (!domain || !name || !code || !category) {
      return res.status(400).json({
        success: false,
        message: 'Fields domain, name, code, and category are required'
      });
    }

    if (!VALID_DOMAINS.includes(domain)) {
      return res.status(400).json({
        success: false,
        message: `Invalid domain "${domain}". Valid domains: ${VALID_DOMAINS.join(', ')}`
      });
    }

    // Determine next display_order for this domain
    const orderRes = await pool.query(
      'SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM security_defcon_console_items WHERE domain = $1',
      [domain]
    );
    const nextOrder = orderRes.rows[0].next_order;

    const id = `sec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const insertResult = await pool.query(`
      INSERT INTO security_defcon_console_items (
        id, domain, name, code, category, status, display_order,
        enclave_zone, threat_severity, packets_per_sec, blocked_events,
        security_rating, enclave_cert_url, voice_tag, notes, metadata,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, 'active', $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        NOW(), NOW()
      ) RETURNING *
    `, [
      id,
      domain,
      name,
      code,
      category,
      nextOrder,
      enclave_zone || 'default-enclave-zone',
      threat_severity || 'LOW',
      packets_per_sec ? parseFloat(packets_per_sec) : 0.0,
      blocked_events ? parseInt(blocked_events, 10) : 0,
      security_rating ? parseFloat(security_rating) : 100.0,
      enclave_cert_url || null,
      voice_tag || 'gbaski',
      notes || null,
      metadata ? JSON.stringify(metadata) : '{}'
    ]);

    return res.status(201).json({
      success: true,
      message: `Security node "${name}" armed and registered into PostgreSQL`,
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating security defcon item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/security-defcon-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      enclave_zone,
      threat_severity,
      packets_per_sec,
      blocked_events,
      security_rating,
      enclave_cert_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    const existingRes = await pool.query('SELECT * FROM security_defcon_console_items WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Security node "${id}" not found` });
    }

    const current = existingRes.rows[0];

    const updatedResult = await pool.query(`
      UPDATE security_defcon_console_items SET
        name = COALESCE($1, name),
        code = COALESCE($2, code),
        category = COALESCE($3, category),
        enclave_zone = COALESCE($4, enclave_zone),
        threat_severity = COALESCE($5, threat_severity),
        packets_per_sec = COALESCE($6, packets_per_sec),
        blocked_events = COALESCE($7, blocked_events),
        security_rating = COALESCE($8, security_rating),
        enclave_cert_url = COALESCE($9, enclave_cert_url),
        voice_tag = COALESCE($10, voice_tag),
        notes = COALESCE($11, notes),
        metadata = COALESCE($12, metadata),
        updated_at = NOW()
      WHERE id = $13
      RETURNING *
    `, [
      name !== undefined ? name : current.name,
      code !== undefined ? code : current.code,
      category !== undefined ? category : current.category,
      enclave_zone !== undefined ? enclave_zone : current.enclave_zone,
      threat_severity !== undefined ? threat_severity : current.threat_severity,
      packets_per_sec !== undefined ? parseFloat(packets_per_sec) : current.packets_per_sec,
      blocked_events !== undefined ? parseInt(blocked_events, 10) : current.blocked_events,
      security_rating !== undefined ? parseFloat(security_rating) : current.security_rating,
      enclave_cert_url !== undefined ? enclave_cert_url : current.enclave_cert_url,
      voice_tag !== undefined ? voice_tag : current.voice_tag,
      notes !== undefined ? notes : current.notes,
      metadata !== undefined ? JSON.stringify(metadata) : current.metadata,
      id
    ]);

    return res.json({
      success: true,
      message: `Security node "${updatedResult.rows[0].name}" updated in PostgreSQL`,
      data: updatedResult.rows[0]
    });
  } catch (err) {
    console.error('Error updating security defcon item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PATCH /api/security-defcon-console/items/:id/freeze
 */
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT status, name FROM security_defcon_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Security node "${id}" not found` });
    }

    const currentStatus = existing.rows[0].status;
    const newStatus = currentStatus === 'active' ? 'frozen' : 'active';

    const result = await pool.query(
      'UPDATE security_defcon_console_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    return res.json({
      success: true,
      message: `Security node "${existing.rows[0].name}" status toggled to "${newStatus}"`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error toggling freeze on security defcon item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/security-defcon-console/reorder
 */
exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty orders array' });
    }

    await client.query('BEGIN');
    for (const item of orders) {
      await client.query(
        'UPDATE security_defcon_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [item.display_order, item.id]
      );
    }
    await client.query('COMMIT');

    return res.json({
      success: true,
      message: `Successfully re-sequenced ${orders.length} security policies transactionally`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering security defcon items:', err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

/**
 * DELETE /api/security-defcon-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT name FROM security_defcon_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Security node "${id}" not found` });
    }

    await pool.query('DELETE FROM security_defcon_console_items WHERE id = $1', [id]);
    return res.json({
      success: true,
      message: `Decommissioned and deleted security policy "${existing.rows[0].name}"`
    });
  } catch (err) {
    console.error('Error deleting security defcon item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/security-defcon-console/upload
 */
exports.uploadMiddleware = upload.single('media');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/security/${req.file.filename}`;
    const { itemId, field } = req.body;

    if (itemId) {
      const targetField = field || 'enclave_cert_url';
      await pool.query(
        `UPDATE security_defcon_console_items SET ${targetField} = $1, updated_at = NOW() WHERE id = $2`,
        [fileUrl, itemId]
      );
    }

    return res.json({
      success: true,
      message: 'Security attestation certificate uploaded successfully directly to Express backend',
      data: {
        fileUrl,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (err) {
    console.error('Error uploading security certificate:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/security-defcon-console/spawns
 */
exports.createSpawn = async (req, res) => {
  try {
    const { console_title, target_domain, icon_name, badge_text, config } = req.body;

    if (!console_title || !target_domain) {
      return res.status(400).json({
        success: false,
        message: 'console_title and target_domain are required'
      });
    }

    const id = `sec_spw_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const routeSlug = console_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const route = `/admin/security-console/${routeSlug}`;

    const insertResult = await pool.query(`
      INSERT INTO security_defcon_console_spawns (
        id, console_title, target_domain, route, icon_name, badge_text, status, config, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 'active', $7, NOW()
      ) RETURNING *
    `, [
      id,
      console_title,
      target_domain,
      route,
      icon_name || 'ShieldCheck',
      badge_text || 'SOVEREIGN',
      config ? JSON.stringify(config) : '{}'
    ]);

    return res.status(201).json({
      success: true,
      message: `Security console "${console_title}" dynamically spawned at ${route}`,
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating security console spawn:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/security-defcon-console/spawns
 */
exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM security_defcon_console_spawns ORDER BY created_at DESC'
    );
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching security console spawns:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
