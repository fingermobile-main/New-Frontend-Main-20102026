/**
 * STERCS (Strategic Tactical Enterprise Resource Control SYSTEM™️©️®️)
 * PRO-MPTS (Protocol and Manipulation System ™️©️®️)
 *
 * Routes for Guardian Protection System and Kill Switch functionality
 */

const express = require('express');
const router = express.Router();
const stercesController = require('../controllers/stercesController');
const { authenticate, requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Apply Guardian Protection to all routes in this router
const { guardianProtection } = require('../middleware/guardianProtection');

// Apply guardian protection to all routes
router.use(guardianProtection);

// Public routes (require Guardian protection but not authentication)
router.get('/status', stercesController.getGuardianStatus);
router.post('/request-first-pin', stercesController.requestFirstPin);
router.post('/validate-first-pin', stercesController.validateFirstPin);
router.post('/validate-backup-pins', stercesController.validateBackupPins);
router.post('/trigger-mfa-biometric', stercesController.triggerMfaAndBiometric);

// Protected routes (require authentication and Guardian protection)
router.use(requireAuth);

router.post('/execute-kill-switch',
  authorize(['superadmin']),
  stercesController.executeKillSwitchAction
);

router.post('/activate-emergency',
  authorize(['superadmin']),
  stercesController.activateEmergencyKillSwitch
);

router.post('/manage-countdown',
  authorize(['superadmin']),
  stercesController.manageCountdownTimer
);

router.post('/secondary-authorization',
  authorize(['superadmin']),
  stercesController.secondaryAuthorization
);

// Middleware to check if platform is frozen
router.use((req, res, next) => {
  // In a real implementation, this would check if the platform is in frozen state
  // and block non-essential routes accordingly
  next();
});

module.exports = router;
