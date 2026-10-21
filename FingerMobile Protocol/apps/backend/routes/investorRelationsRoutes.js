/**
 * investorRelationsRoutes.js
 * Express routes for Investor Relations
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/investorRelationsController');

router.get('/overview', controller.getOverview);
router.get('/reports', controller.getReports);
router.post('/reports', controller.createReport);
router.get('/governance', controller.getGovernance);

module.exports = router;
