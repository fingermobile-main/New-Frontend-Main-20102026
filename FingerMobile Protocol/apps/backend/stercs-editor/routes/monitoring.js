const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const MonitoringService = require('../services/monitoringService');

// Apply admin authentication to all monitoring routes
router.use(requireAdmin);

// Create a new monitoring rule
router.post('/rules', async (req, res) => {
  try {
    const memberId = req.member.id;
    const ruleData = req.body;

    if (
      !ruleData.name ||
      !ruleData.projectId ||
      !ruleData.metricType ||
      !ruleData.condition ||
      ruleData.threshold === undefined
    ) {
      return res.status(400).json({success: false,
        message:
          'Name, Project ID, Metric Type, Condition, and Threshold are required for creating a monitoring rule'
      });
    }

    const result = await MonitoringService.createRule(memberId, ruleData);

    res.status(201).json({success: true,
      message: result.message,
      data: result.rule
    });
  } catch (error) {
    logger.error('Error creating monitoring, rule:', error);
    res.status(500).json({success: false,
      message: 'Failed to create monitoring rule',
      error: error.message
    });
  }
});

// Get monitoring rules for a member
router.get('/rules', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, enabled, search, limit } = req.query;

    const result = await MonitoringService.getRules(memberId, {projectId: projectId ? parseInt(projectId) : null,
      enabled: enabled !== undefined ? enabled === 'true' : undefined,
      search: search || null,
      limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
      message: result.message,
      data: result.rules
    });
  } catch (error) {
    logger.error('Error getting monitoring, rules:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve monitoring rules',
      error: error.message
    });
  }
});

// Get monitoring rule by ID
router.get('/rules/:ruleId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { ruleId } = req.params;

    const result = await MonitoringService.getRuleById(
      memberId,
      parseInt(ruleId),
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.rule
    });
  } catch (error) {
    logger.error('Error getting monitoring, rule:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve monitoring rule',
      error: error.message
    });
  }
});

// Update a monitoring rule
router.put('/rules/:ruleId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { ruleId } = req.params;
    const ruleData = req.body;

    const result = await MonitoringService.updateRule(
      memberId,
      parseInt(ruleId),
      ruleData,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.rule
    });
  } catch (error) {
    logger.error('Error updating monitoring, rule:', error);
    res.status(500).json({success: false,
      message: 'Failed to update monitoring rule',
      error: error.message
    });
  }
});

// Delete a monitoring rule
router.delete('/rules/:ruleId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { ruleId } = req.params;

    const result = await MonitoringService.deleteRule(
      memberId,
      parseInt(ruleId),
    );

    res.status(200).json({success: true,
      message: result.message
    });
  } catch (error) {
    logger.error('Error deleting monitoring, rule:', error);
    res.status(500).json({success: false,
      message: 'Failed to delete monitoring rule',
      error: error.message
    });
  }
});

// Record a metric
router.post('/metrics', async (req, res) => {
  try {
    const memberId = req.member.id;
    const metricData = req.body;

    if (
      !metricData.projectId ||
      !metricData.metricType ||
      metricData.value === undefined
    ) {
      return res.status(400).json({success: false,
        message:
          'Project ID, Metric Type, and Value are required for recording a metric'
      });
    }

    const result = await MonitoringService.recordMetric(memberId, metricData);

    res.status(201).json({success: true,
      message: result.message,
      data: result.metric
    });
  } catch (error) {
    logger.error('Error recording, metric:', error);
    res.status(500).json({success: false,
      message: 'Failed to record metric',
      error: error.message
    });
  }
});

// Get metrics
router.get('/metrics', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, metricType, fromDate, toDate, limit } = req.query;

    const result = await MonitoringService.getMetrics(memberId, {projectId: projectId ? parseInt(projectId) : null,
      metricType: metricType || null,
      fromDate: fromDate || null,
      toDate: toDate || null,
      limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
      message: result.message,
      data: result.metrics
    });
  } catch (error) {
    logger.error('Error getting, metrics:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve metrics',
      error: error.message
    });
  }
});

// Get alerts
router.get('/alerts', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, status, metricType, limit } = req.query;

    const result = await MonitoringService.getAlerts(memberId, {projectId: projectId ? parseInt(projectId) : null,
      status: status || null,
      metricType: metricType || null,
      limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
      message: result.message,
      data: result.alerts
    });
  } catch (error) {
    logger.error('Error getting, alerts:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve alerts',
      error: error.message
    });
  }
});

module.exports = router;
