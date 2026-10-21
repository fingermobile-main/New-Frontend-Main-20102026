'use strict';

const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');

// GET /api/v1/badges or /api/badges
router.get('/', (req, res) => badgeController.getBadges(req, res));

// POST /api/v1/badges
router.post('/', (req, res) => badgeController.createBadge(req, res));

// GET /api/v1/badges/:id
router.get('/:id', (req, res) => badgeController.getBadgeById(req, res));

// PUT /api/v1/badges/:id
router.put('/:id', (req, res) => badgeController.updateBadge(req, res));

// DELETE /api/v1/badges/:id
router.delete('/:id', (req, res) => badgeController.deleteBadge(req, res));

// POST /api/v1/badges/:id/assign
router.post('/:id/assign', (req, res) => badgeController.assignBadge(req, res));

// POST /api/v1/badges/:id/unassign
router.post('/:id/unassign', (req, res) => badgeController.unassignBadge(req, res));

// GET /api/v1/badges/:id/members
router.get('/:id/members', (req, res) => badgeController.getMembers(req, res));

// PATCH /api/v1/badges/:id/members/:memberId/mute
router.patch('/:id/members/:memberId/mute', (req, res) => badgeController.toggleMute(req, res));

module.exports = router;
