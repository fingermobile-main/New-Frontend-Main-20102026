const express = require('express');
const authRoutes = require('./auth');
// TODO: Add other routes here as needed
// const metricsRoutes = require('./metrics');
// const alertsRoutes = require('./alerts');

const router = express.Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Monitoring API is running', timestamp: new Date().toISOString() });
});

module.exports = router;