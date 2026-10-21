const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const ThemeService = require('../services/themeService');

// Apply admin authentication to all theme routes
router.use(requireAdmin);

// Get available themes
router.get('/available', async (req, res) => {
  try {
    const themes = await ThemeService.getAvailableThemes();
    res
      .status(200)
      .json({message: 'Themes retrieved successfully',
        data: themes });
  } catch (error) {
    logger.error('Theme retrieval, error:', error);
    res
      .status(500)
      .json({message: 'Failed to retrieve themes',
        error: error.message });
  }
});

// Get member's current theme
router.get('/current', async (req, res) => {
  try {
    const memberId = req.member.id;
    const theme = await ThemeService.getMemberTheme(memberId);
    res.status(200).json({message: 'Theme retrieved successfully',
      data: {
        themeId: theme }
    });
  } catch (error) {
    logger.error('Theme retrieval, error:', error);
    res
      .status(500)
      .json({message: 'Failed to retrieve theme',
        error: error.message });
  }
});

// Set member's theme
router.post('/set', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { themeId } = req.body;

    if (!themeId) {
      return res.status(400).json({message: 'Theme ID is required' });
    }

    const result = await ThemeService.setMemberTheme(memberId, themeId);
    res.status(200).json({message: 'Theme set successfully',
      data: result });
  } catch (error) {
    logger.error('Theme setting, error:', error);
    res
      .status(500)
      .json({message: 'Failed to set theme',
        error: error.message });
  }
});

// Create custom theme
router.post('/custom', async (req, res) => {
  try {
    const memberId = req.member.id;
    const { name, properties } = req.body;

    if (!name || !properties) {
      return res
        .status(400)
        .json({message: 'Name and properties are required' });
    }

    const result = await ThemeService.createCustomTheme(memberId, {
      name,
      properties
    });
    res
      .status(201)
      .json({message: 'Custom theme created successfully',
        data: result });
  } catch (error) {
    logger.error('Theme creation, error:', error);
    res
      .status(500)
      .json({message: 'Failed to create theme',
        error: error.message });
  }
});

// Get member's custom themes
router.get('/custom', async (req, res) => {
  try {
    const memberId = req.member.id;
    const themes = await ThemeService.getMemberCustomThemes(memberId);
    res
      .status(200)
      .json({message: 'Custom themes retrieved successfully',
        data: themes });
  } catch (error) {
    logger.error('Theme retrieval, error:', error);
    res
      .status(500)
      .json({message: 'Failed to retrieve themes',
        error: error.message });
  }
});

// Get global/public themes
router.get('/global', async (req, res) => {
  try {
    const memberId = req.member.id;
    const themes = await ThemeService.getGlobalThemes(memberId);
    res
      .status(200)
      .json({message: 'Global themes retrieved successfully',
        data: themes });
  } catch (error) {
    logger.error('Theme retrieval, error:', error);
    res.status(500).json({message: 'Failed to retrieve global themes',
      error: error.message
    });
  }
});

module.exports = router;
