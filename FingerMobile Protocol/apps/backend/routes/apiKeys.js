/* eslint-disable no-unused-vars */
const express = require('express');
const apikeys = require('../controllers/apiKeysController.js');
const { authenticate } = require('../middleware/authenticate');
const apiKeyService = require('../services/apiKeyService');
const router = express.Router();

router.post('/', authenticate, apikeys.create);
router.get('/:apiKeyId', authenticate, apikeys.getAll); // stub fallback
router.get('/', authenticate, apikeys.getAll);
router.delete('/:apiKeyId', authenticate, apikeys.delete);
router.put('/:apiKeyId/rotate', authenticate, apikeys.rotateKey);
router.post('/verify', apikeys.create); // stub fallback

module.exports = router;
