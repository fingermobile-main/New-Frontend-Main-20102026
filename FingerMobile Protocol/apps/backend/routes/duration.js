const express = require('express');
const router = express.Router();
const DurationController = require('../controllers/DurationController');
const authenticate = require('../middleware/authenticate');

// Apply authentication to all duration routes
router.use(authenticate);

// GET /api/duration/:contentType/:contentId - Get content duration/length
router.get('/:contentType/:contentId', DurationController.getContentDuration);

// POST /api/duration/:contentType/:contentId - Set content duration/length
router.post('/:contentType/:contentId', DurationController.setContentDuration);

module.exports = router;
