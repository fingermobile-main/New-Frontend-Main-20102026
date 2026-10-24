const express = require('express');
const router = express.Router();
const controller = require('../controllers/commsVoipConsoleController');

router.get('/overview', controller.getOverview);
router.get('/items', controller.getItems);
router.get('/items/:id', controller.getItemById);
router.post('/items', controller.createItem);
router.put('/items/:id', controller.updateItem);
router.delete('/items/:id', controller.deleteItem);
router.patch('/items/:id/freeze', controller.toggleFreeze);
router.post('/reorder', controller.reorderItems);

// Direct Multipart/Form-Data Upload (Zero client localStorage fallback)
router.post('/items/:id/upload', controller.uploadMiddleware, controller.uploadAsset);
router.post('/upload', controller.uploadMiddleware, controller.uploadAsset);

// Sub-console spawners
router.get('/spawns', controller.getSpawns);
router.post('/spawns', controller.createSpawn);

module.exports = router;
