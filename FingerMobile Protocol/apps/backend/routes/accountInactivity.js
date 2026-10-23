const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const accountInactivityController = require('../controllers/accountInactivityController');

// Get account inactivity status
router.get('/status', authenticate, accountInactivityController.getStatus);

// Update last login (called when user logs in)
router.post('/update-last-login', authenticate, accountInactivityController.updateLastLogin);

// Admin routes
router.put('/reactivate/:userId', authenticate, (req, res, next) => {
  // Add admin check middleware here
  const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  accountInactivityController.forceReactivate(req, res);
});

router.post('/trigger-check', authenticate, (req, res, next) => {
  // Add admin check middleware here
  const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  accountInactivityController.triggerInactivityCheck(req, res);
});

module.exports = router;
