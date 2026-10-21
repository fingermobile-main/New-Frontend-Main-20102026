const express = require('express');
const router = express.Router();
const aiRoutes = require('./ai');

// Delegate all AI proxy requests directly to the AI routes handler
router.use('/', aiRoutes);

module.exports = router;
