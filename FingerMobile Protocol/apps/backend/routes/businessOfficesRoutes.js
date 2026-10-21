const express = require('express');
const router = express.Router();
const db = require('../db');
const pool = db.pool || db;
const logger = require('../utils/logger');

// POST /api/business/offices/book
router.post('/book', async (req, res) => {
  try {
    const { officeId, name, email, date, purpose, attendees } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const result = await pool.query(
      `INSERT INTO corporate_office_bookings (office_id, name, email, booking_date, purpose, attendees, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'confirmed', NOW())
       RETURNING *`,
      [officeId || 'abuja-hq', name, email, date ? new Date(date) : new Date(), purpose || 'Creator Studio Session', parseInt(attendees, 10) || 1]
    );

    res.status(201).json({
      success: true,
      message: 'Office visit appointment confirmed successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error in corporate office booking:', error);
    res.status(500).json({ success: false, message: 'Failed to process booking', error: error.message });
  }
});

// GET /api/business/offices/bookings
router.get('/bookings', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM corporate_office_bookings ORDER BY created_at DESC LIMIT 50`
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error fetching office bookings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
  }
});

module.exports = router;
