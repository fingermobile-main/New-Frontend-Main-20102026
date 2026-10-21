/* eslint-disable no-unused-vars */
const express = require('express');
const integrationsModule = require('../controllers/integrations-moduleController.js');
const { contentDb } = require('../db');
const router = express.Router();

router.get('/', integrationsModule.getAll);
router.get('/:integrationId', integrationsModule.getById);
router.post('/', integrationsModule.create);
router.put('/:integrationId', integrationsModule.update);
router.delete('/:integrationId', integrationsModule.delete);
router.get('/user/:userId', integrationsModule.getById);
router.patch('/:integrationId/toggle', integrationsModule.handle);
router.post('/:integrationId/test', integrationsModule.create);

module.exports = router;
