/*
 * FingerMobile Protocol™ - Sovereign Module Interactions Routes
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

const express = require('express');
const router = express.Router();
const moduleInteractionsController = require('../controllers/moduleInteractionsController');

// 1. Get Summary Metrics (Comments, Mentions, Connect/Follows, All Comments, Responded, Haven't Responded)
router.get('/summary', moduleInteractionsController.getModuleSummary);

// 2. Get Filtered Interactions List
router.get('/', moduleInteractionsController.getModuleInteractions);

// 3. Respond to an Interaction
router.post('/:id/respond', moduleInteractionsController.respondToInteraction);

// 4. Get Activity Logs (All Time, All Activities, All Criteria)
router.get('/activity-logs', moduleInteractionsController.getModuleActivityLogs);

module.exports = router;
