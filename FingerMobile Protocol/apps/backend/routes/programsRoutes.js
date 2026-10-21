/**
 * programsRoutes.js
 * Express routes for Programs & Courses
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/programsController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.post('/:id/enroll', controller.enroll);

module.exports = router;
