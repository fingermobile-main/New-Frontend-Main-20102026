/**
 * Corporate Governance Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 2: 18 Corporate Portfolios, Committee Chambers, DPO/NDPR, AML/KYC, Ethics & Statutory Licensing
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

// Multer storage for regulatory appointment deeds, charters & license certificates
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/governance');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `gov_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB limit for signed legal deeds
});

const VALID_DOMAINS = [
  'board_portfolios',
  'committee_chambers',
  'dpo_privacy',
  'compliance_aml',
  'whistleblower_ethics',
  'statutory_licensing'
];

/**
 * GET /api/corporate-governance-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(personnel_count), 0) as total_personnel,
        COALESCE(AVG(compliance_score), 100) as average_compliance_score,
        COUNT(CASE WHEN domain = 'board_portfolios' THEN 1 END) as total_portfolios,
        COUNT(CASE WHEN domain = 'committee_chambers' THEN 1 END) as total_committees,
        COUNT(CASE WHEN domain = 'dpo_privacy' THEN 1 END) as total_privacy_audits,
        COUNT(CASE WHEN domain = 'statutory_licensing' THEN 1 END) as total_licenses
      FROM corporate_governance_console_items
    `);

    const domainCounts = await pool.query(`
      SELECT domain, COUNT(*) as count,
        COALESCE(SUM(personnel_count), 0) as domain_personnel,
        COALESCE(AVG(compliance_score), 100) as avg_score
      FROM corporate_governance_console_items
      GROUP BY domain
    `);

    const spawnsCount = await pool.query('SELECT COUNT(*) as count FROM corporate_governance_console_spawns');

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
    console.error('[CorporateGovernanceConsole] getOverview error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve overview metrics', error: err.message });
  }
};

/**
 * GET /api/corporate-governance-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { domain } = req.query;
    let query = 'SELECT * FROM corporate_governance_console_items';
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
    console.error('[CorporateGovernanceConsole] getItems error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve governance console items', error: err.message });
  }
};

/**
 * POST /api/corporate-governance-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      domain,
      name,
      code,
      category,
      mandate_title,
      designated_officer,
      clearance_level,
      personnel_count,
      compliance_score,
      charter_document_url,
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
      'SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM corporate_governance_console_items WHERE domain = $1',
      [domain]
    );
    const display_order = orderRes.rows[0].next_order;
    const id = `gov_${domain.slice(0, 4)}_${Date.now()}`;

    const insertQuery = `
      INSERT INTO corporate_governance_console_items (
        id, domain, name, code, category, status, display_order,
        mandate_title, designated_officer, clearance_level, personnel_count,
        compliance_score, charter_document_url, voice_tag, notes, metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, 'active', $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      id,
      domain,
      name,
      code,
      category || 'Corporate Portfolio',
      display_order,
      mandate_title || null,
      designated_officer || null,
      clearance_level || 'L3-Officer',
      parseInt(personnel_count, 10) || 1,
      parseFloat(compliance_score) || 100.00,
      charter_document_url || null,
      voice_tag || 'sharp',
      notes || '',
      JSON.stringify(metadata || {})
    ];

    const result = await pool.query(insertQuery, values);

    return res.status(201).json({
      success: true,
      message: `Created corporate governance item "${name}" successfully`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[CorporateGovernanceConsole] createItem error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create governance item', error: err.message });
  }
};

/**
 * PUT /api/corporate-governance-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      mandate_title,
      designated_officer,
      clearance_level,
      personnel_count,
      compliance_score,
      charter_document_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    const existing = await pool.query('SELECT * FROM corporate_governance_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Governance item with ID "${id}" not found` });
    }

    const item = existing.rows[0];

    const updateQuery = `
      UPDATE corporate_governance_console_items SET
        name = COALESCE($1, name),
        code = COALESCE($2, code),
        category = COALESCE($3, category),
        mandate_title = COALESCE($4, mandate_title),
        designated_officer = COALESCE($5, designated_officer),
        clearance_level = COALESCE($6, clearance_level),
        personnel_count = COALESCE($7, personnel_count),
        compliance_score = COALESCE($8, compliance_score),
        charter_document_url = COALESCE($9, charter_document_url),
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
      mandate_title !== undefined ? mandate_title : item.mandate_title,
      designated_officer !== undefined ? designated_officer : item.designated_officer,
      clearance_level !== undefined ? clearance_level : item.clearance_level,
      personnel_count !== undefined ? parseInt(personnel_count, 10) : item.personnel_count,
      compliance_score !== undefined ? parseFloat(compliance_score) : item.compliance_score,
      charter_document_url !== undefined ? charter_document_url : item.charter_document_url,
      voice_tag !== undefined ? voice_tag : item.voice_tag,
      notes !== undefined ? notes : item.notes,
      metadata ? JSON.stringify(metadata) : item.metadata,
      id
    ];

    const result = await pool.query(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: `Governance item "${id}" updated successfully`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[CorporateGovernanceConsole] updateItem error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update governance item', error: err.message });
  }
};

/**
 * PATCH /api/corporate-governance-console/items/:id/freeze
 */
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT status, name FROM corporate_governance_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Governance item "${id}" not found` });
    }

    const currentStatus = existing.rows[0].status;
    const newStatus = currentStatus === 'frozen' ? 'active' : 'frozen';

    const result = await pool.query(
      'UPDATE corporate_governance_console_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    return res.status(200).json({
      success: true,
      message: `Governance item "${existing.rows[0].name}" status toggled to "${newStatus}"`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[CorporateGovernanceConsole] toggleFreeze error:', err);
    return res.status(500).json({ success: false, message: 'Failed to toggle freeze state', error: err.message });
  }
};

/**
 * POST /api/corporate-governance-console/reorder
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
        'UPDATE corporate_governance_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [entry.display_order, entry.id]
      );
    }
    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: `Successfully re-sequenced ${orders.length} governance items transactionally`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[CorporateGovernanceConsole] reorderItems error:', err);
    return res.status(500).json({ success: false, message: 'Transactional reordering failed', error: err.message });
  } finally {
    client.release();
  }
};

/**
 * DELETE /api/corporate-governance-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM corporate_governance_console_items WHERE id = $1 RETURNING name', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Governance item "${id}" not found` });
    }
    return res.status(200).json({
      success: true,
      message: `Governance item "${result.rows[0].name}" purged successfully`
    });
  } catch (err) {
    console.error('[CorporateGovernanceConsole] deleteItem error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete governance item', error: err.message });
  }
};

/**
 * POST /api/corporate-governance-console/upload
 */
exports.uploadMiddleware = upload.single('media');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file received in multipart/form-data request' });
    }

    const publicUrl = `/uploads/governance/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'Governance deed successfully uploaded to Express disk storage',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        url: publicUrl
      }
    });
  } catch (err) {
    console.error('[CorporateGovernanceConsole] uploadMedia error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process file upload', error: err.message });
  }
};

/**
 * POST /api/corporate-governance-console/spawns
 */
exports.createSpawn = async (req, res) => {
  try {
    const { console_title, target_domain, route, icon_name, badge_text, config } = req.body;
    if (!console_title || !target_domain) {
      return res.status(400).json({ success: false, message: 'console_title and target_domain are required' });
    }

    const id = `gov_spawn_${Date.now()}`;
    const generatedRoute = route || `/corporate-governance/${target_domain}/${id}`;

    const result = await pool.query(`
      INSERT INTO corporate_governance_console_spawns (
        id, console_title, target_domain, route, icon_name, badge_text, status, config, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'active', $7, NOW())
      RETURNING *
    `, [
      id,
      console_title,
      target_domain,
      generatedRoute,
      icon_name || 'ShieldCheck',
      badge_text || 'Active Portfolio Console',
      JSON.stringify(config || {})
    ]);

    return res.status(201).json({
      success: true,
      message: `Spawned autonomous governance console "${console_title}" successfully`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[CorporateGovernanceConsole] createSpawn error:', err);
    return res.status(500).json({ success: false, message: 'Failed to spawn governance console', error: err.message });
  }
};

/**
 * GET /api/corporate-governance-console/spawns
 */
exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM corporate_governance_console_spawns ORDER BY created_at DESC');
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('[CorporateGovernanceConsole] getSpawns error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve spawned governance consoles', error: err.message });
  }
};
