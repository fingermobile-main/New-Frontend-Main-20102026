const express = require('express');
const logger = require('../utils/logger');
const { register } = require('../middleware/metricsMiddleware');
const router = express.Router();

/**
 * GET /metrics
 * Prometheus metrics endpoint
 */
router.get('/', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    logger.error('Error generating metrics:', error);
    res.status(500).end('Error generating metrics');
  }
});

/**
 * GET /health
 * Health check endpoint for load balancer
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

module.exports = router;
