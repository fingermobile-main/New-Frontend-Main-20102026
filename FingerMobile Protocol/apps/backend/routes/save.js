const express = require('express');
const router = express.Router();
const SaveController = require('../controllers/SaveController');
const authenticate = require('../middleware/authenticate');

// Apply authentication to all save routes
router.use(authenticate);

// POST /api/save/:contentType/:contentId - Save content
router.post('/:contentType/:contentId', SaveController.saveContent);

// DELETE /api/save/:contentType/:contentId - Unsave content
router.delete('/:contentType/:contentId', SaveController.unsaveContent);

// GET /api/save - Get user's saved content
router.get('/', SaveController.getUserSavedContent);

// GET /api/save/:contentType/:contentId/savers - Get content savers
router.get('/:contentType/:contentId/savers', SaveController.getContentSavers);

module.exports = router;
