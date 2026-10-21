const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const { requireUGCPermission } = require('../middleware/ugcPrivacyMiddleware');
const TagController = require('../controllers/TagController');

// POST /api/ugc/:contentType/:contentId/tag - Tag user in content
router.post('/:contentType/:contentId/tag', authenticate, requireUGCPermission('tag'), TagController.tagUserInContent);

// GET /api/ugc/:contentType/:contentId/tags - Get content tags
router.get('/:contentType/:contentId/tags', authenticate, requireUGCPermission('view'), TagController.getContentTags);

// GET /api/tags/user/:userId - Get user's tags
router.get('/tags/user/:userId', authenticate, TagController.getUserTags);

// DELETE /api/ugc/:contentType/:contentId/tag/:taggedUserId - Remove tag
router.delete('/:contentType/:contentId/tag/:taggedUserId', authenticate, TagController.removeTag);

// PUT /api/ugc/:contentType/:contentId/tag/:taggedUserId/approve - Approve tag
router.put('/:contentType/:contentId/tag/:taggedUserId/approve', authenticate, TagController.approveTag);

module.exports = router;

