/* eslint-disable no-unused-vars */
const express = require('express');
const seads = require('../controllers/seadsController.js');
const { authenticate } = require('../middleware/authenticate');
const { monetizationDb } = require('../db');
const router = express.Router();

router.get('/', (req, res) => seads.getProjects(req, res));
router.post('/', (req, res) => seads.createProject(req, res));
router.post('/:id/back', (req, res) => seads.backProject(req, res));
router.get('/projects', (req, res) => seads.getProjects(req, res));
router.get('/projects/:projectId', (req, res) => seads.getById(req, res));
router.post('/projects', (req, res) => seads.createProject(req, res));
router.post('/projects/:id/back', (req, res) => seads.backProject(req, res));
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
