const express = require('express');
const router = express.Router();
const creatorOnboardingController = require('../controllers/creatorOnboardingController');
const { verifyRegionalIntegrityMiddleware } = require('../middleware/verifyRegionalIntegrity');

// Public availability endpoint for onboarding screen
router.get('/availability', creatorOnboardingController.getAvailability);

// Creator signup with Anti-Fraud Regional Integrity Gate
router.post(
  '/signup',
  verifyRegionalIntegrityMiddleware,
  creatorOnboardingController.processCreatorSignup
);

// Claim dated cohort seat
router.post('/cohort-claim', creatorOnboardingController.claimCohortSeat);

module.exports = router;
