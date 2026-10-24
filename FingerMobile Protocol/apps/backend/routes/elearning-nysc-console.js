const express = require('express');
const router = express.Router();
const controller = require('../controllers/elearningNyscConsoleController');

// Overview telemetry for E-Learning & NYSC EduTech
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

// Multipart file upload for course syllabi, accreditation certificates, media
router.post('/upload', controller.uploadMiddleware, (req, res) => controller.uploadMedia(req, res));

// Console Spawner registry
router.get('/spawns', (req, res) => controller.getSpawns(req, res));
router.get('/spawned-consoles', (req, res) => controller.getSpawns(req, res));
router.post('/spawns', (req, res) => controller.createSpawn(req, res));
router.post('/spawn-console', (req, res) => controller.createSpawn(req, res));

module.exports = router;
