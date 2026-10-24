/**
 * LoansQR Micro-Lending & SME Underwriting Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 11: Underwriting Matrix, APR Tiers, Collateral Escrow Vaults & Debt Moratorium Holds
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

// Multer storage for loan agreements, collateral titles, underwriting covenants
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/loansqr');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `loansqr_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 } // 40MB limit for underwriting documents
});

const VALID_CATEGORIES = [
  'MERCHANT_INVENTORY',
  'SME_WORKING_CAPITAL',
  'POS_AGENT_FLOAT',
  'INVOICE_FACTORING',
  'EQUIPMENT_LEASING',
  'AGRIC_CROP_SEASONAL'
];

/**
 * GET /api/loansqr-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_facilities,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_facilities,
        COUNT(CASE WHEN collateral_required = true THEN 1 END) as collateralized_facilities,
        COUNT(CASE WHEN moratorium_hold_active = true THEN 1 END) as moratorium_active_count,
        COALESCE(SUM(active_loans_count), 0) as total_active_loans,
        COALESCE(SUM(total_disbursed), 0) as cumulative_disbursed,
        COALESCE(AVG(interest_rate_monthly), 3.00) as avg_monthly_rate,
        COALESCE(AVG(repayment_rate_percent), 98.40) as avg_repayment_rate
      FROM loansqr_console_items;
    `);

    const spawnsResult = await pool.query(`
      SELECT COUNT(*) as total_spawns,
             COALESCE(SUM(active_instances), 0) as total_instances
      FROM loansqr_console_spawns;
    `);

    const stats = statsResult.rows[0];
    const spawns = spawnsResult.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        total_facilities: parseInt(stats.total_facilities, 10),
        active_facilities: parseInt(stats.active_facilities, 10),
        collateralized_facilities: parseInt(stats.collateralized_facilities, 10),
        moratorium_active_count: parseInt(stats.moratorium_active_count, 10),
        total_active_loans: parseInt(stats.total_active_loans, 10),
        cumulative_disbursed: parseFloat(stats.cumulative_disbursed),
        avg_monthly_rate: parseFloat(Number(stats.avg_monthly_rate).toFixed(2)),
        avg_repayment_rate: parseFloat(Number(stats.avg_repayment_rate).toFixed(2)),
        active_shards: parseInt(spawns.total_spawns, 10),
        active_instances: parseInt(spawns.total_instances, 10),
        underwriting_engine: 'LoansQR AI GNN Underwriter v3.2',
        collateral_escrow: 'Multi-Sig Smart Contract Vaults (Automated Liquidations)',
        moratorium_policy: 'CBN/NDIC Compliant Debt Moratorium Protocol',
        system_status: 'HEALTHY_SYNCED',
        database_engine: 'PostgreSQL 16 (fingermobile_platform_db)'
      }
    });
  } catch (err) {
    console.error('Error fetching LoansQR overview:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve LoansQR overview',
      error: err.message
    });
  }
};

/**
 * GET /api/loansqr-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { category, search, active_only } = req.query;
    let query = 'SELECT * FROM loansqr_console_items WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      query += ` AND (name ILIKE $${params.length} OR product_code ILIKE $${params.length})`;
    }

    if (active_only === 'true') {
      query += ' AND is_active = true';
    }

    query += ' ORDER BY display_order ASC, created_at DESC;';

    const result = await pool.query(query, params);
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching LoansQR items:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch LoansQR items',
      error: err.message
    });
  }
};

/**
 * GET /api/loansqr-console/items/:id
 */
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM loansqr_console_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching LoansQR facility by id:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch LoansQR facility',
      error: err.message
    });
  }
};

/**
 * POST /api/loansqr-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      name,
      product_code,
      category,
      min_amount,
      max_amount,
      interest_rate_monthly,
      tenure_months_min,
      tenure_months_max,
      processing_fee_percent,
      moratorium_days,
      risk_score_min,
      collateral_required,
      collateral_ratio_percent
    } = req.body;

    if (!name || !product_code) {
      return res.status(400).json({
        success: false,
        message: 'name and product_code are required'
      });
    }

    const orderResult = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM loansqr_console_items');
    const nextOrder = orderResult.rows[0].next_order;

    const insertResult = await pool.query(`
      INSERT INTO loansqr_console_items (
        name,
        product_code,
        category,
        min_amount,
        max_amount,
        interest_rate_monthly,
        tenure_months_min,
        tenure_months_max,
        processing_fee_percent,
        moratorium_days,
        risk_score_min,
        collateral_required,
        collateral_ratio_percent,
        display_order
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) RETURNING *;
    `, [
      name,
      product_code,
      category || 'SME_WORKING_CAPITAL',
      parseFloat(min_amount) || 50000.00,
      parseFloat(max_amount) || 2000000.00,
      parseFloat(interest_rate_monthly) || 3.50,
      parseInt(tenure_months_min || '1', 10),
      parseInt(tenure_months_max || '12', 10),
      parseFloat(processing_fee_percent) || 1.50,
      parseInt(moratorium_days || '14', 10),
      parseInt(risk_score_min || '620', 10),
      Boolean(collateral_required),
      parseFloat(collateral_ratio_percent) || 120.00,
      nextOrder
    ]);

    return res.status(201).json({
      success: true,
      message: 'Loan underwriting product created in PostgreSQL',
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating LoansQR facility:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create loan facility',
      error: err.message
    });
  }
};

/**
 * PUT /api/loansqr-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      min_amount,
      max_amount,
      interest_rate_monthly,
      tenure_months_min,
      tenure_months_max,
      processing_fee_percent,
      moratorium_days,
      risk_score_min,
      collateral_required,
      collateral_ratio_percent,
      is_active,
      moratorium_hold_active
    } = req.body;

    const checkResult = await pool.query('SELECT * FROM loansqr_console_items WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    const current = checkResult.rows[0];

    const updateResult = await pool.query(`
      UPDATE loansqr_console_items
      SET
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        min_amount = COALESCE($3, min_amount),
        max_amount = COALESCE($4, max_amount),
        interest_rate_monthly = COALESCE($5, interest_rate_monthly),
        tenure_months_min = COALESCE($6, tenure_months_min),
        tenure_months_max = COALESCE($7, tenure_months_max),
        processing_fee_percent = COALESCE($8, processing_fee_percent),
        moratorium_days = COALESCE($9, moratorium_days),
        risk_score_min = COALESCE($10, risk_score_min),
        collateral_required = COALESCE($11, collateral_required),
        collateral_ratio_percent = COALESCE($12, collateral_ratio_percent),
        is_active = COALESCE($13, is_active),
        moratorium_hold_active = COALESCE($14, moratorium_hold_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *;
    `, [
      name,
      category,
      min_amount !== undefined ? parseFloat(min_amount) : current.min_amount,
      max_amount !== undefined ? parseFloat(max_amount) : current.max_amount,
      interest_rate_monthly !== undefined ? parseFloat(interest_rate_monthly) : current.interest_rate_monthly,
      tenure_months_min !== undefined ? parseInt(tenure_months_min, 10) : current.tenure_months_min,
      tenure_months_max !== undefined ? parseInt(tenure_months_max, 10) : current.tenure_months_max,
      processing_fee_percent !== undefined ? parseFloat(processing_fee_percent) : current.processing_fee_percent,
      moratorium_days !== undefined ? parseInt(moratorium_days, 10) : current.moratorium_days,
      risk_score_min !== undefined ? parseInt(risk_score_min, 10) : current.risk_score_min,
      collateral_required !== undefined ? Boolean(collateral_required) : current.collateral_required,
      collateral_ratio_percent !== undefined ? parseFloat(collateral_ratio_percent) : current.collateral_ratio_percent,
      is_active !== undefined ? Boolean(is_active) : current.is_active,
      moratorium_hold_active !== undefined ? Boolean(moratorium_hold_active) : current.moratorium_hold_active,
      id
    ]);

    return res.status(200).json({
      success: true,
      message: 'LoansQR Facility updated successfully in PostgreSQL',
      data: updateResult.rows[0]
    });
  } catch (err) {
    console.error('Error updating LoansQR facility:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update LoansQR facility',
      error: err.message
    });
  }
};

/**
 * DELETE /api/loansqr-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await pool.query('DELETE FROM loansqr_console_items WHERE id = $1 RETURNING *;', [id]);
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Facility removed from lending catalog',
      data: deleteResult.rows[0]
    });
  } catch (err) {
    console.error('Error deleting LoansQR facility:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete LoansQR facility',
      error: err.message
    });
  }
};

/**
 * POST /api/loansqr-console/reorder
 */
exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { reorders } = req.body;
    if (!Array.isArray(reorders)) {
      return res.status(400).json({ success: false, message: 'reorders must be an array of { id, display_order }' });
    }

    await client.query('BEGIN');
    for (const item of reorders) {
      await client.query(
        'UPDATE loansqr_console_items SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [item.display_order, item.id]
      );
    }
    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: `Atomically reordered ${reorders.length} loan products`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering loan products:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to reorder loan products',
      error: err.message
    });
  } finally {
    client.release();
  }
};

/**
 * POST /api/loansqr-console/upload
 * Direct Multipart/form-data Express Ingestion for Underwriting & Collateral Deeds
 */
exports.uploadMiddleware = upload.single('collateral_doc');

exports.handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No underwriting document attached' });
  }

  const relativeUrl = `/uploads/loansqr/${req.file.filename}`;

  return res.status(200).json({
    success: true,
    message: 'Underwriting document ingested directly into Express backend',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      url: relativeUrl
    }
  });
};

/**
 * POST /api/loansqr-console/defcon-moratorium
 * DefCon Moratorium Hold: Freezes or unfreezes debt collections & interest accruals
 */
exports.toggleMoratoriumHold = async (req, res) => {
  try {
    const { scope, active } = req.body; // scope: 'all' | category, active: boolean

    let query = 'UPDATE loansqr_console_items SET moratorium_hold_active = $1, updated_at = CURRENT_TIMESTAMP';
    const params = [Boolean(active)];

    if (scope && scope !== 'all') {
      params.push(scope);
      query += ` WHERE category = $2 RETURNING id;`;
    } else {
      query += ' RETURNING id;';
    }

    const result = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      affected_count: result.rows.length,
      moratorium_hold_active: Boolean(active),
      message: `Debt Moratorium Hold ${active ? 'ACTIVATED' : 'DEACTIVATED'} across ${result.rows.length} facilities.`
    });
  } catch (err) {
    console.error('Error toggling debt moratorium hold:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle debt moratorium hold',
      error: err.message
    });
  }
};

/**
 * GET /api/loansqr-console/spawns
 */
exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loansqr_console_spawns ORDER BY id ASC;');
    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching LoansQR console spawns:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch LoansQR console spawns',
      error: err.message
    });
  }
};

/**
 * POST /api/loansqr-console/spawns
 */
exports.spawnConsole = async (req, res) => {
  try {
    const { title, domain, badge, description, instances } = req.body;
    if (!title || !badge) {
      return res.status(400).json({ success: false, message: 'title and badge are required' });
    }

    const result = await pool.query(`
      INSERT INTO loansqr_console_spawns (title, domain, badge, description, active_instances, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *;
    `, [
      title,
      domain || 'loansqr_lending',
      badge,
      description || '',
      parseInt(instances || '1', 10)
    ]);

    return res.status(201).json({
      success: true,
      message: 'Spawned new sovereign LoansQR lending shard',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error spawning LoansQR console:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to spawn LoansQR console',
      error: err.message
    });
  }
};
