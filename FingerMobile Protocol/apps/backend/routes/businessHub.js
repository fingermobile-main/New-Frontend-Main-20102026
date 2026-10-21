const express = require('express');
const router = express.Router();
const controller = require('../controllers/businessHubController');
const { authenticate } = require('../middleware/authenticate');

router.get('/metrics', authenticate, controller.getBusinessMetrics);
router.put('/profile', authenticate, controller.updateBusinessProfile);

module.exports = router;
