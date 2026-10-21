const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/WebhookController');
const { authenticate } = require('../middleware/authenticate');

// All routes require authentication
router.use(authenticate);

// Register webhook subscription
router.post('/', WebhookController.registerWebhook);

// List webhook subscriptions
router.get('/', WebhookController.listWebhooks);

// Update webhook subscription
router.put('/:id', WebhookController.updateWebhook);

// Delete webhook subscription
router.delete('/:id', WebhookController.deleteWebhook);

// Get webhook delivery history
router.get('/:id/deliveries', WebhookController.getDeliveries);

// Test webhook delivery
router.post('/:id/test', WebhookController.testWebhook);

module.exports = router;
