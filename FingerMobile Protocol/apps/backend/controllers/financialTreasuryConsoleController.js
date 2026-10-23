/**
 * Financial & Treasury Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Option C: Unified Financials & Treasury Console (Master wallet escrows, protocol fee minting, automated SuperVi tournament prize pools)
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

// Multer storage for financial invoices, regulatory docs & tournament proofs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/financial');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `fin_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit for audited financial manifests
});

const VALID_DOMAINS = [
  'escrows',
  'fee_minting',
  'prize_pools',
  'vat_tax',
  'payout_rails',
  'sovereign_audits'
];

/**
 * GET /api/financial-treasury-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(balance_fic), 0) as total_fic_held,
        COALESCE(SUM(balance_fiat), 0) as total_fiat_reserve,
        COALESCE(SUM(CASE WHEN domain = 'escrows' THEN balance_fic ELSE 0 END), 0) as escrow_fic,
        COALESCE(SUM(CASE WHEN domain = 'prize_pools' THEN balance_fic ELSE 0 END), 0) as prize_pool_fic,
        COALESCE(SUM(CASE WHEN domain = 'fee_minting' THEN balance_fic ELSE 0 END), 0) as fee_minted_fic,
        COALESCE(SUM(CASE WHEN domain = 'vat_tax' THEN balance_fiat ELSE 0 END), 0) as tax_holding_fiat
      FROM financial_treasury_console_items
    `);

    const domainCounts = await pool.query(`
      SELECT domain, COUNT(*) as count,
        COALESCE(SUM(balance_fic), 0) as domain_fic,
        COALESCE(SUM(balance_fiat), 0) as domain_fiat
      FROM financial_treasury_console_items
      GROUP BY domain
    `);

    const spawnsCount = await pool.query(`SELECT COUNT(*) as count FROM financial_treasury_console_spawns`);

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
    console.error('[FinancialTreasuryConsole] getOverview error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve overview metrics', error: err.message });
  }
};

/**
 * GET /api/financial-treasury-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { domain } = req.query;
    let query = 'SELECT * FROM financial_treasury_console_items';
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
    console.error('[FinancialTreasuryConsole] getItems error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve console items', error: err.message });
  }
};

/**
 * POST /api/financial-treasury-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      domain,
      name,
      code,
      category,
      balance_fic,
      balance_fiat,
      currency,
      fee_percent,
      recipient_address,
      multisig_threshold,
      supervi_tournament_id,
      proof_attachment_url,
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
      'SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM financial_treasury_console_items WHERE domain = $1',
      [domain]
    );
    const display_order = orderRes.rows[0].next_order;
    const id = `fin_${domain.slice(0, 4)}_${Date.now()}`;

    const insertQuery = `
      INSERT INTO financial_treasury_console_items (
        id, domain, name, code, category, status, display_order,
        balance_fic, balance_fiat, currency, fee_percent, recipient_address,
        multisig_threshold, supervi_tournament_id, proof_attachment_url,
        voice_tag, notes, metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, 'active', $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      id,
      domain,
      name,
      code,
      category || 'Treasury Ledger',
      display_order,
      parseFloat(balance_fic) || 0,
      parseFloat(balance_fiat) || 0,
      currency || 'NGN',
      parseFloat(fee_percent) || 0,
      recipient_address || null,
      multisig_threshold || null,
      supervi_tournament_id || null,
      proof_attachment_url || null,
      voice_tag || 'sharp',
      notes || '',
      JSON.stringify(metadata || {})
    ];

    const result = await pool.query(insertQuery, values);

    return res.status(201).json({
      success: true,
      message: `Created financial console item "${name}" successfully`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[FinancialTreasuryConsole] createItem error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create financial item', error: err.message });
  }
};

/**
 * PUT /api/financial-treasury-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      balance_fic,
      balance_fiat,
      currency,
      fee_percent,
      recipient_address,
      multisig_threshold,
      supervi_tournament_id,
      proof_attachment_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    const existing = await pool.query('SELECT * FROM financial_treasury_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Financial item with ID "${id}" not found` });
    }

    const item = existing.rows[0];

    const updateQuery = `
      UPDATE financial_treasury_console_items SET
        name = COALESCE($1, name),
        code = COALESCE($2, code),
        category = COALESCE($3, category),
        balance_fic = COALESCE($4, balance_fic),
        balance_fiat = COALESCE($5, balance_fiat),
        currency = COALESCE($6, currency),
        fee_percent = COALESCE($7, fee_percent),
        recipient_address = COALESCE($8, recipient_address),
        multisig_threshold = COALESCE($9, multisig_threshold),
        supervi_tournament_id = COALESCE($10, supervi_tournament_id),
        proof_attachment_url = COALESCE($11, proof_attachment_url),
        voice_tag = COALESCE($12, voice_tag),
        notes = COALESCE($13, notes),
        metadata = COALESCE($14, metadata),
        updated_at = NOW()
      WHERE id = $15
      RETURNING *
    `;

    const values = [
      name ?? item.name,
      code ?? item.code,
      category ?? item.category,
      balance_fic !== undefined ? parseFloat(balance_fic) : item.balance_fic,
      balance_fiat !== undefined ? parseFloat(balance_fiat) : item.balance_fiat,
      currency ?? item.currency,
      fee_percent !== undefined ? parseFloat(fee_percent) : item.fee_percent,
      recipient_address !== undefined ? recipient_address : item.recipient_address,
      multisig_threshold !== undefined ? multisig_threshold : item.multisig_threshold,
      supervi_tournament_id !== undefined ? supervi_tournament_id : item.supervi_tournament_id,
      proof_attachment_url !== undefined ? proof_attachment_url : item.proof_attachment_url,
      voice_tag !== undefined ? voice_tag : item.voice_tag,
      notes !== undefined ? notes : item.notes,
      metadata ? JSON.stringify(metadata) : item.metadata,
      id
    ];

    const result = await pool.query(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: `Financial item "${id}" updated successfully`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[FinancialTreasuryConsole] updateItem error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update financial item', error: err.message });
  }
};

/**
 * PATCH /api/financial-treasury-console/items/:id/freeze
 */
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT status, name FROM financial_treasury_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Financial item "${id}" not found` });
    }

    const currentStatus = existing.rows[0].status;
    const newStatus = currentStatus === 'frozen' ? 'active' : 'frozen';

    const result = await pool.query(
      'UPDATE financial_treasury_console_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    return res.status(200).json({
      success: true,
      message: `Financial item "${existing.rows[0].name}" status toggled to "${newStatus}"`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[FinancialTreasuryConsole] toggleFreeze error:', err);
    return res.status(500).json({ success: false, message: 'Failed to toggle freeze state', error: err.message });
  }
};

/**
 * POST /api/financial-treasury-console/reorder
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
        'UPDATE financial_treasury_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [entry.display_order, entry.id]
      );
    }
    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: `Successfully re-sequenced ${orders.length} financial items transactionally`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[FinancialTreasuryConsole] reorderItems error:', err);
    return res.status(500).json({ success: false, message: 'Transactional reordering failed', error: err.message });
  } finally {
    client.release();
  }
};

/**
 * DELETE /api/financial-treasury-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM financial_treasury_console_items WHERE id = $1 RETURNING name', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: `Financial item "${id}" not found` });
    }
    return res.status(200).json({
      success: true,
      message: `Financial item "${result.rows[0].name}" purged successfully`
    });
  } catch (err) {
    console.error('[FinancialTreasuryConsole] deleteItem error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete financial item', error: err.message });
  }
};

/**
 * POST /api/financial-treasury-console/upload
 */
exports.uploadMiddleware = upload.single('media');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file received in multipart/form-data request' });
    }

    const publicUrl = `/uploads/financial/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'Financial file successfully uploaded to backend Express disk storage',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        url: publicUrl
      }
    });
  } catch (err) {
    console.error('[FinancialTreasuryConsole] uploadMedia error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process file upload', error: err.message });
  }
};

/**
 * POST /api/financial-treasury-console/spawns
 */
exports.createSpawn = async (req, res) => {
  try {
    const { console_title, target_domain, route, icon_name, badge_text, config } = req.body;
    if (!console_title || !target_domain) {
      return res.status(400).json({ success: false, message: 'console_title and target_domain are required' });
    }

    const id = `fin_spawn_${Date.now()}`;
    const generatedRoute = route || `/financial-treasury/${target_domain}/${id}`;

    const result = await pool.query(`
      INSERT INTO financial_treasury_console_spawns (
        id, console_title, target_domain, route, icon_name, badge_text, status, config, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'active', $7, NOW())
      RETURNING *
    `, [
      id,
      console_title,
      target_domain,
      generatedRoute,
      icon_name || 'Landmark',
      badge_text || 'Active Console',
      JSON.stringify(config || {})
    ]);

    return res.status(201).json({
      success: true,
      message: `Spawned autonomous financial console "${console_title}" successfully`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[FinancialTreasuryConsole] createSpawn error:', err);
    return res.status(500).json({ success: false, message: 'Failed to spawn financial console', error: err.message });
  }
};

/**
 * GET /api/financial-treasury-console/spawns
 */
exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM financial_treasury_console_spawns ORDER BY created_at DESC');
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('[FinancialTreasuryConsole] getSpawns error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve spawned consoles', error: err.message });
  }
};
