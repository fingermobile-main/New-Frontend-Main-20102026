/**
 * Creator Studio, Monetization & Payouts Engine Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 6: Creator Tiers, Ad Revenue Splits, Live Gifting Tips, FIC Staking Yield, PPV Events & Micro-Royalties
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

// Multer storage for creator contracts, revenue agreements, tax manifests, proof of payouts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/monetization');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `creator_pay_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB limit for payout manifests and agreements
});

const VALID_DOMAINS = [
  'creator_tiers_matrix',
  'ad_revenue_splits',
  'live_gifting_tips',
  'fic_staking_yields',
  'ppv_exclusive_events',
  'music_video_royalties'
];

/**
 * GET /api/creator-monetization-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(total_volume_fic), 0) as total_volume_fic,
        COALESCE(SUM(active_creators_count), 0) as total_creators_count,
        COALESCE(AVG(rev_share_percent), 70.0) as average_rev_share,
        COUNT(CASE WHEN domain = 'creator_tiers_matrix' THEN 1 END) as total_tiers,
        COUNT(CASE WHEN domain = 'fic_staking_yields' THEN 1 END) as total_staking_pools,
        COUNT(CASE WHEN domain = 'live_gifting_tips' THEN 1 END) as total_gifting_vaults,
        COUNT(CASE WHEN domain = 'ppv_exclusive_events' THEN 1 END) as total_ppv_gates,
        COALESCE(SUM(CASE WHEN domain = 'fic_staking_yields' THEN total_volume_fic ELSE 0 END), 0) as staking_locked_volume_fic
      FROM creator_monetization_console_items
    `);

    const domainBreakdown = await pool.query(`
      SELECT
        domain,
        COUNT(*) as count,
        COALESCE(SUM(total_volume_fic), 0) as domain_volume_fic,
        COALESCE(SUM(active_creators_count), 0) as domain_creators,
        COALESCE(AVG(rev_share_percent), 70.0) as avg_rev_share
      FROM creator_monetization_console_items
      GROUP BY domain
      ORDER BY domain_volume_fic DESC
    `);

    const spawnsCount = await pool.query(`SELECT COUNT(*) as total FROM creator_monetization_console_spawns`);

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
    console.error('Error fetching creator monetization overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/creator-monetization-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { domain } = req.query;
    let query = 'SELECT * FROM creator_monetization_console_items';
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
    console.error('Error listing creator monetization items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/creator-monetization-console/items/:id
 */
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM creator_monetization_console_items WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Creator monetization item not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error getting creator monetization item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/creator-monetization-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      domain,
      name,
      code,
      category,
      tier_level,
      rev_share_percent,
      payout_currency,
      total_volume_fic,
      active_creators_count,
      contract_manifest_url,
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
      'SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM creator_monetization_console_items WHERE domain = $1',
      [domain]
    );
    const nextOrder = orderRes.rows[0].next_order;

    const insertQuery = `
      INSERT INTO creator_monetization_console_items (
        domain, name, code, category, status, display_order, tier_level,
        rev_share_percent, payout_currency, total_volume_fic, active_creators_count,
        contract_manifest_url, voice_tag, notes, metadata
      ) VALUES ($1, $2, $3, $4, 'active', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      domain,
      name,
      code.toUpperCase().replace(/\s+/g, '-'),
      category,
      nextOrder,
      tier_level || 'Standard Creator',
      rev_share_percent !== undefined ? parseFloat(rev_share_percent) : 70.00,
      payout_currency || 'FIC / NGN',
      total_volume_fic !== undefined ? parseFloat(total_volume_fic) : 0.00,
      active_creators_count !== undefined ? parseInt(active_creators_count, 10) : 0,
      contract_manifest_url || null,
      voice_tag || 'owo_ni_koko',
      notes || null,
      metadata || {}
    ];

    const result = await pool.query(insertQuery, values);
    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Creator monetization item registered successfully'
    });
  } catch (err) {
    console.error('Error creating creator monetization item:', err);
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'An item with this system code already exists' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/creator-monetization-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      status,
      tier_level,
      rev_share_percent,
      payout_currency,
      total_volume_fic,
      active_creators_count,
      contract_manifest_url,
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
    if (tier_level !== undefined) { fields.push(`tier_level = $${idx++}`); values.push(tier_level); }
    if (rev_share_percent !== undefined) { fields.push(`rev_share_percent = $${idx++}`); values.push(parseFloat(rev_share_percent)); }
    if (payout_currency !== undefined) { fields.push(`payout_currency = $${idx++}`); values.push(payout_currency); }
    if (total_volume_fic !== undefined) { fields.push(`total_volume_fic = $${idx++}`); values.push(parseFloat(total_volume_fic)); }
    if (active_creators_count !== undefined) { fields.push(`active_creators_count = $${idx++}`); values.push(parseInt(active_creators_count, 10)); }
    if (contract_manifest_url !== undefined) { fields.push(`contract_manifest_url = $${idx++}`); values.push(contract_manifest_url); }
    if (voice_tag !== undefined) { fields.push(`voice_tag = $${idx++}`); values.push(voice_tag); }
    if (notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(notes); }
    if (metadata !== undefined) { fields.push(`metadata = $${idx++}`); values.push(metadata); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update' });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const updateQuery = `
      UPDATE creator_monetization_console_items
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Creator monetization item not found' });
    }

    return res.json({
      success: true,
      data: result.rows[0],
      message: 'Creator monetization item updated successfully'
    });
  } catch (err) {
    console.error('Error updating creator monetization item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PATCH /api/creator-monetization-console/items/:id/freeze
 */
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await pool.query('SELECT status FROM creator_monetization_console_items WHERE id = $1', [id]);
    if (current.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const nextStatus = current.rows[0].status === 'active' ? 'frozen' : 'active';
    const result = await pool.query(
      'UPDATE creator_monetization_console_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [nextStatus, id]
    );

    return res.json({
      success: true,
      data: result.rows[0],
      message: `Creator item is now ${nextStatus}`
    });
  } catch (err) {
    console.error('Error toggling creator item freeze:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/creator-monetization-console/reorder
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
        'UPDATE creator_monetization_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [item.display_order, item.id]
      );
    }
    await client.query('COMMIT');

    return res.json({ success: true, message: 'Reordered items successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering creator items:', err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

/**
 * DELETE /api/creator-monetization-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM creator_monetization_console_items WHERE id = $1 RETURNING id, name', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    return res.json({
      success: true,
      message: `Decommissioned creator item "${result.rows[0].name}"`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting creator item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/creator-monetization-console/upload
 */
exports.uploadMedia = [
  upload.single('media'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const fileUrl = `/uploads/monetization/${req.file.filename}`;
      const { itemId, field = 'contract_manifest_url' } = req.body;

      if (itemId) {
        await pool.query(
          `UPDATE creator_monetization_console_items SET ${field} = $1, updated_at = NOW() WHERE id = $2`,
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
        message: 'Contract / payout document uploaded successfully'
      });
    } catch (err) {
      console.error('Error uploading creator document:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
];

/**
 * POST /api/creator-monetization-console/spawns
 */
exports.spawnConsole = async (req, res) => {
  try {
    const { console_title, target_domain, icon_name = 'DollarSign', badge_text = 'CREATOR-PAY', config = {} } = req.body;
    if (!console_title || !target_domain) {
      return res.status(400).json({ success: false, message: 'console_title and target_domain are required' });
    }

    const route = `/admin/creator-${target_domain.replace(/_/g, '-')}`;

    const insertQuery = `
      INSERT INTO creator_monetization_console_spawns (
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
    console.error('Error spawning creator console:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/creator-monetization-console/spawns
 */
exports.getSpawnedConsoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM creator_monetization_console_spawns ORDER BY created_at DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error listing spawned creator consoles:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
