/**
 * E-Learning, NYSC SAED & EduTech Console Controller
 * FingerMobile Protocol™ Production Control Plane
 * Phase 9: Course Syllabi, Accreditation Proofs, Student Enrolment, Certification Tiers & DefCon Holds
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

// Multer storage for course syllabi, accreditation certificates, instructor credentials
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/edutech');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `edutech_${Date.now()}_${basename}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 } // 40MB limit for rich media, PDFs and syllabi
});

const VALID_DOMAINS = [
  'nysc_saed_skills',
  'coding_web3_bootcamp',
  'vocational_fashion',
  'financial_literacy_crypto',
  'stem_robotics_iot',
  'agribusiness_hydroponics'
];

/**
 * GET /api/elearning-nysc-console/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'frozen' THEN 1 END) as frozen_count,
        COALESCE(SUM(enrolled_students), 0) as total_students,
        COALESCE(AVG(completion_rate), 95.0) as average_completion_rate,
        COALESCE(SUM(curriculum_modules), 0) as total_curriculum_modules,
        COALESCE(SUM(price_fiat * enrolled_students), 0) as estimated_gross_fiat,
        COALESCE(SUM(price_fic * enrolled_students), 0) as estimated_gross_fic,
        COUNT(CASE WHEN domain = 'nysc_saed_skills' THEN 1 END) as total_nysc_courses,
        COUNT(CASE WHEN domain = 'coding_web3_bootcamp' THEN 1 END) as total_web3_courses
      FROM elearning_nysc_console_items
    `);

    const domainBreakdown = await pool.query(`
      SELECT
        domain,
        COUNT(*) as count,
        COALESCE(SUM(enrolled_students), 0) as domain_students,
        COALESCE(AVG(completion_rate), 95.0) as avg_completion
      FROM elearning_nysc_console_items
      GROUP BY domain
      ORDER BY count DESC
    `);

    const spawnsCount = await pool.query('SELECT COUNT(*) as total FROM elearning_nysc_console_spawns');

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
    console.error('Error fetching elearning overview:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/elearning-nysc-console/items
 */
exports.getItems = async (req, res) => {
  try {
    const { domain, status, search, category } = req.query;
    let query = 'SELECT * FROM elearning_nysc_console_items WHERE 1=1';
    const params = [];
    let paramIdx = 1;

    if (domain && domain !== 'all' && domain !== 'ALL') {
      query += ` AND domain = $${paramIdx++}`;
      params.push(domain);
    }

    if (status && status !== 'all' && status !== 'ALL') {
      query += ` AND status = $${paramIdx++}`;
      params.push(status);
    }

    if (category && category !== 'all' && category !== 'ALL') {
      query += ` AND category = $${paramIdx++}`;
      params.push(category);
    }

    if (search && search.trim() !== '') {
      query += ` AND (name ILIKE $${paramIdx} OR code ILIKE $${paramIdx} OR instructor_name ILIKE $${paramIdx} OR category ILIKE $${paramIdx})`;
      params.push(`%${search.trim()}%`);
      paramIdx++;
    }

    query += ' ORDER BY display_order ASC, id ASC';

    const result = await pool.query(query, params);
    return res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching elearning items:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/elearning-nysc-console/items/:id
 */
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM elearning_nysc_console_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching elearning item by ID:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/elearning-nysc-console/items
 */
exports.createItem = async (req, res) => {
  try {
    const {
      domain,
      name,
      code,
      category,
      instructor_name = 'Accredited Faculty',
      accreditation_body = 'NYSC EduTech Directorate',
      price_fiat = 0.00,
      price_fic = 0.00,
      enrolled_students = 0,
      completion_rate = 95.0,
      curriculum_modules = 8,
      status = 'active',
      certification_level = 'National Certification',
      tags = ['NYSC', 'Skill Acquisition', 'EduTech'],
      voice_tag = 'blessings',
      document_url = '',
      metadata = {}
    } = req.body;

    if (!domain || !name || !code || !category) {
      return res.status(400).json({
        success: false,
        message: 'domain, name, code, and category are required fields'
      });
    }

    const orderRes = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM elearning_nysc_console_items');
    const nextOrder = orderRes.rows[0].next_order;

    const result = await pool.query(`
      INSERT INTO elearning_nysc_console_items (
        domain, name, code, category, instructor_name, accreditation_body,
        price_fiat, price_fic, enrolled_students, completion_rate,
        curriculum_modules, status, display_order, certification_level,
        tags, voice_tag, document_url, metadata
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *
    `, [
      domain,
      name,
      code.toUpperCase(),
      category,
      instructor_name,
      accreditation_body,
      parseFloat(price_fiat) || 0,
      parseFloat(price_fic) || 0,
      parseInt(enrolled_students, 10) || 0,
      parseFloat(completion_rate) || 95.0,
      parseInt(curriculum_modules, 10) || 8,
      status,
      nextOrder,
      certification_level,
      Array.isArray(tags) ? tags : [tags],
      voice_tag,
      document_url,
      JSON.stringify(metadata)
    ]);

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error creating elearning item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/elearning-nysc-console/items/:id
 */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      domain,
      name,
      code,
      category,
      instructor_name,
      accreditation_body,
      price_fiat,
      price_fic,
      enrolled_students,
      completion_rate,
      curriculum_modules,
      status,
      certification_level,
      tags,
      voice_tag,
      document_url,
      metadata
    } = req.body;

    const check = await pool.query('SELECT * FROM elearning_nysc_console_items WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const result = await pool.query(`
      UPDATE elearning_nysc_console_items SET
        domain = COALESCE($1, domain),
        name = COALESCE($2, name),
        code = COALESCE($3, code),
        category = COALESCE($4, category),
        instructor_name = COALESCE($5, instructor_name),
        accreditation_body = COALESCE($6, accreditation_body),
        price_fiat = COALESCE($7, price_fiat),
        price_fic = COALESCE($8, price_fic),
        enrolled_students = COALESCE($9, enrolled_students),
        completion_rate = COALESCE($10, completion_rate),
        curriculum_modules = COALESCE($11, curriculum_modules),
        status = COALESCE($12, status),
        certification_level = COALESCE($13, certification_level),
        tags = COALESCE($14, tags),
        voice_tag = COALESCE($15, voice_tag),
        document_url = COALESCE($16, document_url),
        metadata = COALESCE($17, metadata),
        updated_at = NOW()
      WHERE id = $18
      RETURNING *
    `, [
      domain,
      name,
      code ? code.toUpperCase() : undefined,
      category,
      instructor_name,
      accreditation_body,
      price_fiat !== undefined ? parseFloat(price_fiat) : undefined,
      price_fic !== undefined ? parseFloat(price_fic) : undefined,
      enrolled_students !== undefined ? parseInt(enrolled_students, 10) : undefined,
      completion_rate !== undefined ? parseFloat(completion_rate) : undefined,
      curriculum_modules !== undefined ? parseInt(curriculum_modules, 10) : undefined,
      status,
      certification_level,
      tags ? (Array.isArray(tags) ? tags : [tags]) : undefined,
      voice_tag,
      document_url,
      metadata ? JSON.stringify(metadata) : undefined,
      id
    ]);

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error updating elearning item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/elearning-nysc-console/items/:id
 */
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM elearning_nysc_console_items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    return res.json({ success: true, message: 'Item deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error deleting elearning item:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PATCH /api/elearning-nysc-console/items/:id/freeze
 */
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query('SELECT status FROM elearning_nysc_console_items WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const currentStatus = check.rows[0].status;
    const newStatus = currentStatus === 'frozen' ? 'active' : 'frozen';

    const result = await pool.query(`
      UPDATE elearning_nysc_console_items
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [newStatus, id]);

    return res.json({
      success: true,
      message: `Course status changed from ${currentStatus} to ${newStatus}`,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error toggling freeze state:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/elearning-nysc-console/reorder
 */
exports.reorderItems = async (req, res) => {
  const client = await pool.connect();
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'orders must be an array of { id, display_order }' });
    }

    await client.query('BEGIN');
    for (const item of orders) {
      await client.query(
        'UPDATE elearning_nysc_console_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [item.display_order, item.id]
      );
    }
    await client.query('COMMIT');

    return res.json({ success: true, message: 'Items reordered successfully live in PostgreSQL' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error reordering elearning items:', err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};

/**
 * POST /api/elearning-nysc-console/upload
 */
exports.uploadMiddleware = upload.single('asset');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const relativeUrl = `/uploads/edutech/${req.file.filename}`;
    return res.json({
      success: true,
      message: 'Syllabus/Certificate uploaded successfully',
      data: {
        url: relativeUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      }
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/elearning-nysc-console/spawns
 */
exports.getSpawns = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM elearning_nysc_console_spawns ORDER BY created_at DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching elearning spawns:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/elearning-nysc-console/spawns
 */
exports.createSpawn = async (req, res) => {
  try {
    const { title, domain, badge, description } = req.body;
    if (!title || !domain) {
      return res.status(400).json({ success: false, message: 'title and domain are required' });
    }

    const result = await pool.query(`
      INSERT INTO elearning_nysc_console_spawns (title, domain, badge, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [title, domain, badge || 'EDU-SPAWN', description || '']);

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error creating elearning spawn:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
