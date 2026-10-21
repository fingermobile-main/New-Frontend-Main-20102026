const express = require('express');
const router = express.Router();
const WidgetsController = require('../controllers/WidgetsController');

// 1. Live Rails & Rotational Engine (Public/Community accessible)
router.get('/rail', (req, res) => WidgetsController.getRailWidgets(req, res));
router.post('/rotate', (req, res) => WidgetsController.triggerRotation(req, res));

// 2. Global Telemetry & Summary
router.get('/analytics/summary', (req, res) => WidgetsController.getAnalyticsSummary(req, res));

// 3. Interaction Telemetry (Public)
router.post('/:id/click', (req, res) => WidgetsController.recordClick(req, res));
router.post('/:id/impression', (req, res) => WidgetsController.recordImpression(req, res));
router.post('/:id/feedback', (req, res) => WidgetsController.recordFeedback(req, res));

// 4. Widget Database Table CRUD
router.get('/', (req, res) => WidgetsController.getAllWidgets(req, res));
router.post('/', (req, res) => WidgetsController.createWidget(req, res));
router.put('/:id', (req, res) => WidgetsController.updateWidget(req, res));
router.delete('/:id', (req, res) => WidgetsController.deleteWidget(req, res));

// 5. Types & Cache Invalidation
router.get('/types', (req, res) => WidgetsController.listWidgetTypes(req, res));
router.post('/batch', (req, res) => WidgetsController.getBatchWidgets(req, res));
router.post('/invalidate-cache', (req, res) => WidgetsController.invalidateCache(req, res));

// 6. Legacy / Single Type Lookup
router.get('/:type', (req, res) => WidgetsController.getWidget(req, res));

module.exports = router;
