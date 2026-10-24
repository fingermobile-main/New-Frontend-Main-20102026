/**
 * User Consent Routes
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 * Implements NDPA 2023 Section 31, GDPR Art. 6/9, and EU AI Act Art. 52
 */

const express = require('express');
const router = express.Router();
const userConsentController = require('../controllers/userConsentController');

// Retrieve consent preferences
router.get('/consent', userConsentController.getConsent);

// Update consent preferences
router.post('/consent', userConsentController.updateConsent);

// Export consent preferences & audit trail (GDPR Art. 20)
router.get('/consent/export', userConsentController.exportConsent);
router.post('/consent/export', userConsentController.exportConsent);

// Revoke non-essential consent flags
router.post('/consent/revoke', userConsentController.revokeConsent);

module.exports = router;
