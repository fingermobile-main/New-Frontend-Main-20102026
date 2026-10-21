const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const PerformanceService = require('../services/performanceService');

// Apply admin authentication to all performance routes
router.use(requireAdmin);

// Create a new performance configuration
router.post('/configs', async (req, res) => {
  try {
    const memberId = req.member.id;
    const configData = req.body;

    if (!configData.name || !configData.projectId) {
      return res.status(400).json({success: false,
        message: 'Configuration name and project ID are required'
      });
    }

    const result = await PerformanceService.createPerformanceConfig(
      memberId,
      configData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.config
    });
  } catch (error) {
    logger.error('Error creating performance, config:', error);
    res.status(500).json({success: false,
      message: 'Failed to create performance configuration',
      error: error.message
    });
  }
});

// Get performance configurations
router.get('/configs', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.query;

    const result = await PerformanceService.getPerformanceConfigs(
      memberId,
      projectId ? parseInt(projectId) : null,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.configs
    });
  } catch (error) {
    logger.error('Error getting performance, configs:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve performance configurations',
      error: error.message
    });
  }
});

// Update a performance configuration
router.put('/configs/:configId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { configId } = req.params;
    const configData = req.body;

    const result = await PerformanceService.updatePerformanceConfig(
      memberId,
      parseInt(configId),
      configData,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.config
    });
  } catch (error) {
    logger.error('Error updating performance, config:', error);
    res.status(500).json({success: false,
      message: 'Failed to update performance configuration',
      error: error.message
    });
  }
});

// Delete a performance configuration
router.delete('/configs/:configId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { configId } = req.params;

    const result = await PerformanceService.deletePerformanceConfig(
      memberId,
      parseInt(configId),
    );

    res.status(200).json({success: true,
      message: result.message
    });
  } catch (error) {
    logger.error('Error deleting performance, config:', error);
    res.status(500).json({success: false,
      message: 'Failed to delete performance configuration',
      error: error.message
    });
  }
});

// Record a performance metric
router.post('/metrics', async (req, res) => {
  try {
    const memberId = req.member.id;
    const metricData = req.body;

    if (
      !metricData.configId ||
      !metricData.projectId ||
      !metricData.metricType ||
      metricData.value === undefined
    ) {
      return res.status(400).json({success: false,
        message:
          'Configuration ID, Project ID, metric type, and value are required for performance metric'
      });
    }

    const result = await PerformanceService.createPerformanceMetric(
      memberId,
      metricData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.metric
    });
  } catch (error) {
    logger.error('Error creating performance, metric:', error);
    res.status(500).json({success: false,
      message: 'Failed to create performance metric',
      error: error.message
    });
  }
});

// Get performance metrics
router.get('/metrics', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, configId, metricType, startDate, endDate, limit } =
      req.query;

    const result = await PerformanceService.getPerformanceMetrics(memberId, {projectId: projectId ? parseInt(projectId) : null,
      configId: configId ? parseInt(configId) : null,
      metricType: metricType || null,
      startDate: startDate || null,
      endDate: endDate || null,
      limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
      message: result.message,
      data: result.metrics
    });
  } catch (error) {
    logger.error('Error getting performance, metrics:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve performance metrics',
      error: error.message
    });
  }
});

// Get performance summary
router.get('/projects/:projectId/summary', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId } = req.params;

    const result = await PerformanceService.getPerformanceSummary(
      memberId,
      parseInt(projectId),
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.summary
    });
  } catch (error) {
    logger.error('Error getting performance, summary:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve performance summary',
      error: error.message
    });
  }
});

module.exports = router;
