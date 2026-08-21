const express = require('express');
const router = express.Router();
const CommunityController = require('../controllers/CommunityController');
const { authenticate } = require('../middleware/auth');

/**
 * Community Routes
 * Public routes: GET /, GET /:id
 * Protected routes: POST /, POST /:id/join, DELETE /:id/leave, PUT /:id, DELETE /:id
 */

// Public routes
router.get('/', CommunityController.getAll.bind(CommunityController));
router.get('/:id', CommunityController.getById.bind(CommunityController));

// Protected routes (require authentication)
router.post('/', authenticate, CommunityController.create.bind(CommunityController));
router.post('/:communityId/join', authenticate, CommunityController.join.bind(CommunityController));
router.delete('/:communityId/leave', authenticate, CommunityController.leave.bind(CommunityController));
router.put('/:id', authenticate, CommunityController.update.bind(CommunityController));
router.delete('/:id', authenticate, CommunityController.delete.bind(CommunityController));

// Member management
router.get('/:communityId/members', authenticate, CommunityController.getMembers.bind(CommunityController));

module.exports = router;
