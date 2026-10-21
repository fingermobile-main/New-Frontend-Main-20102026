const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const {
  enableTotp,
  verifyTotp,
  disableTotp,
  generateBackupCodes,
  verifyBackupCode } = require('../controllers/twoFactorAuthController');

const router = express.Router();

// Enable TOTP authenticator
router.post('/enable', authenticate, enableTotp);

// Verify and activate TOTP
router.post('/verify', authenticate, verifyTotp);

// Disable TOTP
router.post('/disable', authenticate, disableTotp);

// Generate backup codes
router.post('/backup-codes/generate', authenticate, generateBackupCodes);

// Verify a backup code
router.post('/backup-codes/verify', authenticate, verifyBackupCode);

module.exports = router;
