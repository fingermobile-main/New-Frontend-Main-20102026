const express = require('express');
const router = express.Router();
const WidgetsController = require('../controllers/WidgetsController');
const { authenticate } = require('../middleware/authenticate');

// Get widget by type
router.get('/:type', authenticate, WidgetsController.getWidget);

// Batch get multiple widgets
router.post('/batch', authenticate, WidgetsController.getBatchWidgets);

// Invalidate widget cache (admin only)
router.post('/invalidate-cache', authenticate, WidgetsController.invalidateCache);

// List available widget types
router.get('/types', authenticate, WidgetsController.listWidgetTypes);

module.exports = router;
