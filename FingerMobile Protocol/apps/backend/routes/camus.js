const express = require('express');
const router = express.Router();
const camusRoutes = require('./camusRoutes');

// Delegate all /api/camus routes to the comprehensive Camus Academic Course Engine
router.use('/', camusRoutes);

module.exports = router;
