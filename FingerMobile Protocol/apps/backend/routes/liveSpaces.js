/**
 * Live Spaces API Routes
 * Date: September 29, 2026
 */

const express = require('express');
const { pool } = require('../db');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

const LiveSpaceController = require('../controllers/LiveSpaceController');

// GET /api/live-spaces - List active spaces
router.get('/', async (req, res) => {
  try {
    const { status = 'live', limit = 20, offset = 0 } = req.query;
    const result = await pool.query(
      `SELECT ls.*, u.username as host_name, u.avatar_url as host_avatar
       FROM live_spaces ls
       LEFT JOIN users u ON ls.host_id = u.id
       WHERE ls.status = $1
       ORDER BY ls.listeners_count DESC
       LIMIT $2 OFFSET $3`,
      [status, parseInt(limit), parseInt(offset)]
    );
    return res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/live-spaces/:id - Get space details
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ls.*, u.username as host_name, u.avatar_url as host_avatar
       FROM live_spaces ls
       LEFT JOIN users u ON ls.host_id = u.id
       WHERE ls.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Live space not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/live-spaces - Create new live space
router.post('/', authenticate, async (req, res) => {
  try {
    const hostId = req.user?.id || req.body.host_id || 4;
    const { title, topic, is_recorded = false } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'Title is required' });

    const result = await pool.query(
      `INSERT INTO live_spaces (title, topic, host_id, status, listeners_count, is_recorded, started_at)
       VALUES ($1, $2, $3, 'live', 1, $4, CURRENT_TIMESTAMP) RETURNING *`,
      [title, topic || 'General', hostId, is_recorded]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// NEW: Video Rooms endpoints
// POST /api/live-spaces/rooms/create - Create a video room
router.post('/rooms/create', authenticate, LiveSpaceController.createRoom);

// GET /api/live-spaces/rooms/active - List active rooms
router.get('/rooms/active', authenticate, LiveSpaceController.getActiveRooms);

// POST /api/live-spaces/rooms/:id/end - End a room
router.post('/rooms/:id/end', authenticate, LiveSpaceController.endRoom);

// POST /api/live-spaces/:id/end - End live space
router.post('/:id/end', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE live_spaces SET status = \'ended\', ended_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
