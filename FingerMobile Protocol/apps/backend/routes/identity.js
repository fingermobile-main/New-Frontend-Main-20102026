const express = require('express');
const { identityDb } = require('../db');
const { authenticate } = require('../middleware/authenticate');
const logger = require('../utils/logger');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Identity route - active' });
});

// Creator verification endpoint
router.post('/verifications/creator', authenticate, async (req, res) => {
  const { legalName, nationality, passportNumber } = req.body;
  const userId = req.member ? req.member.id : req.user.id;

  try {
    const result = await identityDb.query(
      `INSERT INTO verification_records (member_id, legal_name, passport_number, nationality, verification_status, type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [userId, legalName, passportNumber, nationality, 'pending', 'creator']
    );

    return res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (error) {
    logger.error('Error submitting creator verification:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Enterprise verification endpoint
router.post('/verifications/enterprise', authenticate, async (req, res) => {
  const { companyName, legalRepName } = req.body;
  const userId = req.member ? req.member.id : req.user.id;

  try {
    const result = await identityDb.query(
      `INSERT INTO verification_records (member_id, legal_name, full_name, registration_number, country_code, verification_status, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [userId, companyName, legalRepName, 'N/A', 'US', 'pending', 'enterprise']
    );

    return res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (error) {
    logger.error('Error submitting enterprise verification:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
