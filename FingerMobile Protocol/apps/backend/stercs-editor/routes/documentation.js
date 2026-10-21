const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const DocumentationService = require('../services/documentationService');

// Apply admin authentication to all documentation routes
router.use(requireAdmin);

// Get documentation by type
router.get('/:docType', async (req, res) => {
  try {
    const { docType } = req.params;
    const { docId } = req.query;

    const result = await DocumentationService.getDocumentation(docType, docId);

    res.status(200).json({success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    logger.error('Error getting, documentation:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve documentation',
      error: error.message
    });
  }
});

// Search documentation
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const result = await DocumentationService.searchDocumentation(query);

    res.status(200).json({success: true,
      message: result.message,
      data: result.results
    });
  } catch (error) {
    logger.error('Error searching, documentation:', error);
    res.status(500).json({success: false,
      message: 'Failed to search documentation',
      error: error.message
    });
  }
});

// Get quick start guide
router.get('/quick-start', async (req, res) => {
  try {
    const result = await DocumentationService.getQuickStartGuide();

    res.status(200).json({success: true,
      message: result.message,
      data: result.guide
    });
  } catch (error) {
    logger.error('Error getting quick start, guide:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve quick start guide',
      error: error.message
    });
  }
});

// Get component reference
router.get('/components/reference', async (req, res) => {
  try {
    const result = await DocumentationService.getComponentReference();

    res.status(200).json({success: true,
      message: result.message,
      data: result.reference
    });
  } catch (error) {
    logger.error('Error getting component, reference:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve component reference',
      error: error.message
    });
  }
});

module.exports = router;
