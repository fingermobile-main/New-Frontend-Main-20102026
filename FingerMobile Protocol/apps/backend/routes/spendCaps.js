const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const spendCapController = require('../controllers/spendCapController');

// Get user's spend cap
router.get('/me', authenticate, spendCapController.getCap);

// Update user's spend cap
router.put('/me', authenticate, spendCapController.updateCap);

// Remove user's spend cap
router.delete('/me', authenticate, spendCapController.removeCap);

// Internal route to record spending (would typically be called by other services)
// This would be protected by additional middleware in production
router.post('/record-spending', authenticate, spendCapController.recordSpending);

module.exports = router;
