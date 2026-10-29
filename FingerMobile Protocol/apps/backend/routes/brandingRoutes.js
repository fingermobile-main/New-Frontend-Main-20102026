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
 * GET /api/v1/branding/fic-provenance
 * GET /api/branding/fic-provenance
 * Cryptographic provenance, SHA-256 verification & AI/ML tags for FingerMobile Infinite Coin Lion Medallion
 */
router.get('/fic-provenance', (req, res) => {
  res.json({
    success: true,
    data: {
      assetName: 'FingerMobile Infinite Coin Lion Medallion',
      authority: 'FingerMobile Protocol Communication™©®',
      creator: 'Mbah Israel Obinna',
      integrity: {
        algorithm: 'SHA-256',
        dimensionsPx: [1254, 1254],
        format: 'RGBA Lossless Master + WebP Delivery',
        masterPngSha256: '8cde84afbdbd1e20e0394bbb2a418a39513fe68e245bf68267a5506c819611e3',
        webWebpSha256: '8599633da0d4fe12ed5bd12d20969626dbd15a895e2d44d2735b2dc7cdabd55c',
        thumbnail512Sha256: 'd133f69c18fd33a23930dc0fbd6edc151857a150d3bf8ff307c840b8d2e902c7'
      },
      uris: {
        masterPng: '/assets/fic/01_master_transparent.png',
        webWebp: '/assets/fic/02_web_transparent.webp',
        thumbnail512: '/assets/fic/03_thumbnail_512.png',
        previewDark: '/assets/fic/04_preview_dark.jpg',
        nftTemplate: '/assets/fic/06_nft_metadata_TEMPLATE.json'
      },
      visualClassification: {
        motifs: ['Dual Lions', 'Electronic Circuit Traces', 'Electric Blue Eyes', 'Embossed High-Relief Rim'],
        palette: ['Amber Gold', 'Electric Blue', 'Reflective Metallic'],
        aiTags: [
          'gold medallion',
          'coin artwork',
          'two lions',
          'lion heads',
          'blue eyes',
          'circuit board',
          'electronic traces',
          'metallic relief',
          'amber gold',
          'FingerMobile Protocol',
          'sovereign token',
          'emblem',
          'transparent background'
        ]
      },
      provenanceStatus: 'VERIFIED_SOVEREIGN_AUTHENTIC',
      timestamp: new Date().toISOString()
    }
  });
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
