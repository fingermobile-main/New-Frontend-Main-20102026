/**
 * Trends & Swarms Discovery Console Route Definitions
 * FingerMobile Protocol™ Production Control Plane
 * Phase 12: Virality Decay Sliders, Regional Swarms, Keyword Blacklists & GNN Weight Tuning
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/trendsSwarmConsoleController');

// 1. Overview & Health
router.get('/overview', controller.getOverview);

// 2. Trends & Swarms CRUD
router.get('/items', controller.getItems);
router.get('/items/:id', controller.getItemById);
router.post('/items', controller.createItem);
router.put('/items/:id', controller.updateItem);
router.delete('/items/:id', controller.deleteItem);

// 3. Reordering
router.post('/reorder', controller.reorderItems);

// 4. Direct Multipart Media Upload
router.post('/upload', controller.uploadMiddleware, controller.handleUpload);

// 5. DefCon Virality Clamp & Blacklist Control
router.post('/defcon-clamp', controller.toggleViralityClamp);

// 6. Console Spawner
router.get('/spawns', controller.getSpawns);
router.post('/spawns', controller.spawnConsole);

module.exports = router;
