const express = require('express');
const router = express.Router();
const controller = require('../controllers/metricsController');
const { register } = require('../middleware/metricsMiddleware');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));

// Standard Prometheus scrap endpoint (both / and /metrics)
const prometheusHandler = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message || 'Error generating metrics');
  }
};

router.get('/', prometheusHandler);
router.get('/metrics', prometheusHandler);
router.get('/platform', authenticate, controller.getPlatformInsights);
router.get('/user', authenticate, controller.getUserAnalytics);

module.exports = router;
