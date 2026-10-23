/**
 * Members, RBAC Permissions & Organization Citadel Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 8: Sovereign RBAC Matrix, Pages Permission Gates, Merchant Citadel KYC, Dignitaries Council, Session Scopes & Membership Tiers
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

// Multer storage for credential certs, CAC registration documents, council charters, token manifests
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/rbac');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `rbac_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB limit for corporate manifests and credential certificates
});

const VALID_DOMAINS = [
  'sovereign_rbac_matrix',
  'pages_permission_gates',
  'merchant_organization_kyc',
  'council_dignitaries_ledger',
  'session_token_scopes',
  'membership_loyalty_tiers'
];

/**
 * GET /api/rbac-permissions-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(assigned_members_count), 0) as total_assigned_members,
        COUNT(CASE WHEN domain = 'sovereign_rbac_matrix' THEN 1 END) as total_roles,
        COUNT(CASE WHEN domain = 'pages_permission_gates' THEN 1 END) as total_route_gates,
        COUNT(CASE WHEN domain = 'merchant_organization_kyc' THEN 1 END) as total_merchant_citadels,
        COUNT(CASE WHEN domain = 'council_dignitaries_ledger' THEN 1 END) as total_dignitaries,
        COUNT(CASE WHEN domain = 'session_token_scopes' THEN 1 END) as total_session_rules,
        COUNT(CASE WHEN domain = 'membership_loyalty_tiers' THEN 1 END) as total_loyalty_tiers
      FROM rbac_permissions_console_items
    `);

    const domainBreakdown = await pool.query(`
      SELECT
        domain,
        COUNT(*) as count,
        COALESCE(SUM(assigned_members_count), 0) as domain_members
      FROM rbac_permissions_console_items
      GROUP BY domain
      ORDER BY domain_members DESC
    `);

    const spawnsCount = await pool.query(`SELECT COUNT(*) as total FROM rbac_permissions_console_spawns`);

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
    console.error('Error fetching RBAC permissions overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/rbac-permissions-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { domain } = req.query;
    let query = 'SELECT * FROM rbac_permissions_console_items';
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
    console.error('Error listing RBAC permissions items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/rbac-permissions-console/items/:id
 */
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM rbac_permissions_console_items WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'RBAC permissions item not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error getting RBAC permissions item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/rbac-permissions-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      domain,
      name,
      code,
      category,
      role_tier,
      permission_level,
      assigned_members_count,
      route_scope,
      credential_cert_url,
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
      'SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM rbac_permissions_console_items WHERE domain = $1',
      [domain]
    );
    const nextOrder = orderRes.rows[0].next_order;

    const insertQuery = `
      INSERT INTO rbac_permissions_console_items (
        domain, name, code, category, status, display_order, role_tier,
        permission_level, assigned_members_count, route_scope,
        credential_cert_url, voice_tag, notes, metadata
      ) VALUES ($1, $2, $3, $4, 'active', $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      domain,
      name,
      code.toUpperCase().replace(/\s+/g, '-'),
      category,
      nextOrder,
      role_tier || 'Standard Role',
      permission_level || 'READ_WRITE',
      assigned_members_count !== undefined ? parseInt(assigned_members_count, 10) : 0,
      route_scope || '/admin/*',
      credential_cert_url || null,
      voice_tag || 'gbaski',
      notes || null,
      metadata || {}
    ];

    const result = await pool.query(insertQuery, values);
    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'RBAC permission item registered successfully'
    });
  } catch (err) {
    console.error('Error creating RBAC permission item:', err);
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'An item with this system code already exists' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/rbac-permissions-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      status,
      role_tier,
      permission_level,
      assigned_members_count,
      route_scope,
      credential_cert_url,
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
    if (role_tier !== undefined) { fields.push(`role_tier = $${idx++}`); values.push(role_tier); }
    if (permission_level !== undefined) { fields.push(`permission_level = $${idx++}`); values.push(permission_level); }
    if (assigned_members_count !== undefined) { fields.push(`assigned_members_count = $${idx++}`); values.push(parseInt(assigned_members_count, 10)); }
    if (route_scope !== undefined) { fields.push(`route_scope = $${idx++}`); values.push(route_scope); }
    if (credential_cert_url !== undefined) { fields.push(`credential_cert_url = $${idx++}`); values.push(credential_cert_url); }
    if (voice_tag !== undefined) { fields.push(`voice_tag = $${idx++}`); values.push(voice_tag); }
    if (notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(notes); }
    if (metadata !== undefined) { fields.push(`metadata = $${idx++}`); values.push(metadata); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update' });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const updateQuery = `
      UPDATE rbac_permissions_console_items
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'RBAC permissions item not found' });
    }

    return res.json({
      success: true,
      data: result.rows[0],
      message: 'RBAC permissions item updated successfully'
    });
  } catch (err) {
    console.error('Error updating RBAC permissions item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PATCH /api/rbac-permissions-console/items/:id/freeze
 */
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await pool.query('SELECT status FROM rbac_permissions_console_items WHERE id = $1', [id]);
    if (current.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const nextStatus = current.rows[0].status === 'active' ? 'frozen' : 'active';
    const result = await pool.query(
      'UPDATE rbac_permissions_console_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [nextStatus, id]
    );

    return res.json({
      success: true,
      data: result.rows[0],
      message: `RBAC permission rule is now ${nextStatus}`
    });
  } catch (err) {
    console.error('Error toggling RBAC permission freeze:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/rbac-permissions-console/reorder
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
        'UPDATE rbac_permissions_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [item.display_order, item.id]
      );
    }
    await client.query('COMMIT');

    return res.json({ success: true, message: 'Reordered items successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering RBAC items:', err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

/**
 * DELETE /api/rbac-permissions-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM rbac_permissions_console_items WHERE id = $1 RETURNING id, name', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    return res.json({
      success: true,
      message: `Decommissioned RBAC rule "${result.rows[0].name}"`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting RBAC item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/rbac-permissions-console/upload
 */
exports.uploadMedia = [
  upload.single('media'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const fileUrl = `/uploads/rbac/${req.file.filename}`;
      const { itemId, field = 'credential_cert_url' } = req.body;

      if (itemId) {
        await pool.query(
          `UPDATE rbac_permissions_console_items SET ${field} = $1, updated_at = NOW() WHERE id = $2`,
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
        message: 'Credential certificate / CAC corporate manifest uploaded successfully'
      });
    } catch (err) {
      console.error('Error uploading RBAC credential document:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
];

/**
 * POST /api/rbac-permissions-console/spawns
 */
exports.spawnConsole = async (req, res) => {
  try {
    const { console_title, target_domain, icon_name = 'Users', badge_text = 'RBAC-CITADEL', config = {} } = req.body;
    if (!console_title || !target_domain) {
      return res.status(400).json({ success: false, message: 'console_title and target_domain are required' });
    }

    const route = `/admin/rbac-${target_domain.replace(/_/g, '-')}`;

    const insertQuery = `
      INSERT INTO rbac_permissions_console_spawns (
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
    console.error('Error spawning RBAC console:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/rbac-permissions-console/spawns
 */
exports.getSpawnedConsoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rbac_permissions_console_spawns ORDER BY created_at DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error listing spawned RBAC consoles:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
