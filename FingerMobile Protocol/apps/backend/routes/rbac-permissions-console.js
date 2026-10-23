const express = require('express');
const router = express.Router();
const controller = require('../controllers/rbacPermissionsConsoleController');

// Overview telemetry for Members, RBAC Permissions & Organization Citadel
router.get('/overview', (req, res) => controller.getOverview(req, res));

// Items retrieval by domain or all
router.get('/items', (req, res) => controller.getItems(req, res));
router.get('/items/:id', (req, res) => controller.getItemById(req, res));
router.post('/items', (req, res) => controller.createItem(req, res));
router.put('/items/:id', (req, res) => controller.updateItem(req, res));
router.delete('/items/:id', (req, res) => controller.deleteItem(req, res));

// Freeze / Unfreeze killswitch
router.patch('/items/:id/freeze', (req, res) => controller.toggleFreeze(req, res));
router.post('/items/:id/toggle-freeze', (req, res) => controller.toggleFreeze(req, res));

// Atomic reordering
router.post('/reorder', (req, res) => controller.reorderItems(req, res));

// Multipart file upload for credential certs, CAC documents, council charters
router.post('/upload', controller.uploadMedia);

// Console Spawner registry
router.get('/spawns', (req, res) => controller.getSpawnedConsoles(req, res));
router.get('/spawned-consoles', (req, res) => controller.getSpawnedConsoles(req, res));
router.post('/spawns', (req, res) => controller.spawnConsole(req, res));
router.post('/spawn-console', (req, res) => controller.spawnConsole(req, res));

module.exports = router;
