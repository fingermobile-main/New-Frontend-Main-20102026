const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../utils/logger');

const getPool = () => db.pool || db;

/**
 * POST /api/kyc/submit
 * Submit individual KYC identity verification
 */
router.post('/submit', async (req, res) => {
  try {
    const {
      userId = req.user?.id || 'user_default',
      fullLegalName,
      dateOfBirth,
      nationality = 'US',
      idDocumentType = 'PASSPORT',
      idDocumentNumber,
      biometricFaceHash,
      addressLine1,
      city,
      stateProvince,
      postalCode,
      countryCode = 'US'
    } = req.body;

    if (!fullLegalName || !biometricFaceHash) {
      return res.status(400).json({ success: false, message: 'fullLegalName and biometricFaceHash are required' });
    }

    // Age calculation
    let isAbove22 = true;
    if (dateOfBirth) {
      const birth = new Date(dateOfBirth);
      const ageDiff = Date.now() - birth.getTime();
      const ageDate = new Date(ageDiff);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (calculatedAge < 22) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'AGE_RESTRICTION',
            message: 'You must be at least 22 years old to complete verification'
          }
        });
      }
    }

    const result = await getPool().query(
      `INSERT INTO kyc_records (
        user_id, full_legal_name, date_of_birth, is_above_22_years,
        nationality, id_document_type, id_document_number, biometric_face_hash,
        address_line1, city, state_province, postal_code, country_code, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'PENDING')
      RETURNING *`,
      [
        String(userId), fullLegalName, dateOfBirth || null, isAbove22,
        nationality, idDocumentType, idDocumentNumber || 'DOC-PENDING', biometricFaceHash,
        addressLine1 || '', city || '', stateProvince || '', postalCode || '', countryCode
      ]
    );

    res.status(201).json({
      success: true,
      message: 'KYC verification submitted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error submitting KYC:', error);
    res.status(500).json({ success: false, message: 'Failed to submit KYC', error: error.message });
  }
});

/**
 * GET /api/kyc/status/:userId
 * Get verification status for a specific user
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await getPool().query(
      'SELECT * FROM kyc_records WHERE user_id = $1 ORDER BY submitted_at DESC LIMIT 1',
      [String(userId)]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          status: 'UNVERIFIED',
          kycRecord: null
        }
      });
    }

    res.json({
      success: true,
      data: {
        status: result.rows[0].status,
        kycRecord: result.rows[0]
      }
    });
  } catch (error) {
    logger.error('Error fetching KYC status:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch KYC status', error: error.message });
  }
});

/**
 * GET /api/kyc/pending
 * Admin listing of pending KYC applications
 */
router.get('/pending', async (req, res) => {
  try {
    const result = await getPool().query(
      'SELECT * FROM kyc_records WHERE status = \'PENDING\' ORDER BY submitted_at ASC'
    );
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    logger.error('Error fetching pending KYC:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending KYC', error: error.message });
  }
});

/**
 * POST /api/kyc/approve (or /api/admin/kyc/approve)
 * Approve KYC verification
 */
router.post('/approve', async (req, res) => {
  try {
    const { kycId, reviewerId = 'admin_super', notes = 'Approved by compliance officer' } = req.body;
    const result = await getPool().query(
      `UPDATE kyc_records 
       SET status = 'APPROVED', reviewer_id = $1, review_notes = $2, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $3 OR user_id = $3
       RETURNING *`,
      [reviewerId, notes, kycId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'KYC record not found' });
    }

    res.json({ success: true, message: 'KYC record approved', data: result.rows[0] });
  } catch (error) {
    logger.error('Error approving KYC:', error);
    res.status(500).json({ success: false, message: 'Failed to approve KYC', error: error.message });
  }
});

/**
 * POST /api/kyc/reject (or /api/admin/kyc/reject)
 * Reject KYC verification
 */
router.post('/reject', async (req, res) => {
  try {
    const { kycId, reviewerId = 'admin_super', reason = 'Documentation rejected' } = req.body;
    const result = await getPool().query(
      `UPDATE kyc_records 
       SET status = 'REJECTED', reviewer_id = $1, review_notes = $2, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $3 OR user_id = $3
       RETURNING *`,
      [reviewerId, reason, kycId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'KYC record not found' });
    }

    res.json({ success: true, message: 'KYC record rejected', data: result.rows[0] });
  } catch (error) {
    logger.error('Error rejecting KYC:', error);
    res.status(500).json({ success: false, message: 'Failed to reject KYC', error: error.message });
  }
});

module.exports = router;
