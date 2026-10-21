/**
 * franchisesRoutes.js
 * Express routes for Franchise Management
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/franchisesController');

router.get('/metrics/overview', controller.getOverview);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.post('/:id/locations', controller.addLocation);

module.exports = router;
