const express = require('express');
const router = express.Router();
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));
const {
  submitCreatorVerification,
  submitOfficialVerification,
  getVerificationStatus,
  sendVerificationCode,
  verifyCode
} = require('../controllers/VerificationController');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  return next();
};

// Submission routes
router.post('/creator', optionalAuth, submitCreatorVerification);
router.post('/submit', optionalAuth, submitCreatorVerification);
router.post('/kyc/submit', optionalAuth, submitCreatorVerification);
router.post('/kyb/submit', optionalAuth, submitOfficialVerification);
router.post('/official/submit', optionalAuth, submitOfficialVerification);

// Status & Verification Records
router.get('/status', optionalAuth, getVerificationStatus);
router.get('/my', optionalAuth, getVerificationStatus);

// Interactive Code verification for Phone & Email
router.post('/send-code', optionalAuth, sendVerificationCode);
router.post('/verify-code', optionalAuth, verifyCode);

module.exports = router;
