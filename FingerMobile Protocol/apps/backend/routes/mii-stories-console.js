/**
 * Mii Ephemeral 48h Stories Console Route Definitions
 * FingerMobile Protocol™ Production Control Plane
 * Phase 10: 48h TTL Lifecycle, 6-Digit PIN Handshake, Direct Multipart Ingestion & DefCon Vanish
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/miiStoriesConsoleController');

// 1. Overview & Health
router.get('/overview', controller.getOverview);

// 2. Stories Items CRUD
router.get('/items', controller.getItems);
router.get('/items/:id', controller.getItemById);
router.post('/items', controller.createItem);
router.put('/items/:id', controller.updateItem);
router.delete('/items/:id', controller.deleteItem);

// 3. Reordering
router.post('/reorder', controller.reorderItems);

// 4. Direct Multipart/form-data Media Upload
router.post('/upload', controller.uploadMiddleware, controller.handleUpload);

// 5. DefCon Vanishing Purge Killswitch
router.post('/defcon-purge', controller.defconPurge);

// 6. Console Spawner
router.get('/spawns', controller.getSpawns);
router.post('/spawns', controller.spawnConsole);

module.exports = router;
