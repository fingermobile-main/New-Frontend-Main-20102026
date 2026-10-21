'use strict';

const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// GET /api/v1/roles or /api/roles
router.get('/', (req, res) => roleController.getRoles(req, res));

// GET /api/v1/roles/permissions
router.get('/permissions', (req, res) => roleController.getPermissions(req, res));

// POST /api/v1/roles
router.post('/', (req, res) => roleController.createRole(req, res));

// GET /api/v1/roles/:id
router.get('/:id', (req, res) => roleController.getRoleById(req, res));

// PUT /api/v1/roles/:id
router.put('/:id', (req, res) => roleController.updateRole(req, res));

// DELETE /api/v1/roles/:id
router.delete('/:id', (req, res) => roleController.deleteRole(req, res));

module.exports = router;
