const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const TestingService = require('../services/testingService');

// Apply admin authentication to all testing routes
router.use(requireAdmin);

// Create a new test configuration
router.post('/configs', async (req, res) => {
  try {
    const memberId = req.member.id;
    const configData = req.body;

    if (
      !configData.name ||
      !configData.projectId ||
      !configData.testType ||
      !configData.testFramework
    ) {
      return res.status(400).json({success: false,
        message:
          'Configuration name, project ID, test type, and test framework are required'
      });
    }

    const result = await TestingService.createTestConfig(memberId, configData);

    res.status(201).json({success: true,
      message: result.message,
      data: result.config
    });
  } catch (error) {
    logger.error('Error creating test, config:', error);
    res.status(500).json({success: false,
      message: 'Failed to create test configuration', error: error.message });
  }
});

// Get test configurations
router.get('/configs', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { projectId, testType, testFramework, limit } = req.query;
    const result = await TestingService.getTestConfigs(memberId, { projectId: projectId ? parseInt(projectId) : null, testType: testType || null, testFramework: testFramework || null, limit: limit ? parseInt(limit) : null });
    res.status(200).json({ success: true, message: result.message, data: result.configs });
  } catch (error) {
    logger.error('Error getting test configs:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve test configurations', error: error.message });
  }
});

// Update a test configuration
router.put('/configs/:configId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { configId } = req.params;
    const configData = req.body;

    const result = await TestingService.updateTestConfig(
      memberId,
      parseInt(configId),
      configData,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.config
    });
  } catch (error) {
    logger.error('Error updating test, config:', error);
    res.status(500).json({success: false,
      message: 'Failed to update test configuration', error: error.message });
  }
});

// Delete a test configuration
router.delete('/configs/:configId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { configId } = req.params;
    const result = await TestingService.deleteTestConfig(memberId, parseInt(configId));
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    logger.error('Error deleting test config:', error);
    res.status(500).json({ success: false, message: 'Failed to delete test configuration', error: error.message });
  }
});

// Create a new test run
router.post('/runs', async (req, res) => {
  try {
    const memberId = req.member.id;
    const testRunData = req.body;

    if (!testRunData.configId || !testRunData.projectId) {
      return res.status(400).json({success: false,
        message: 'Configuration ID and Project ID are required for test run'
      });
    }

    const result = await TestingService.createTestRun(memberId, testRunData);

    // In a real implementation, we would start the actual test run here
    // For now, we'll simulate it in the background
    setTimeout(async () => {
      try {
        await TestingService.executeTestRun(result.testRun.id);
      } catch (error) {
        logger.error('Error executing test, run:', error);
        // Update test run status to failed
        await TestingService.updateTestRunStatus(
          memberId,
          'failed',
          { error: error.message }
        );
      }
    }, 1000); // Start test run after 1 second

    res.status(201).json({success: true,
      message: result.message,
      data: result.testRun
    });
  } catch (error) {
    logger.error('Error creating test, run:', error);
    res.status(500).json({success: false,
      message: 'Failed to create test run', error: error.message });
  }
});

// Get test runs
router.get('/runs', async (req, res) => { try { const memberId = req.member.id; const { projectId, status, testType, limit } = req.query; const result = await TestingService.getTestRuns(memberId, {projectId: projectId ? parseInt(projectId) : null, status: status || null, testType: testType || null, limit: limit ? parseInt(limit) : null }); res.status(200).json({success: true, message: result.message, data: result.testRuns }); } catch (error) {
  logger.error('Error getting test runs:', error);
  res.status(500).json({ success: false, message: 'Failed to retrieve test runs', error: error.message });
}
});

// Update test run status (for testing purposes)
router.put('/runs/:testRunId/status', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { testRunId } = req.params;
    const { status, results } = req.body;

    if (!status) {
      return res.status(400).json({success: false,
        message: 'Status is required'
      });
    }

    const result = await TestingService.updateTestRunStatus(
      memberId,
      parseInt(testRunId),
      status,
      results,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.testRun
    });
  } catch (error) {
    logger.error('Error updating test run, status:', error);
    res.status(500).json({success: false,
      message: 'Failed to update test run status', error: error.message
    });
  }
});

module.exports = router;
