/* eslint-disable no-unused-vars */
const express = require('express');
const dashboard = require('../controllers/dashboardController.js');
const { authenticate } = require('../middleware/authenticate');
const { identityDb, socialDb, contentDb } = require('../db');
const router = express.Router();

router.get('/', authenticate, dashboard.getDashboard);
router.get('/metrics', authenticate, dashboard.getDashboard); // stub
router.get('/activities', authenticate, dashboard.getDashboard); // stub

module.exports = router;
