'use strict';

const express = require('express');
const router = express.Router();
const collaboratorController = require('../controllers/collaboratorController');

// GET /api/v1/collaborators or /api/collaborators
router.get('/', (req, res) => collaboratorController.getCollaborators(req, res));

// POST /api/v1/collaborators/invite
router.post('/invite', (req, res) => collaboratorController.inviteCollaborator(req, res));

// PATCH /api/v1/collaborators/:id/roles
router.patch('/:id/roles', (req, res) => collaboratorController.updateRoles(req, res));

// PATCH /api/v1/collaborators/:id/locations
router.patch('/:id/locations', (req, res) => collaboratorController.updateLocations(req, res));

// DELETE /api/v1/collaborators/:id
router.delete('/:id', (req, res) => collaboratorController.removeCollaborator(req, res));

// POST /api/v1/collaborators/seats/upgrade
router.post('/seats/upgrade', (req, res) => collaboratorController.upgradeSeatPlan(req, res));

module.exports = router;
