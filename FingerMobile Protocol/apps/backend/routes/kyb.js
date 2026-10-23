const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../utils/logger');

const getPool = () => db.pool || db;

/**
 * POST /api/kyb/submit
 * Submit business entity KYB verification
 */
router.post('/submit', async (req, res) => {
  try {
    const {
      userId = req.user?.id || 'user_default',
      businessLegalName,
      businessRegistrationNumber,
      businessType = 'LLC',
      taxId,
      incorporationDate,
      registeredAddress,
      businessEmail,
      businessPhone,
      websiteUrl,
      industryCategory = 'Technology'
    } = req.body;

    if (!businessLegalName || !businessRegistrationNumber) {
      return res.status(400).json({
        success: false,
        message: 'businessLegalName and businessRegistrationNumber are required'
      });
    }

    const result = await getPool().query(
      `INSERT INTO kyb_records (
        user_id, business_legal_name, business_registration_number, business_type,
        tax_id, incorporation_date, registered_address, business_email,
        business_phone, website_url, industry_category, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PENDING')
      RETURNING *`,
      [
        String(userId), businessLegalName, businessRegistrationNumber, businessType,
        taxId || '', incorporationDate || null, registeredAddress || '', businessEmail || '',
        businessPhone || '', websiteUrl || '', industryCategory
      ]
    );

    res.status(201).json({
      success: true,
      message: 'KYB business verification submitted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error submitting KYB:', error);
    res.status(500).json({ success: false, message: 'Failed to submit KYB', error: error.message });
  }
});

/**
 * GET /api/kyb/status/:userId
 * Get KYB status for a user/business
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await getPool().query(
      'SELECT * FROM kyb_records WHERE user_id = $1 ORDER BY submitted_at DESC LIMIT 1',
      [String(userId)]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          status: 'UNVERIFIED',
          kybRecord: null
        }
      });
    }

    res.json({
      success: true,
      data: {
        status: result.rows[0].status,
        kybRecord: result.rows[0]
      }
    });
  } catch (error) {
    logger.error('Error fetching KYB status:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch KYB status', error: error.message });
  }
});

/**
 * GET /api/kyb/pending
 * Admin list pending KYBs
 */
router.get('/pending', async (req, res) => {
  try {
    const result = await getPool().query(
      'SELECT * FROM kyb_records WHERE status = \'PENDING\' ORDER BY submitted_at ASC'
    );
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    logger.error('Error fetching pending KYB:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending KYB', error: error.message });
  }
});

/**
 * POST /api/kyb/approve (or /api/admin/kyb/approve)
 * Approve KYB verification
 */
router.post('/approve', async (req, res) => {
  try {
    const { kybId, reviewerId = 'admin_super', notes = 'Approved by compliance officer' } = req.body;
    const result = await getPool().query(
      `UPDATE kyb_records 
       SET status = 'APPROVED', reviewer_id = $1, review_notes = $2, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $3 OR user_id = $3
       RETURNING *`,
      [reviewerId, notes, kybId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'KYB record not found' });
    }

    res.json({ success: true, message: 'KYB record approved', data: result.rows[0] });
  } catch (error) {
    logger.error('Error approving KYB:', error);
    res.status(500).json({ success: false, message: 'Failed to approve KYB', error: error.message });
  }
});

/**
 * POST /api/kyb/reject (or /api/admin/kyb/reject)
 * Reject KYB verification
 */
router.post('/reject', async (req, res) => {
  try {
    const { kybId, reviewerId = 'admin_super', reason = 'Documentation rejected' } = req.body;
    const result = await getPool().query(
      `UPDATE kyb_records 
       SET status = 'REJECTED', reviewer_id = $1, review_notes = $2, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $3 OR user_id = $3
       RETURNING *`,
      [reviewerId, reason, kybId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'KYB record not found' });
    }

    res.json({ success: true, message: 'KYB record rejected', data: result.rows[0] });
  } catch (error) {
    logger.error('Error rejecting KYB:', error);
    res.status(500).json({ success: false, message: 'Failed to reject KYB', error: error.message });
  }
});

module.exports = router;
