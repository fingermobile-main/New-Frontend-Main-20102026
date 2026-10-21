/* eslint-disable no-unused-vars */
const express = require('express');
const leaderboards = require('../controllers/leaderboardsController.js');
const router = express.Router();

// Cross-Engine Ecosystem Matrix & Engines
router.get('/ecosystem-matrix', leaderboards.getEcosystemMatrix);
router.get('/engine/:engine', leaderboards.getEngineLeaderboard);

// Actions & Two-Way Sync
router.post('/recalculate', leaderboards.recalculate);
router.post('/reward-distribution', leaderboards.distributeRewards);
router.post('/sync-discover', leaderboards.syncFromDiscover);

// Leaderboard CRUD
router.get('/', leaderboards.getAll);
router.post('/', leaderboards.create);

// Leaderboard Entry CRUD
router.post('/entry', leaderboards.createEntry);
router.put('/entry/:id', leaderboards.updateEntry);
router.delete('/entry/:id', leaderboards.deleteEntry);

// Single Leaderboard Details
router.get('/:id', leaderboards.getById);

module.exports = router;
