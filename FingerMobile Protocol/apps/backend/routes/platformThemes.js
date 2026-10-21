const express = require('express');
const router = express.Router();
const controller = require('../controllers/platformThemesController');
const { authenticate, requireAdmin } = require('../middleware/authenticate');

// Public endpoint to fetch active theme
router.get('/active', controller.getActiveTheme);

// Admin endpoints
router.get('/', authenticate, requireAdmin, controller.getThemes);
router.post('/', authenticate, requireAdmin, controller.createTheme);
router.put('/:id', authenticate, requireAdmin, controller.updateTheme);
router.delete('/:id', authenticate, requireAdmin, controller.deleteTheme);

module.exports = router;
