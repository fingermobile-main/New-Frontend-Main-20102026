/* eslint-disable no-unused-vars */
const express = require('express');
const items = require('../controllers/itemsController.js');
const { authenticate } = require('../middleware/authenticate');
const { identityDb } = require('../db');
const router = express.Router();

router.get('/', authenticate, items.getAll);
router.get('/:id', authenticate, items.getById);
router.post('/', authenticate, items.create);
router.put('/:id', authenticate, items.update);
router.delete('/:id', authenticate, items.delete);
router.post('/:id/flag', authenticate, items.create);

module.exports = router;
