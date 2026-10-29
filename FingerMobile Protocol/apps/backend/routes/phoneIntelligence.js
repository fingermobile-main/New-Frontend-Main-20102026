/**
 * Phone Intelligence Routes - FingerMobile Protocol™
 * Endpoints for PhoneInfoga / Telephony Intelligence
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/phoneIntelligenceController');

router.post('/scan', controller.scanPhone);
router.post('/validate', controller.validatePhone);
router.get('/history/:phone', controller.getHistory);

module.exports = router;

