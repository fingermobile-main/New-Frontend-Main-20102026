const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController.js');
const rawAuth = require('../middleware/auth');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));

/**
 * Community Routes
 * Public routes: GET /, GET /:id
 * Protected routes: POST /, POST /:id/join, DELETE /:id/leave, PUT /:id, DELETE /:id
 */

// Public routes
router.get('/', communityController.getAll.bind(communityController));
router.get('/:id', communityController.getById.bind(communityController));

// Protected routes (require authentication)
router.post('/', authenticate, communityController.create.bind(communityController));
router.post('/:communityId/join', authenticate, communityController.join.bind(communityController));
router.delete('/:communityId/leave', authenticate, communityController.leave.bind(communityController));
router.put('/:id', authenticate, communityController.update.bind(communityController));
router.delete('/:id', authenticate, communityController.delete.bind(communityController));

// Member management
router.get('/:communityId/members', authenticate, communityController.getMembers.bind(communityController));

module.exports = router;
