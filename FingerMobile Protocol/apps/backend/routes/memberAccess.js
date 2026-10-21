'use strict';

const express = require('express');
const router = express.Router();
const memberAccessController = require('../controllers/memberAccessController');

// GET /api/v1/member-access/overview
router.get('/overview', (req, res) => memberAccessController.getOverview(req, res));

// GET /api/v1/member-access/roles
router.get('/roles', (req, res) => memberAccessController.getRoles(req, res));

// POST /api/v1/member-access/roles
router.post('/roles', (req, res) => memberAccessController.createRole(req, res));

// PUT /api/v1/member-access/roles/:id
router.put('/roles/:id', (req, res) => memberAccessController.updateRole(req, res));

// DELETE /api/v1/member-access/roles/:id
router.delete('/roles/:id', (req, res) => memberAccessController.deleteRole(req, res));

// GET /api/v1/member-access/pages
router.get('/pages', (req, res) => memberAccessController.getPages(req, res));

// PUT /api/v1/member-access/pages/:pageId/permissions
router.put('/pages/:pageId/permissions', (req, res) => memberAccessController.updatePagePermissions(req, res));

module.exports = router;
