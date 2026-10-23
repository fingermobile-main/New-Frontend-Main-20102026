/**
 * Systems Infrastructure, AI Engine & Dev Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 3: STERCS Sentient Core, Guardian AI DefCon, NexusGNN, BullMQ Queues, Microservices Mesh & Cloud DB
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

// Multer storage for architecture manifests, K8s configs & vector topology files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/infra');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `infra_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for binary weights and topologies
});

const VALID_DOMAINS = [
  'stercs_control_core',
  'guardian_ai_defcon',
  'nexus_gnn_engine',
  'worker_queues_redis',
  'microservices_mesh',
  'cloud_infra_database'
];

/**
 * GET /api/system-infra-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(throughput_tps), 0) as total_throughput_tps,
        COALESCE(AVG(latency_ms), 0) as average_latency_ms,
        COALESCE(AVG(health_score), 100) as average_health_score,
        COUNT(CASE WHEN domain = 'stercs_control_core' THEN 1 END) as total_core_nodes,
        COUNT(CASE WHEN domain = 'guardian_ai_defcon' THEN 1 END) as total_defcon_modules,
        COUNT(CASE WHEN domain = 'nexus_gnn_engine' THEN 1 END) as total_gnn_pipelines,
        COUNT(CASE WHEN domain = 'worker_queues_redis' THEN 1 END) as total_queues,
        COUNT(CASE WHEN domain = 'microservices_mesh' THEN 1 END) as total_mesh_services,
        COUNT(CASE WHEN domain = 'cloud_infra_database' THEN 1 END) as total_database_clusters
      FROM system_infra_console_items
    `);

    const domainBreakdown = await pool.query(`
      SELECT
        domain,
        COUNT(*) as count,
        COALESCE(SUM(throughput_tps), 0) as domain_tps,
        COALESCE(AVG(latency_ms), 0) as avg_latency,
        COALESCE(AVG(health_score), 100) as avg_health
      FROM system_infra_console_items
      GROUP BY domain
      ORDER BY count DESC
    `);

    const spawnsCount = await pool.query(`SELECT COUNT(*) as total FROM system_infra_console_spawns`);

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
    console.error('Error fetching system infra overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/system-infra-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { domain } = req.query;
    let query = 'SELECT * FROM system_infra_console_items';
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
    console.error('Error fetching system infra items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/system-infra-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      domain,
      name,
      code,
      category,
      cluster_node,
      defcon_level,
      throughput_tps,
      latency_ms,
      health_score,
      config_manifest_url,
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
      'SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM system_infra_console_items WHERE domain = $1',
      [domain]
    );
    const nextOrder = orderRes.rows[0].next_order;

    const id = `sys_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const insertResult = await pool.query(`
      INSERT INTO system_infra_console_items (
        id, domain, name, code, category, status, display_order,
        cluster_node, defcon_level, throughput_tps, latency_ms,
        health_score, config_manifest_url, voice_tag, notes, metadata,
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
      cluster_node || 'default-cluster-pod',
      defcon_level ? parseInt(defcon_level, 10) : 5,
      throughput_tps ? parseFloat(throughput_tps) : 0.0,
      latency_ms ? parseFloat(latency_ms) : 1.0,
      health_score ? parseFloat(health_score) : 100.0,
      config_manifest_url || null,
      voice_tag || 'gbaski',
      notes || null,
      metadata ? JSON.stringify(metadata) : '{}'
    ]);

    return res.status(201).json({
      success: true,
      message: `System node "${name}" provisioned and registered into PostgreSQL`,
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating system infra item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/system-infra-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      category,
      cluster_node,
      defcon_level,
      throughput_tps,
      latency_ms,
      health_score,
      config_manifest_url,
      voice_tag,
      notes,
      metadata
    } = req.body;

    const existingRes = await pool.query('SELECT * FROM system_infra_console_items WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: `System item "${id}" not found` });
    }

    const current = existingRes.rows[0];

    const updatedResult = await pool.query(`
      UPDATE system_infra_console_items SET
        name = COALESCE($1, name),
        code = COALESCE($2, code),
        category = COALESCE($3, category),
        cluster_node = COALESCE($4, cluster_node),
        defcon_level = COALESCE($5, defcon_level),
        throughput_tps = COALESCE($6, throughput_tps),
        latency_ms = COALESCE($7, latency_ms),
        health_score = COALESCE($8, health_score),
        config_manifest_url = COALESCE($9, config_manifest_url),
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
      cluster_node !== undefined ? cluster_node : current.cluster_node,
      defcon_level !== undefined ? parseInt(defcon_level, 10) : current.defcon_level,
      throughput_tps !== undefined ? parseFloat(throughput_tps) : current.throughput_tps,
      latency_ms !== undefined ? parseFloat(latency_ms) : current.latency_ms,
      health_score !== undefined ? parseFloat(health_score) : current.health_score,
      config_manifest_url !== undefined ? config_manifest_url : current.config_manifest_url,
      voice_tag !== undefined ? voice_tag : current.voice_tag,
      notes !== undefined ? notes : current.notes,
      metadata !== undefined ? JSON.stringify(metadata) : current.metadata,
      id
    ]);

    return res.json({
      success: true,
      message: `System node "${updatedResult.rows[0].name}" updated in PostgreSQL`,
      data: updatedResult.rows[0]
    });
  } catch (err) {
    console.error('Error updating system infra item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PATCH /api/system-infra-console/items/:id/freeze
 */
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT status, name FROM system_infra_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `System node "${id}" not found` });
    }

    const currentStatus = existing.rows[0].status;
    const newStatus = currentStatus === 'active' ? 'frozen' : 'active';

    const result = await pool.query(
      'UPDATE system_infra_console_items SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    return res.json({
      success: true,
      message: `System node "${existing.rows[0].name}" status toggled to "${newStatus}"`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error toggling freeze on system infra item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/system-infra-console/reorder
 */
exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { orders } = req.body; // Array of { id, display_order }
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty orders array' });
    }

    await client.query('BEGIN');
    for (const item of orders) {
      await client.query(
        'UPDATE system_infra_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [item.display_order, item.id]
      );
    }
    await client.query('COMMIT');

    return res.json({
      success: true,
      message: `Successfully re-sequenced ${orders.length} infrastructure nodes transactionally`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering system infra items:', err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

/**
 * DELETE /api/system-infra-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT name FROM system_infra_console_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: `System item "${id}" not found` });
    }

    await pool.query('DELETE FROM system_infra_console_items WHERE id = $1', [id]);
    return res.json({
      success: true,
      message: `Decommissioned and deleted system node "${existing.rows[0].name}"`
    });
  } catch (err) {
    console.error('Error deleting system infra item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/system-infra-console/upload
 */
exports.uploadMiddleware = upload.single('media');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/infra/${req.file.filename}`;
    const { itemId, field } = req.body;

    if (itemId) {
      const targetField = field || 'config_manifest_url';
      await pool.query(
        `UPDATE system_infra_console_items SET ${targetField} = $1, updated_at = NOW() WHERE id = $2`,
        [fileUrl, itemId]
      );
    }

    return res.json({
      success: true,
      message: 'Infrastructure configuration uploaded successfully directly to Express backend',
      data: {
        fileUrl,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (err) {
    console.error('Error uploading infra configuration:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/system-infra-console/spawns
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

    const id = `sys_spw_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const routeSlug = console_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const route = `/admin/infra-console/${routeSlug}`;

    const insertResult = await pool.query(`
      INSERT INTO system_infra_console_spawns (
        id, console_title, target_domain, route, icon_name, badge_text, status, config, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 'active', $7, NOW()
      ) RETURNING *
    `, [
      id,
      console_title,
      target_domain,
      route,
      icon_name || 'Cpu',
      badge_text || 'SOVEREIGN',
      config ? JSON.stringify(config) : '{}'
    ]);

    return res.status(201).json({
      success: true,
      message: `Infrastructure console "${console_title}" dynamically spawned at ${route}`,
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error creating infra console spawn:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/system-infra-console/spawns
 */
exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM system_infra_console_spawns ORDER BY created_at DESC'
    );
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching infra console spawns:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
