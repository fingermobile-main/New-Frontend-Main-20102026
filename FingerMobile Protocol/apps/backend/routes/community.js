const express = require('express');
const communityController = require('../controllers/CommunityController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// @route   POST /api/community/rules
// @desc    Create a community rule
// @access  Private (Community Admin/Moderator)
router.post('/rules', authenticate, communityController.createRule);

// @route   GET /api/community/rules/:communityType/:communityId
// @desc    Get community rules
// @access  Public
router.get('/rules/:communityType/:communityId', communityController.getRules);

// @route   PUT /api/community/rules/:id
// @desc    Update a community rule
// @access  Private (Community Admin/Moderator)
router.put('/rules/:id', authenticate, communityController.updateRule);

// @route   DELETE /api/community/rules/:id
// @desc    Delete a community rule
// @access  Private (Community Admin/Moderator)
router.delete('/rules/:id', authenticate, communityController.deleteRule);

// @route   POST /api/community/moderators
// @desc    Assign a moderator to a community
// @access  Private (Community Admin)
router.post('/moderators', authenticate, communityController.assignModerator);

// @route   GET /api/community/moderators/:communityType/:communityId
// @desc    Get community moderators
// @access  Public
router.get('/moderators/:communityType/:communityId', communityController.getModerators);

// @route   DELETE /api/community/moderators/:id
// @desc    Remove a moderator from a community
// @access  Private (Community Admin)
router.delete('/moderators/:id', authenticate, communityController.removeModerator);

// @route   PUT /api/community/members/:communityType/:communityId/:memberId/role
// @desc    Update a member's role in a community
// @access  Private (Community Admin/Moderator)
router.put('/members/:communityType/:communityId/:memberId/role', authenticate, communityController.updateMemberRole);

// @route   GET /api/community/analytics/:communityType/:communityId
// @desc    Get community analytics
// @access  Private (Community Admin/Moderator)
router.get('/analytics/:communityType/:communityId', authenticate, communityController.getAnalytics);

// @route   POST /api/community/analytics/:communityType/:communityId/refresh
// @desc    Refresh community analytics
// @access  Private (Community Admin/Moderator)
router.post('/analytics/:communityType/:communityId/refresh', authenticate, communityController.refreshAnalytics);

module.exports = router;
