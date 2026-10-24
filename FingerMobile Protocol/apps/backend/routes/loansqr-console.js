/**
 * LoansQR Micro-Lending Console Route Definitions
 * FingerMobile Protocol™ Production Control Plane
 * Phase 11: Underwriting Matrix, APR Tiers, Collateral Escrow Vaults & Debt Moratorium Holds
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/loansqrConsoleController');

// 1. Overview & Health
router.get('/overview', controller.getOverview);

// 2. Facilities CRUD
router.get('/items', controller.getItems);
router.get('/items/:id', controller.getItemById);
router.post('/items', controller.createItem);
router.put('/items/:id', controller.updateItem);
router.delete('/items/:id', controller.deleteItem);

// 3. Reordering
router.post('/reorder', controller.reorderItems);

// 4. Direct Multipart/form-data Collateral Deed Upload
router.post('/upload', controller.uploadMiddleware, controller.handleUpload);

// 5. DefCon Debt Moratorium Hold Switch
router.post('/defcon-moratorium', controller.toggleMoratoriumHold);

// 6. Console Spawner
router.get('/spawns', controller.getSpawns);
router.post('/spawns', controller.spawnConsole);

module.exports = router;
