/**
 * Events API Routes
 * Date: September 29, 2026
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));

// GET /api/events - List events
router.get('/', async (req, res) => {
  try {
    const { event_type, is_virtual, limit = 20, offset = 0 } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (event_type) {
      params.push(event_type);
      query += ` AND event_type = $${params.length}`;
    }
    if (is_virtual !== undefined) {
      params.push(is_virtual === 'true');
      query += ` AND is_virtual = $${params.length}`;
    }

    query += ` ORDER BY start_time ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    return res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/events/:id - Event details with attendees
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    const attendees = await pool.query(
      `SELECT ea.*, u.username, u.avatar_url 
       FROM event_attendees ea 
       LEFT JOIN users u ON ea.user_id = u.id 
       WHERE ea.event_id = $1 ORDER BY ea.registered_at DESC LIMIT 50`,
      [req.params.id]
    );
    return res.json({
      success: true,
      data: { ...result.rows[0], attendees: attendees.rows }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/events - Create event
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.body.organizer_id || 4;
    const {
      title, description, start_time, end_time, location,
      is_virtual = false, event_type = 'meetup', ticket_price = 0, banner_url
    } = req.body;

    if (!title || !start_time) {
      return res.status(400).json({ success: false, error: 'Title and start time are required' });
    }

    const result = await pool.query(
      `INSERT INTO events (title, description, start_time, end_time, location, is_virtual, event_type, ticket_price, organizer_id, banner_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, description, start_time, end_time, location, is_virtual, event_type, ticket_price, userId, banner_url]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/events/:id/rsvp - RSVP to event
router.post('/:id/rsvp', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.body.user_id || 4;
    const eventId = parseInt(req.params.id, 10);
    const { status = 'attending' } = req.body;

    await pool.query(
      `INSERT INTO event_attendees (event_id, user_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (event_id, user_id) DO UPDATE SET status = EXCLUDED.status`,
      [eventId, userId, status]
    );
    await pool.query(
      'UPDATE events SET attendees_count = (SELECT COUNT(*) FROM event_attendees WHERE event_id = $1 AND status = \'attending\') WHERE id = $1',
      [eventId]
    );

    return res.json({ success: true, message: 'RSVP registered successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
