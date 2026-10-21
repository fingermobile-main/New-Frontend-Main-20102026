const express = require('express');
const router = express.Router();
const brandingRotationService = require('../services/brandingRotationService');
const logger = require('../config/logger');

/**
 * GET /api/v1/branding/active
 * GET /api/branding/active
 * Returns current active branding assets for Login, Forgot Password, Onboarding, Register, Splash
 */
router.get('/active', async (req, res) => {
  try {
    const assets = await brandingRotationService.getActiveBranding();
    res.json({
      success: true,
      data: assets,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in /branding/active:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active branding assets'
    });
  }
});

/**
 * GET /api/v1/branding/all
 * Lists all registered branding assets (admin/audit view)
 */
router.get('/all', async (req, res) => {
  try {
    const assets = await brandingRotationService.getAllAssets();
    res.json({
      success: true,
      data: assets
    });
  } catch (error) {
    logger.error('Error in /branding/all:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve branding assets'
    });
  }
});

/**
 * POST /api/v1/branding/rotate
 * Trigger a 48-hour rotation evaluation cycle
 */
router.post('/rotate', async (req, res) => {
  try {
    await brandingRotationService.runRotationCycle();
    const assets = await brandingRotationService.getActiveBranding();
    res.json({
      success: true,
      message: '48-hour branding rotation cycle evaluated successfully',
      data: assets
    });
  } catch (error) {
    logger.error('Error in /branding/rotate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run branding rotation cycle'
    });
  }
});

/**
 * POST /api/v1/branding/consent
 * Creator permits or declines usage of trending image for 48-hour rotation
 */
router.post('/consent', async (req, res) => {
  try {
    const { assetId, granted, ownerId } = req.body;
    if (!assetId || typeof granted !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'assetId and boolean granted status are required'
      });
    }

    const result = await brandingRotationService.submitConsent(assetId, granted, ownerId);
    res.json(result);
  } catch (error) {
    logger.error('Error in /branding/consent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit branding consent'
    });
  }
});

module.exports = router;
