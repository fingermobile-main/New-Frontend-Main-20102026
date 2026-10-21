/* eslint-disable no-unused-vars */
const express = require('express');
const generalendpoints = require('../controllers/generalEndpointsController.js');
const { authenticate } = require('../middleware/authenticate');
const { identityDb } = require('../db'); // Using identityDb for user-related operations
const router = express.Router();

router.post('/ai/assist', authenticate, generalendpoints.create);
router.post('/ai/generate-code', authenticate, generalendpoints.create);
router.post('/posts/:id/like', authenticate, generalendpoints.create);
router.post('/posts/:id/vote', authenticate, generalendpoints.create);
router.post('/posts/:id/tokenize', authenticate, generalendpoints.create);
router.post('/gifts/send', authenticate, generalendpoints.create);
router.post('/paylinks/create', authenticate, generalendpoints.create);
router.get('/analytics/engagement-metrics', authenticate, generalendpoints.getAll);
router.get('/analytics/revenue', authenticate, generalendpoints.getAll);
router.get('/analytics/traffic', authenticate, generalendpoints.getAll);

module.exports = router;
