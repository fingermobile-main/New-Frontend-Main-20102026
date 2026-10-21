const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const IntegrationService = require('../services/integrationService');

// Apply admin authentication to all integration routes
router.use(requireAdmin);

// Create a new integration
router.post('/', async (req, res) => {
  try {
    const memberId = req.member.id;
    const integrationData = req.body;

    if (!integrationData.name || !integrationData.type) {
      return res.status(400).json({success: false,
        message: 'Integration name and type are required'
      });
    }

    const result = await IntegrationService.createIntegration(
      memberId,
      integrationData,
    );

    res.status(201).json({success: true,
      message: result.message,
      data: result.integration
    });
  } catch (error) {
    logger.error('Error creating, integration:', error);
    res.status(500).json({success: false,
      message: 'Failed to create integration',
      error: error.message
    });
  }
});

// Get integrations for a member
router.get('/', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { type, enabled, search, tag, limit } = req.query;

    const result = await IntegrationService.getIntegrations(memberId, {type: type || null,
      enabled: enabled !== undefined ? enabled === 'true' : undefined,
      search: search || null,
      tag: tag || null,
      limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
      message: result.message,
      data: result.integrations
    });
  } catch (error) {
    logger.error('Error getting, integrations:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve integrations',
      error: error.message
    });
  }
});

// Get integration by ID
router.get('/:integrationId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { integrationId } = req.params;

    const result = await IntegrationService.getIntegrationById(
      memberId,
      parseInt(integrationId),
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.integration
    });
  } catch (error) {
    logger.error('Error getting, integration:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve integration',
      error: error.message
    });
  }
});

// Update an integration
router.put('/:integrationId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { integrationId } = req.params;
    const integrationData = req.body;

    const result = await IntegrationService.updateIntegration(
      memberId,
      parseInt(integrationId),
      integrationData,
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.integration
    });
  } catch (error) {
    logger.error('Error updating, integration:', error);
    res.status(500).json({success: false,
      message: 'Failed to update integration',
      error: error.message
    });
  }
});

// Delete an integration
router.delete('/:integrationId', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { integrationId } = req.params;

    const result = await IntegrationService.deleteIntegration(
      memberId,
      parseInt(integrationId),
    );

    res.status(200).json({success: true,
      message: result.message
    });
  } catch (error) {
    logger.error('Error deleting, integration:', error);
    res.status(500).json({success: false,
      message: 'Failed to delete integration',
      error: error.message
    });
  }
});

// Test an integration
router.post('/:integrationId/test', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { integrationId } = req.params;

    const result = await IntegrationService.testIntegration(
      memberId,
      parseInt(integrationId),
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.result
    });
  } catch (error) {
    logger.error('Error testing, integration:', error);
    res.status(500).json({success: false,
      message: 'Failed to test integration',
      error: error.message
    });
  }
});

// Get integration statistics
router.get('/:integrationId/stats', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { integrationId } = req.params;

    const result = await IntegrationService.getIntegrationStats(
      memberId,
      parseInt(integrationId),
    );

    res.status(200).json({success: true,
      message: result.message,
      data: result.stats
    });
  } catch (error) {
    logger.error('Error getting integration, stats:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve integration stats',
      error: error.message
    });
  }
});

module.exports = router;
