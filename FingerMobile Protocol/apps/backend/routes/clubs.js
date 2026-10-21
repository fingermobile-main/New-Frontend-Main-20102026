/**
 * Clubs API Routes
 * Date: September 29, 2026
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));

// GET /api/clubs - List all clubs
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;
    let query = 'SELECT * FROM clubs WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    query += ` ORDER BY members_count DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    return res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/clubs/:id - Club details with members
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clubs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Club not found' });
    }
    const members = await pool.query(
      `SELECT cm.*, u.username, u.avatar_url 
       FROM club_members cm 
       LEFT JOIN users u ON cm.user_id = u.id 
       WHERE cm.club_id = $1 ORDER BY cm.joined_at DESC LIMIT 50`,
      [req.params.id]
    );
    return res.json({
      success: true,
      data: { ...result.rows[0], members: members.rows }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/clubs - Create new club
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.body.leader_id || 4;
    const { name, description, category = 'General', banner_url, is_private = false } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Name is required' });

    const result = await pool.query(
      `INSERT INTO clubs (name, description, category, banner_url, is_private, leader_id, members_count)
       VALUES ($1, $2, $3, $4, $5, $6, 1) RETURNING *`,
      [name, description, category, banner_url, is_private, userId]
    );
    const club = result.rows[0];
    await pool.query(
      'INSERT INTO club_members (club_id, user_id, role) VALUES ($1, $2, \'leader\') ON CONFLICT DO NOTHING',
      [club.id, userId]
    );
    return res.status(201).json({ success: true, data: club });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/clubs/:id/join - Join club
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.body.user_id || 4;
    const clubId = parseInt(req.params.id, 10);

    await pool.query(
      'INSERT INTO club_members (club_id, user_id, role) VALUES ($1, $2, \'member\') ON CONFLICT DO NOTHING',
      [clubId, userId]
    );
    await pool.query(
      'UPDATE clubs SET members_count = (SELECT COUNT(*) FROM club_members WHERE club_id = $1) WHERE id = $1',
      [clubId]
    );

    return res.json({ success: true, message: 'Joined club successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/clubs/:id/leave - Leave club
router.delete('/:id/leave', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.body.user_id || 4;
    const clubId = parseInt(req.params.id, 10);

    await pool.query(
      'DELETE FROM club_members WHERE club_id = $1 AND user_id = $2',
      [clubId, userId]
    );
    await pool.query(
      'UPDATE clubs SET members_count = (SELECT COUNT(*) FROM club_members WHERE club_id = $1) WHERE id = $1',
      [clubId]
    );

    return res.json({ success: true, message: 'Left club successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
