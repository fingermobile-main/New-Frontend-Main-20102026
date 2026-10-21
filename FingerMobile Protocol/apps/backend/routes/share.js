const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const ShareController = require('../controllers/ShareController');

// Apply authentication to all share routes
router.use(authenticate);

// POST /api/share/:contentType/:contentId - Share content
router.post('/:contentType/:contentId', ShareController.shareContent);

// GET /api/share/:contentType/:contentId - Get content shares
router.get('/:contentType/:contentId', ShareController.getContentShares);

// GET /api/share/history - Get user's shared content
router.get('/history', ShareController.getUserSharedContent);

// GET /api/share/:contentType/:contentId/sharers - Get content sharers
router.get('/:contentType/:contentId/sharers', ShareController.getContentSharers);

module.exports = router;
