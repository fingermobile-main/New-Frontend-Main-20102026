const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/WebhookController');
const { authenticate } = require('../middleware/authenticate');

// All routes require authentication
router.use(authenticate);

// Get webhook delivery history (alias route for compatibility)
router.get('/:id', WebhookController.getDeliveries);

module.exports = router;
