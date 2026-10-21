/* eslint-disable no-unused-vars */
const express = require('express');
const permanenceData = require('../controllers/permanence-dataController.js');
const { authenticate } = require('../middleware/authenticate');
const db = require('../db');
const router = express.Router();

router.get('/data', authenticate, (req, res) => res.json({ success: true, data: [] }));
router.put('/settings', authenticate, permanenceData.update);

module.exports = router;
