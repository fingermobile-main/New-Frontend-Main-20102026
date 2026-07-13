/**
 * FingerMobile Protocol Platform - Backend API Routes (Node.js/Express)
 * Server-side API route definitions
 * Version: 1.0
 * 
 * This file defines all API endpoints for the FingerMobile platform.
 * To be used with Express.js backend server.
 */

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads', 'videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `video-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5434,
  database: process.env.DB_NAME || 'fingermobile_platform_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// ===== Middleware =====

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await pool.query(
      'SELECT * FROM validate_session($1)',
      [token]
    );

    if (result.rows.length === 0 || !result.rows[0].is_valid) {
      return res.status(403).json({ error: 'Invalid or expired session' });
    }

    req.memberId = result.rows[0].member_id;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Validation middleware
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// ===== Authentication Routes =====

// POST /api/auth/register
router.post('/auth/register', async (req, res) => {
  try {
    const { membername, email, password, first_name, last_name } = req.body;

    // Check if member exists
    const existing = await pool.query(
      'SELECT id FROM members WHERE email = $1 OR membername = $2',
      [email, membername]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Member already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create member
    const result = await pool.query(
      `INSERT INTO members (membername, email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, membername, email, first_name, last_name, created_at`,
      [membername, email, passwordHash, first_name, last_name]
    );

    // Create wallet
    await pool.query(
      'INSERT INTO fics_wallets (member_id) VALUES ($1)',
      [result.rows[0].id]
    );

    res.status(201).json({
      success: true,
      member: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find member
    const result = await pool.query(
      'SELECT * FROM members WHERE email = $1 AND is_active = TRUE',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const member = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, member.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const sessionToken = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      'SELECT * FROM create_session($1, $2, $3)',
      [member.id, sessionToken, expiresAt]
    );

    res.json({
      success: true,
      session_token: sessionToken,
      member_id: member.id,
      member: {
        id: member.id,
        membername: member.membername,
        email: member.email,
        first_name: member.first_name,
        last_name: member.last_name,
        profile_picture_url: member.profile_picture_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout
router.post('/auth/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    await pool.query('SELECT * FROM delete_session($1)', [token]);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// GET /api/auth/validate
router.get('/auth/validate', authenticateToken, async (req, res) => {
  try {
    const member = await pool.query(
      'SELECT id, membername, email, first_name, last_name, profile_picture_url, is_verified FROM members WHERE id = $1',
      [req.memberId]
    );

    res.json({
      success: true,
      valid: true,
      member: member.rows[0]
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
});

// ===== Members Routes =====

// GET /api/members/:id/profile
router.get('/members/:id/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM get_member_profile($1)',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// PUT /api/members/:id/profile
router.put('/members/:id/profile', authenticateToken, async (req, res) => {
  try {
    if (req.params.id !== req.memberId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { first_name, last_name, bio, country, city } = req.body;

    await pool.query(
      'SELECT * FROM update_member_profile($1, $2, $3, $4, $5, $6)',
      [req.memberId, first_name, last_name, bio, country, city]
    );

    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/members/search
router.get('/members/search', authenticateToken, async (req, res) => {
  try {
    const { q, limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT id, membername, first_name, last_name, profile_picture_url, bio, is_verified
       FROM members
       WHERE membername ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1
       AND is_active = TRUE
       LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit, offset, total: result.rows.length }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ===== Wallet Routes =====

// GET /api/wallet/balance
router.get('/wallet/balance', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM get_wallet_balance($1)',
      [req.memberId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

// POST /api/wallet/transfer
router.post('/wallet/transfer', authenticateToken, async (req, res) => {
  try {
    const { to_member_id, amount, description } = req.body;

    if (!to_member_id || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid transfer parameters' });
    }

    const result = await pool.query(
      'SELECT * FROM transfer_fic($1, $2, $3, $4)',
      [req.memberId, to_member_id, amount, description]
    );

    const transferResult = result.rows[0];

    if (!transferResult.success) {
      return res.status(400).json({ error: transferResult.error_message });
    }

    res.json({
      success: true,
      message: 'Transfer completed',
      transaction_id: transferResult.transaction_id
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Transfer failed' });
  }
});

// GET /api/wallet/history
router.get('/wallet/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT * FROM transactions
       WHERE from_member_id = $1 OR to_member_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.memberId, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit, offset, total: result.rows.length }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// ===== Messages Routes =====

// GET /api/messages/conversations
router.get('/messages/conversations', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM get_conversations($1)',
      [req.memberId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// GET /api/messages/conversations/:partnerId
router.get('/messages/conversations/:partnerId', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      'SELECT * FROM get_conversation_messages($1, $2, $3, $4)',
      [req.memberId, req.params.partnerId, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit, offset, total: result.rows.length }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// POST /api/messages/send
router.post('/messages/send', authenticateToken, async (req, res) => {
  try {
    const { to_member_id, content, message_type = 'text' } = req.body;

    if (!to_member_id || !content) {
      return res.status(400).json({ error: 'Recipient and content required' });
    }

    const messageId = await pool.query(
      'SELECT * FROM send_message($1, $2, $3, $4)',
      [req.memberId, to_member_id, content, message_type]
    );

    res.status(201).json({
      success: true,
      message_id: messageId.rows[0]
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// POST /api/messages/:fromId/read
router.post('/messages/:fromId/read', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'SELECT * FROM mark_messages_read($1, $2)',
      [req.memberId, req.params.fromId]
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// GET /api/messages/unread-count
router.get('/messages/unread-count', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM messages WHERE recipient_id = $1 AND status = \'sent\'',
      [req.memberId]
    );

    res.json({ success: true, count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// ===== Platform Stats Routes =====

// GET /api/platform/stats
router.get('/platform/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_platform_stats()');

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// ===== Pages Routes (B2B Landing Pages) =====

// POST /api/pages - Create a new page
router.post('/pages', authenticateToken, async (req, res) => {
  try {
    const { page_name, slug, category, description, cover_image_url, is_published } = req.body;

    if (!page_name || !slug) {
      return res.status(400).json({ error: 'Page name and slug are required' });
    }

    const result = await pool.query(
      `INSERT INTO pages (owner_id, page_name, slug, category, description, cover_image_url, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.memberId, page_name, slug, category, description, cover_image_url, is_published || false]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create page error:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Page with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// GET /api/pages/:id - Get page by ID
router.get('/pages/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pages WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ error: 'Failed to get page' });
  }
});

// GET /api/pages/slug/:slug - Get page by slug
router.get('/pages/slug/:slug', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pages WHERE slug = $1 AND is_published = TRUE',
      [req.params.slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get page by slug error:', error);
    res.status(500).json({ error: 'Failed to get page' });
  }
});

// PUT /api/pages/:id - Update page
router.put('/pages/:id', authenticateToken, async (req, res) => {
  try {
    const { page_name, category, description, cover_image_url, is_published } = req.body;

    // Check ownership
    const checkResult = await pool.query(
      'SELECT owner_id FROM pages WHERE id = $1',
      [req.params.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (checkResult.rows[0].owner_id !== req.memberId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `UPDATE pages 
       SET page_name = COALESCE($1, page_name),
           category = COALESCE($2, category),
           description = COALESCE($3, description),
           cover_image_url = COALESCE($4, cover_image_url),
           is_published = COALESCE($5, is_published),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [page_name, category, description, cover_image_url, is_published, req.params.id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// DELETE /api/pages/:id - Delete page
router.delete('/pages/:id', authenticateToken, async (req, res) => {
  try {
    // Check ownership
    const checkResult = await pool.query(
      'SELECT owner_id FROM pages WHERE id = $1',
      [req.params.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (checkResult.rows[0].owner_id !== req.memberId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM pages WHERE id = $1', [req.params.id]);

    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// GET /api/pages/owner/:ownerId - Get all pages by owner
router.get('/pages/owner/:ownerId', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT * FROM pages 
       WHERE owner_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [req.params.ownerId, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit: parseInt(limit), offset: parseInt(offset), total: result.rows.length }
    });
  } catch (error) {
    console.error('Get owner pages error:', error);
    res.status(500).json({ error: 'Failed to get pages' });
  }
});

// POST /api/pages/:id/track-visitor - Track page visitor
router.post('/pages/:id/track-visitor', authenticateToken, async (req, res) => {
  try {
    const { ip_address, user_agent, referrer, dwell_time_seconds, action_taken } = req.body;

    // Verify page exists
    const pageCheck = await pool.query(
      'SELECT id FROM pages WHERE id = $1',
      [req.params.id]
    );

    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    await pool.query(
      `INSERT INTO page_visitors (page_id, visitor_id, ip_address, user_agent, referrer, dwell_time_seconds, action_taken)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [req.params.id, req.memberId, ip_address, user_agent, referrer, dwell_time_seconds || 0, action_taken || 'none']
    );

    // Update view count
    await pool.query(
      'UPDATE pages SET view_count = view_count + 1 WHERE id = $1',
      [req.params.id]
    );

    // Update lead count if action was taken
    if (action_taken && action_taken !== 'none') {
      await pool.query(
        'UPDATE pages SET lead_count = lead_count + 1 WHERE id = $1',
        [req.params.id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Visitor tracked',
      action_taken: action_taken || 'none'
    });
  } catch (error) {
    console.error('Track visitor error:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
});

// POST /api/pages/:id/track-conversion - Track conversion event
router.post('/pages/:id/track-conversion', authenticateToken, async (req, res) => {
  try {
    const { conversion_type, conversion_value, scroll_depth, dwell_time_seconds } = req.body;

    // Get the most recent visitor record ID
    const visitorResult = await pool.query(
      `SELECT id FROM page_visitors 
       WHERE page_id = $1 AND visitor_id = $2
       ORDER BY visited_at DESC LIMIT 1`,
      [req.params.id, req.memberId]
    );

    if (visitorResult.rows.length > 0) {
      const visitorId = visitorResult.rows[0].id;
      
      // Update visitor record with conversion
      await pool.query(
        `UPDATE page_visitors 
         SET converted = TRUE, 
             conversion_value = COALESCE($1, 0),
             scroll_depth = GREATEST(COALESCE(scroll_depth, 0), scroll_depth),
             time_on_page_seconds = GREATEST(COALESCE(time_on_page_seconds, 0), $2)
         WHERE id = $3`,
        [conversion_value || 0, dwell_time_seconds || 0, visitorId]
      );
    }

    // Increment page lead count
    await pool.query(
      'UPDATE pages SET lead_count = lead_count + 1 WHERE id = $1',
      [req.params.id]
    );

    // Create or update conversation for lead
    const convResult = await pool.query(
      `INSERT INTO conversations (page_id, member_id, partner_id, lead_score, lead_status)
       VALUES ($1, $2, $3, $4, 'new')
       ON CONFLICT (member_id, partner_id) 
       DO UPDATE SET 
         lead_score = conversations.lead_score + $4,
         updated_at = CURRENT_TIMESTAMP
       RETURNING id`,
      [req.params.id, req.memberId, req.memberId, Math.min(scroll_depth || 0, 100)]
    );

    res.json({
      success: true,
      message: 'Conversion tracked',
      conversation_id: convResult.rows[0]?.id
    });
  } catch (error) {
    console.error('Track conversion error:', error);
    res.status(500).json({ error: 'Failed to track conversion' });
  }
});

// GET /api/pages/:id/stats - Get page statistics
router.get('/pages/:id/stats', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT view_count, lead_count FROM pages WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get page stats error:', error);
    res.status(500).json({ error: 'Failed to get page stats' });
  }
});

// GET /api/pages/:id/analytics/overview - Get comprehensive page analytics
router.get('/pages/:id/analytics/overview', authenticateToken, async (req, res) => {
  try {
    // Verify page ownership
    const pageCheck = await pool.query(
      'SELECT id FROM pages WHERE id = $1 AND owner_id = $2',
      [req.params.id, req.memberId]
    );

    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found or access denied' });
    }

    // Get overall stats
    const statsResult = await pool.query(
      `SELECT 
        view_count,
        lead_count,
        (SELECT COUNT(*) FROM page_visitors WHERE page_id = $1) as total_visits,
        (SELECT COUNT(DISTINCT visitor_id) FROM page_visitors WHERE page_id = $1) as unique_visitors,
        (SELECT COUNT(*) FROM page_visitors WHERE page_id = $1 AND cta_clicked = TRUE) as total_cta_clicks,
        (SELECT COUNT(*) FROM page_visitors WHERE page_id = $1 AND converted = TRUE) as conversions,
        (SELECT AVG(time_on_page_seconds) FROM page_visitors WHERE page_id = $1) as avg_dwell_time
       FROM pages WHERE id = $1`,
      [req.params.id]
    );

    // Get CTA performance
    const ctaResult = await pool.query(
      'SELECT button_text, action_type, click_count FROM page_ctas WHERE page_id = $1 ORDER BY click_count DESC',
      [req.params.id]
    );

    // Get recent daily snapshots (last 7 days)
    const snapshotsResult = await pool.query(
      `SELECT snapshot_date, total_views, unique_visitors, total_cta_clicks, conversions, bounce_rate
       FROM page_analytics_snapshots
       WHERE page_id = $1
       ORDER BY snapshot_date DESC
       LIMIT 7`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        overview: statsResult.rows[0],
        cta_performance: ctaResult.rows,
        daily_trends: snapshotsResult.rows.reverse() // Oldest first for charts
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get page analytics' });
  }
});

// GET /api/pages/:id/analytics/visitors/timeline - Get visitor timeline data
router.get('/pages/:id/analytics/visitors/timeline', authenticateToken, async (req, res) => {
  try {
    const { days = 7 } = req.query;

    // Verify page ownership
    const pageCheck = await pool.query(
      'SELECT id FROM pages WHERE id = $1 AND owner_id = $2',
      [req.params.id, req.memberId]
    );

    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found or access denied' });
    }

    // Get daily visitor counts for specified period
    const result = await pool.query(
      `SELECT 
        DATE(visited_at) as date,
        COUNT(*) as total_visits,
        COUNT(DISTINCT visitor_id) as unique_visitors,
        COUNT(CASE WHEN cta_clicked = TRUE THEN 1 END) as cta_clicks,
        COUNT(CASE WHEN converted = TRUE THEN 1 END) as conversions,
        AVG(time_on_page_seconds) as avg_dwell_time,
        AVG(scroll_depth) as avg_scroll_depth
       FROM page_visitors
       WHERE page_id = $1 
         AND visited_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(visited_at)
       ORDER BY date ASC`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: result.rows,
      period: `${days} days`
    });
  } catch (error) {
    console.error('Get visitor timeline error:', error);
    res.status(500).json({ error: 'Failed to get visitor timeline' });
  }
});

// GET /api/pages/:id/analytics/geography - Get geographic distribution (placeholder)
router.get('/pages/:id/analytics/geography', authenticateToken, async (req, res) => {
  try {
    // Verify page ownership
    const pageCheck = await pool.query(
      'SELECT id FROM pages WHERE id = $1 AND owner_id = $2',
      [req.params.id, req.memberId]
    );

    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found or access denied' });
    }

    // Placeholder - would integrate with IP geolocation service
    res.json({
      success: true,
      data: [
        { country: 'United States', visitors: 45, percentage: 45 },
        { country: 'United Kingdom', visitors: 20, percentage: 20 },
        { country: 'Canada', visitors: 15, percentage: 15 },
        { country: 'Other', visitors: 20, percentage: 20 }
      ],
      note: 'Geographic tracking requires IP geolocation service integration'
    });
  } catch (error) {
    console.error('Get geography error:', error);
    res.status(500).json({ error: 'Failed to get geographic data' });
  }
});

// GET /api/pages/:id/analytics/devices - Get device/browser breakdown
router.get('/pages/:id/analytics/devices', authenticateToken, async (req, res) => {
  try {
    // Verify page ownership
    const pageCheck = await pool.query(
      'SELECT id FROM pages WHERE id = $1 AND owner_id = $2',
      [req.params.id, req.memberId]
    );

    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found or access denied' });
    }

    // Analyze user agent strings (simplified)
    const result = await pool.query(
      `SELECT 
        CASE 
          WHEN user_agent LIKE '%Mobile%' OR user_agent LIKE '%Android%' OR user_agent LIKE '%iPhone%' THEN 'Mobile'
          WHEN user_agent LIKE '%Tablet%' OR user_agent LIKE '%iPad%' THEN 'Tablet'
          ELSE 'Desktop'
        END as device_type,
        COUNT(*) as count
       FROM page_visitors
       WHERE page_id = $1
       GROUP BY device_type
       ORDER BY count DESC`,
      [req.params.id]
    );

    const total = result.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
    const devices = result.rows.map(row => ({
      device_type: row.device_type,
      count: parseInt(row.count),
      percentage: total > 0 ? Math.round((row.count / total) * 100) : 0
    }));

    res.json({
      success: true,
      data: devices,
      total_visitors: total
    });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ error: 'Failed to get device data' });
  }
});

// POST /api/pages/:id/update-dwell-time - Update visitor dwell time
router.post('/pages/:id/update-dwell-time', authenticateToken, async (req, res) => {
  try {
    const { dwell_time_seconds, scroll_depth } = req.body;

    // Get the most recent visitor record ID
    const visitorResult = await pool.query(
      `SELECT id FROM page_visitors 
       WHERE page_id = $1 AND visitor_id = $2
       ORDER BY visited_at DESC LIMIT 1`,
      [req.params.id, req.memberId]
    );

    if (visitorResult.rows.length > 0) {
      const visitorId = visitorResult.rows[0].id;
      
      // Update dwell time and scroll depth
      await pool.query(
        `UPDATE page_visitors 
         SET time_on_page_seconds = COALESCE(time_on_page_seconds, 0) + $1,
             scroll_depth = GREATEST(COALESCE(scroll_depth, 0), scroll_depth)
         WHERE id = $2`,
        [dwell_time_seconds || 0, visitorId]
      );
    }

    res.json({
      success: true,
      message: 'Dwell time updated'
    });
  } catch (error) {
    console.error('Update dwell time error:', error);
    res.status(500).json({ error: 'Failed to update dwell time' });
  }
});

// POST /api/pages/:id/track-cta-click - Track CTA button click
router.post('/pages/:id/track-cta-click', authenticateToken, async (req, res) => {
  try {
    const { cta_id, cta_type } = req.body;

    // Get the most recent visitor record ID
    const visitorResult = await pool.query(
      `SELECT id FROM page_visitors 
       WHERE page_id = $1 AND visitor_id = $2
       ORDER BY visited_at DESC LIMIT 1`,
      [req.params.id, req.memberId]
    );

    if (visitorResult.rows.length > 0) {
      const visitorId = visitorResult.rows[0].id;
      
      // Update visitor record with CTA click
      await pool.query(
        `UPDATE page_visitors 
         SET cta_clicked = TRUE, cta_type = $1
         WHERE id = $2`,
        [cta_type || 'unknown', visitorId]
      );
    }

    // Increment CTA click count
    if (cta_id) {
      await pool.query(
        'UPDATE page_ctas SET click_count = click_count + 1 WHERE id = $1',
        [cta_id]
      );
    }

    res.json({
      success: true,
      message: 'CTA click tracked'
    });
  } catch (error) {
    console.error('Track CTA click error:', error);
    res.status(500).json({ error: 'Failed to track CTA click' });
  }
});

// ===== Page CTA Button Routes =====

// POST /api/pages/cta - Create CTA button for a page
router.post('/pages/cta', authenticateToken, async (req, res) => {
  try {
    const { page_id, button_text, button_type, action_type, action_value, display_order } = req.body;

    // Validate required fields
    if (!page_id || !button_text || !action_type) {
      return res.status(400).json({ error: 'Page ID, button text, and action type are required' });
    }

    // Verify page exists and belongs to user
    const pageCheck = await pool.query(
      'SELECT id FROM pages WHERE id = $1 AND owner_id = $2',
      [page_id, req.memberId]
    );

    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found or access denied' });
    }

    // Insert CTA button
    const result = await pool.query(
      `INSERT INTO page_ctas (page_id, button_text, button_type, action_type, action_value, display_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [page_id, button_text, button_type || 'primary', action_type, action_value, display_order || 0]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create CTA error:', error);
    res.status(500).json({ error: 'Failed to create CTA button' });
  }
});

// GET /api/pages/:id/ctas - Get all CTA buttons for a page
router.get('/pages/:id/ctas', authenticateToken, async (req, res) => {
  try {
    // Verify page exists
    const pageCheck = await pool.query(
      'SELECT id FROM pages WHERE id = $1',
      [req.params.id]
    );

    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const result = await pool.query(
      'SELECT * FROM page_ctas WHERE page_id = $1 AND is_active = TRUE ORDER BY display_order ASC',
      [req.params.id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get CTAs error:', error);
    res.status(500).json({ error: 'Failed to get CTA buttons' });
  }
});

// PUT /api/pages/cta/:id - Update CTA button
router.put('/pages/cta/:id', authenticateToken, async (req, res) => {
  try {
    const { button_text, button_type, action_type, action_value, display_order, is_active } = req.body;

    // Verify CTA exists and belongs to user's page
    const ctaCheck = await pool.query(
      `SELECT c.id FROM page_ctas c
       JOIN pages p ON c.page_id = p.id
       WHERE c.id = $1 AND p.owner_id = $2`,
      [req.params.id, req.memberId]
    );

    if (ctaCheck.rows.length === 0) {
      return res.status(404).json({ error: 'CTA not found or access denied' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (button_text !== undefined) {
      updates.push(`button_text = $${paramCount++}`);
      values.push(button_text);
    }
    if (button_type !== undefined) {
      updates.push(`button_type = $${paramCount++}`);
      values.push(button_type);
    }
    if (action_type !== undefined) {
      updates.push(`action_type = $${paramCount++}`);
      values.push(action_type);
    }
    if (action_value !== undefined) {
      updates.push(`action_value = $${paramCount++}`);
      values.push(action_value);
    }
    if (display_order !== undefined) {
      updates.push(`display_order = $${paramCount++}`);
      values.push(display_order);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE page_ctas SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update CTA error:', error);
    res.status(500).json({ error: 'Failed to update CTA button' });
  }
});

// DELETE /api/pages/cta/:id - Delete CTA button
router.delete('/pages/cta/:id', authenticateToken, async (req, res) => {
  try {
    // Verify CTA exists and belongs to user's page
    const ctaCheck = await pool.query(
      `SELECT c.id FROM page_ctas c
       JOIN pages p ON c.page_id = p.id
       WHERE c.id = $1 AND p.owner_id = $2`,
      [req.params.id, req.memberId]
    );

    if (ctaCheck.rows.length === 0) {
      return res.status(404).json({ error: 'CTA not found or access denied' });
    }

    await pool.query('DELETE FROM page_ctas WHERE id = $1', [req.params.id]);

    res.json({
      success: true,
      message: 'CTA button deleted successfully'
    });
  } catch (error) {
    console.error('Delete CTA error:', error);
    res.status(500).json({ error: 'Failed to delete CTA button' });
  }
});

// ===== Content Routes =====

// POST /api/content - Create content
router.post('/content', authenticateToken, async (req, res) => {
  try {
    const { page_id, content_type, title, body, media_urls, tags, visibility } = req.body;

    if (!content_type) {
      return res.status(400).json({ error: 'Content type is required' });
    }

    const result = await pool.query(
      `INSERT INTO content (author_id, page_id, content_type, title, body, media_urls, tags, visibility)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.memberId, page_id, content_type, title, body, media_urls || [], tags || [], visibility || 'public']
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// GET /api/content/:id - Get content by ID
router.get('/content/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM content WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Failed to get content' });
  }
});

// GET /api/content/page/:pageId - Get content by page
router.get('/content/page/:pageId', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT c.*, m.membername, m.first_name, m.last_name, m.profile_picture_url
       FROM content c
       JOIN members m ON c.author_id = m.id
       WHERE c.page_id = $1 AND c.visibility = 'public'
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.params.pageId, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit: parseInt(limit), offset: parseInt(offset), total: result.rows.length }
    });
  } catch (error) {
    console.error('Get page content error:', error);
    res.status(500).json({ error: 'Failed to get content' });
  }
});

// GET /api/content/author/:authorId - Get content by author
router.get('/content/author/:authorId', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT c.*, p.page_name, p.slug
       FROM content c
       LEFT JOIN pages p ON c.page_id = p.id
       WHERE c.author_id = $1 AND c.visibility = 'public'
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.params.authorId, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit: parseInt(limit), offset: parseInt(offset), total: result.rows.length }
    });
  } catch (error) {
    console.error('Get author content error:', error);
    res.status(500).json({ error: 'Failed to get content' });
  }
});

// DELETE /api/content/:id - Delete content
router.delete('/content/:id', authenticateToken, async (req, res) => {
  try {
    // Check ownership
    const checkResult = await pool.query(
      'SELECT author_id FROM content WHERE id = $1',
      [req.params.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (checkResult.rows[0].author_id !== req.memberId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM content WHERE id = $1', [req.params.id]);

    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// ===== Engagement Routes =====

// POST /api/engagement - Create engagement (like, comment, share, save)
router.post('/engagement', authenticateToken, async (req, res) => {
  try {
    const { content_id, engagement_type, comment_text } = req.body;

    if (!content_id || !engagement_type) {
      return res.status(400).json({ error: 'Content ID and engagement type are required' });
    }

    // Verify content exists
    const contentCheck = await pool.query(
      'SELECT id FROM content WHERE id = $1',
      [content_id]
    );

    if (contentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    await pool.query(
      `INSERT INTO engagement (user_id, content_id, engagement_type, comment_text)
       VALUES ($1, $2, $3, $4)`,
      [req.memberId, content_id, engagement_type, comment_text]
    );

    // Update engagement score
    await pool.query(
      `UPDATE content 
       SET engagement_score = engagement_score + 
         CASE 
           WHEN $1 = 'like' THEN 1.0
           WHEN $1 = 'comment' THEN 2.0
           WHEN $1 = 'share' THEN 3.0
           WHEN $1 = 'save' THEN 1.5
           ELSE 0.5
         END
       WHERE id = $2`,
      [engagement_type, content_id]
    );

    res.status(201).json({
      success: true,
      message: 'Engagement recorded',
      engagement_type
    });
  } catch (error) {
    console.error('Create engagement error:', error);
    res.status(500).json({ error: 'Failed to create engagement' });
  }
});

// GET /api/engagement/content/:contentId - Get engagements for content
router.get('/engagement/content/:contentId', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT e.*, m.membername, m.first_name, m.last_name, m.profile_picture_url
       FROM engagement e
       JOIN members m ON e.user_id = m.id
       WHERE e.content_id = $1
       ORDER BY e.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.params.contentId, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit: parseInt(limit), offset: parseInt(offset), total: result.rows.length }
    });
  } catch (error) {
    console.error('Get engagements error:', error);
    res.status(500).json({ error: 'Failed to get engagements' });
  }
});

// GET /api/engagement/content/:contentId/count - Get engagement counts
router.get('/engagement/content/:contentId/count', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(*) FILTER (WHERE engagement_type = 'like') as likes,
         COUNT(*) FILTER (WHERE engagement_type = 'comment') as comments,
         COUNT(*) FILTER (WHERE engagement_type = 'share') as shares,
         COUNT(*) FILTER (WHERE engagement_type = 'save') as saves
       FROM engagement
       WHERE content_id = $1`,
      [req.params.contentId]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get engagement counts error:', error);
    res.status(500).json({ error: 'Failed to get engagement counts' });
  }
});

// ===== Groups Routes =====

// POST /api/groups - Create group
router.post('/groups', authenticateToken, async (req, res) => {
  try {
    const { name, description, is_private } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const result = await pool.query(
      `INSERT INTO groups (name, description, owner_id, is_private)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, req.memberId, is_private || false]
    );

    // Add owner as member
    await pool.query(
      `INSERT INTO group_members (group_id, member_id, role)
       VALUES ($1, $2, 'owner')`,
      [result.rows[0].id, req.memberId]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// GET /api/groups/:id - Get group by ID
router.get('/groups/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM groups WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const group = result.rows[0];

    // Check if private group and user is member
    if (group.is_private) {
      const memberCheck = await pool.query(
        'SELECT * FROM group_members WHERE group_id = $1 AND member_id = $2',
        [req.params.id, req.memberId]
      );

      if (memberCheck.rows.length === 0) {
        return res.status(403).json({ error: 'This is a private group' });
      }
    }

    res.json({ success: true, data: group });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ error: 'Failed to get group' });
  }
});

// GET /api/groups - List groups
router.get('/groups', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0, search } = req.query;

    let query = `SELECT g.*, m.membername as owner_name
                 FROM groups g
                 JOIN members m ON g.owner_id = m.id`;
    const params = [];

    if (search) {
      query += ` WHERE g.name ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY g.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit: parseInt(limit), offset: parseInt(offset), total: result.rows.length }
    });
  } catch (error) {
    console.error('List groups error:', error);
    res.status(500).json({ error: 'Failed to list groups' });
  }
});

// POST /api/groups/:id/join - Join group
router.post('/groups/:id/join', authenticateToken, async (req, res) => {
  try {
    // Check if group exists
    const groupCheck = await pool.query(
      'SELECT * FROM groups WHERE id = $1',
      [req.params.id]
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if already member
    const memberCheck = await pool.query(
      'SELECT * FROM group_members WHERE group_id = $1 AND member_id = $2',
      [req.params.id, req.memberId]
    );

    if (memberCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Already a member of this group' });
    }

    await pool.query(
      `INSERT INTO group_members (group_id, member_id, role)
       VALUES ($1, $2, 'member')`,
      [req.params.id, req.memberId]
    );

    // Update member count
    await pool.query(
      'UPDATE groups SET member_count = member_count + 1 WHERE id = $1',
      [req.params.id]
    );

    res.status(201).json({
      success: true,
      message: 'Joined group successfully'
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// ===== Followers Routes =====

// POST /api/followers/:followingId - Follow user
router.post('/followers/:followingId', authenticateToken, async (req, res) => {
  try {
    // Cannot follow yourself
    if (req.params.followingId === req.memberId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if user exists
    const userCheck = await pool.query(
      'SELECT id FROM members WHERE id = $1',
      [req.params.followingId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    const followCheck = await pool.query(
      'SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2',
      [req.memberId, req.params.followingId]
    );

    if (followCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Already following this user' });
    }

    await pool.query(
      `INSERT INTO followers (follower_id, following_id)
       VALUES ($1, $2)`,
      [req.memberId, req.params.followingId]
    );

    res.status(201).json({
      success: true,
      message: 'Following user successfully'
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// DELETE /api/followers/:followingId - Unfollow user
router.delete('/followers/:followingId', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM followers WHERE follower_id = $1 AND following_id = $2',
      [req.memberId, req.params.followingId]
    );

    res.json({
      success: true,
      message: 'Unfollowed user successfully'
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

// GET /api/followers/:userId/followers - Get followers
router.get('/followers/:userId/followers', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT f.*, m.membername, m.first_name, m.last_name, m.profile_picture_url
       FROM followers f
       JOIN members m ON f.follower_id = m.id
       WHERE f.following_id = $1
       ORDER BY f.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.params.userId, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit: parseInt(limit), offset: parseInt(offset), total: result.rows.length }
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Failed to get followers' });
  }
});

// GET /api/followers/:userId/following - Get following
router.get('/followers/:userId/following', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT f.*, m.membername, m.first_name, m.last_name, m.profile_picture_url
       FROM followers f
       JOIN members m ON f.following_id = m.id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.params.userId, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit: parseInt(limit), offset: parseInt(offset), total: result.rows.length }
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Failed to get following' });
  }
});

// ===== Earnings Routes =====

// GET /api/earnings - Get earnings history
router.get('/earnings', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;

    let query = 'SELECT * FROM earnings WHERE member_id = $1';
    const params = [req.memberId];

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: { limit: parseInt(limit), offset: parseInt(offset), total: result.rows.length }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ error: 'Failed to get earnings' });
  }
});

// GET /api/earnings/summary - Get earnings summary
router.get('/earnings/summary', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         SUM(amount) FILTER (WHERE status = 'paid') as total_paid,
         SUM(amount) FILTER (WHERE status = 'pending') as total_pending,
         SUM(amount) FILTER (WHERE status = 'approved') as total_approved,
         COUNT(*) FILTER (WHERE status = 'paid') as paid_count,
         COUNT(*) FILTER (WHERE status = 'pending') as pending_count
       FROM earnings
       WHERE member_id = $1`,
      [req.memberId]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get earnings summary error:', error);
    res.status(500).json({ error: 'Failed to get earnings summary' });
  }
});

// ===== Profile Enhancement Routes =====

// POST /api/profile/video/upload - Upload profile video
router.post('/profile/video/upload', authenticateToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const videoFile = req.file;
    
    // Validate file type
    if (!videoFile.mimetype.startsWith('video/')) {
      return res.status(400).json({ error: 'Invalid file type. Only video files are allowed.' });
    }

    // Validate file size (max 10MB)
    if (videoFile.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Video file too large. Maximum size is 10MB.' });
    }

    // TODO: Get video duration using ffprobe or similar
    // For now, we'll use a placeholder
    const videoDuration = 3; // Placeholder - would be extracted from actual video
    
    // Validate duration (3-5 seconds)
    if (videoDuration < 3 || videoDuration > 5) {
      return res.status(400).json({ 
        error: 'Video duration must be between 3-5 seconds',
        current_duration: videoDuration
      });
    }

    // Generate thumbnail (placeholder - would use ffmpeg in production)
    const thumbnailUrl = `/uploads/thumbnails/${req.memberId}_${Date.now()}.jpg`;

    // Save video URL (in production, this would be uploaded to S3/Cloudinary)
    const videoUrl = `/uploads/videos/${req.memberId}_${Date.now()}.mp4`;

    // Update member profile
    await pool.query(
      `UPDATE members 
       SET profile_video_url = $1,
           profile_video_duration = $2,
           profile_video_thumbnail = $3,
           profile_video_uploaded_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [videoUrl, videoDuration, thumbnailUrl, req.memberId]
    );

    res.json({
      success: true,
      message: 'Profile video uploaded successfully',
      data: {
        video_url: videoUrl,
        duration: videoDuration,
        thumbnail: thumbnailUrl
      }
    });
  } catch (error) {
    console.error('Upload profile video error:', error);
    res.status(500).json({ error: 'Failed to upload profile video' });
  }
});

// GET /api/profile/video/:memberId - Get profile video
router.get('/profile/video/:memberId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT profile_video_url, profile_video_duration, profile_video_thumbnail, profile_video_uploaded_at
       FROM members
       WHERE id = $1 AND profile_video_url IS NOT NULL`,
      [req.params.memberId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile video not found' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get profile video error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile video' });
  }
});

// DELETE /api/profile/video - Remove profile video
router.delete('/profile/video', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      `UPDATE members 
       SET profile_video_url = NULL,
           profile_video_duration = NULL,
           profile_video_thumbnail = NULL,
           profile_video_uploaded_at = NULL
       WHERE id = $1`,
      [req.memberId]
    );

    res.json({
      success: true,
      message: 'Profile video removed successfully'
    });
  } catch (error) {
    console.error('Delete profile video error:', error);
    res.status(500).json({ error: 'Failed to remove profile video' });
  }
});

// ===== Skills Routes =====

// GET /api/skills - Get all skills (with optional category filter)
router.get('/skills', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = 'SELECT * FROM skills WHERE is_active = TRUE';
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount++}`;
      params.push(category);
    }

    if (search) {
      query += ` AND name ILIKE $${paramCount++}`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Failed to retrieve skills' });
  }
});

// POST /api/profile/skills - Add skill to member profile
router.post('/profile/skills', authenticateToken, async (req, res) => {
  try {
    const { skill_id, proficiency_level, years_experience } = req.body;

    if (!skill_id || !proficiency_level) {
      return res.status(400).json({ error: 'Skill ID and proficiency level are required' });
    }

    // Validate proficiency level (1-5)
    if (proficiency_level < 1 || proficiency_level > 5) {
      return res.status(400).json({ error: 'Proficiency level must be between 1 and 5' });
    }

    // Check if skill exists
    const skillCheck = await pool.query('SELECT id FROM skills WHERE id = $1', [skill_id]);
    if (skillCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Add skill to member
    await pool.query(
      `INSERT INTO member_skills (member_id, skill_id, proficiency_level, years_experience)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (member_id, skill_id) 
       DO UPDATE SET 
         proficiency_level = EXCLUDED.proficiency_level,
         years_experience = EXCLUDED.years_experience`,
      [req.memberId, skill_id, proficiency_level, years_experience || null]
    );

    // Get the complete skill data
    const skillData = await pool.query(
      `SELECT ms.*, s.name as skill_name, s.category
       FROM member_skills ms
       JOIN skills s ON ms.skill_id = s.id
       WHERE ms.member_id = $1 AND ms.skill_id = $2`,
      [req.memberId, skill_id]
    );

    res.status(201).json({
      success: true,
      data: skillData.rows[0]
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// GET /api/profile/skills/:memberId - Get member's skills
router.get('/profile/skills/:memberId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ms.*, s.name as skill_name, s.category, s.description
       FROM member_skills ms
       JOIN skills s ON ms.skill_id = s.id
       WHERE ms.member_id = $1
       ORDER BY ms.proficiency_level DESC, ms.endorsement_count DESC`,
      [req.params.memberId]
    );

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get member skills error:', error);
    res.status(500).json({ error: 'Failed to retrieve skills' });
  }
});

// DELETE /api/profile/skills/:skillId - Remove skill from profile
router.delete('/profile/skills/:skillId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM member_skills WHERE member_id = $1 AND skill_id = $2 RETURNING *',
      [req.memberId, req.params.skillId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found in profile' });
    }

    res.json({
      success: true,
      message: 'Skill removed successfully'
    });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ error: 'Failed to remove skill' });
  }
});

// POST /api/profile/skills/:memberId/:skillId/endorse - Endorse a skill
router.post('/profile/skills/:memberId/:skillId/endorse', authenticateToken, async (req, res) => {
  try {
    const { endorsement_message } = req.body;

    // Prevent self-endorsement
    if (req.params.memberId === req.memberId) {
      return res.status(400).json({ error: 'Cannot endorse your own skills' });
    }

    // Check if already endorsed
    const existingEndorsement = await pool.query(
      'SELECT id FROM skill_endorsements WHERE endorser_id = $1 AND endorsed_member_id = $2 AND skill_id = $3',
      [req.memberId, req.params.memberId, req.params.skillId]
    );

    if (existingEndorsement.rows.length > 0) {
      return res.status(409).json({ error: 'You have already endorsed this skill' });
    }

    // Create endorsement
    await pool.query(
      `INSERT INTO skill_endorsements (endorser_id, endorsed_member_id, skill_id, endorsement_message)
       VALUES ($1, $2, $3, $4)`,
      [req.memberId, req.params.memberId, req.params.skillId, endorsement_message || null]
    );

    res.status(201).json({
      success: true,
      message: 'Skill endorsed successfully'
    });
  } catch (error) {
    console.error('Endorse skill error:', error);
    res.status(500).json({ error: 'Failed to endorse skill' });
  }
});

// GET /api/profile/skills/:memberId/:skillId/endorsements - Get endorsements for a skill
router.get('/profile/skills/:memberId/:skillId/endorsements', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT se.*, m.first_name, m.last_name, m.profile_picture_url
       FROM skill_endorsements se
       JOIN members m ON se.endorser_id = m.id
       WHERE se.endorsed_member_id = $1 AND se.skill_id = $2
       ORDER BY se.created_at DESC`,
      [req.params.memberId, req.params.skillId]
    );

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get endorsements error:', error);
    res.status(500).json({ error: 'Failed to retrieve endorsements' });
  }
});

// ===== Error Handling =====
router.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;
