/* eslint-disable no-unused-vars */
const express = require('express');
const tms = require('../controllers/tmsController.js');
const { contentDb } = require('../db');
const router = express.Router();

router.get('/', tms.getAll);
router.get('/:entryId', tms.getById);
router.post('/', tms.create);
router.put('/:entryId', tms.update);
router.delete('/:entryId', tms.delete);

module.exports = router;
