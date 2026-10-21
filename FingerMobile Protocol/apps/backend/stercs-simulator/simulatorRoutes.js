const express = require('express');
const router = express.Router();
const simulatorEngine = require('./simulatorEngine');
const logger = require('../utils/logger');

// POST /api/stercs-simulator/run
// Normally this would be protected by admin auth middleware
router.post('/run', async (req, res) => {
  try {
    const payload = req.body;

    if (!payload || !payload.attack_vector) {
      return res.status(400).json({ error: 'Missing attack_vector in payload' });
    }

    const report = await simulatorEngine.runSimulation(payload);

    return res.status(200).json(report);
  } catch (error) {
    logger.error('Error running simulator:', error);
    return res.status(500).json({ error: 'Internal Server Error during simulation' });
  }
});

module.exports = router;
