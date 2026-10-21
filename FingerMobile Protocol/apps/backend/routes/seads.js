/* eslint-disable no-unused-vars */
const express = require('express');
const seads = require('../controllers/seadsController.js');
const { authenticate } = require('../middleware/authenticate');
const { monetizationDb } = require('../db');
const router = express.Router();

router.get('/projects', seads.getAll);
router.get('/projects/:projectId', seads.getById);
router.post('/projects', authenticate, seads.create);
router.put('/projects/:projectId', seads.update);
router.delete('/projects/:projectId', authenticate, seads.delete);
router.get('/projects/:projectId/updates', seads.getById);
router.post('/projects/:projectId/updates', authenticate, seads.create);
router.get('/projects/:projectId/backers', seads.getById);
router.post('/backings', authenticate, seads.create);
router.get('/members/:memberId/backed-projects', authenticate, seads.getById);
router.post('/projects/:projectId/reviews', authenticate, seads.create);
router.get('/projects/:projectId/reviews', seads.getById);

module.exports = router;
