const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const lushPrivacyController = require('../services/lushPrivacyController');
const lushPrivacySovereignty = require('../services/lushPrivacySovereignty');

// Check if user has permission to view specific content
router.post('/content/:contentType/:contentId/check-view', authenticateToken, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const userId = req.user.id;

    const result = await lushPrivacyController.checkViewPermission(contentType, contentId, userId);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify PIN for content access
router.post('/pin/verify', authenticateToken, async (req, res) => {
  try {
    const { pin, contentType, contentId } = req.body;
    const userId = req.user.id;

    const result = await lushPrivacyController.verifyPinForContent(pin, contentType, contentId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate content PIN
router.post('/content/:contentType/:contentId/pin', authenticateToken, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const userId = req.user.id;
    const { expirationHours, maxUses, reusable } = req.body;

    const options = { expirationHours, maxUses, reusable };

    const result = await lushPrivacyController.generateContentPin(contentType, contentId, userId, options);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update privacy settings for content
router.put('/content/:contentType/:contentId', authenticateToken, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const userId = req.user.id;
    const newSettings = req.body;

    const result = await lushPrivacyController.updatePrivacySettings(contentType, contentId, userId, newSettings);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get privacy settings for content
router.get('/content/:contentType/:contentId', authenticateToken, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;

    const result = await lushPrivacyController.getPrivacySettings(contentType, contentId);

    if (result) {
      res.status(200).json({ success: true, settings: result });
    } else {
      res.status(404).json({ success: false, error: 'Privacy settings not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check if content has privacy restrictions
router.get('/content/:contentType/:contentId/restrictions', authenticateToken, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;

    const result = await lushPrivacyController.hasPrivacyRestrictions(contentType, contentId);

    res.status(200).json({ hasRestrictions: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create privacy-controlled content
router.post('/controlled-content', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, privacySettings } = req.body;

    const result = await lushPrivacySovereignty.createPrivacyControlledContent(userId, content, privacySettings);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Request access to privacy-controlled content
router.post('/controlled-content/:contentId/access', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId } = req.params;
    const { pin } = req.body;

    const accessCredentials = { pin };
    const result = await lushPrivacySovereignty.requestAccessToContent(userId, contentId, accessCredentials);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's privacy settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushPrivacySovereignty.getUserPrivacySettings(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user's privacy settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const newSettings = req.body;

    const result = await lushPrivacySovereignty.updateUserPrivacySettings(userId, newSettings);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Activate incognito mode
router.post('/incognito/activate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { durationHours = 24 } = req.body;

    const result = await lushPrivacySovereignty.activateIncognitoMode(userId, parseInt(durationHours));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deactivate incognito mode
router.post('/incognito/deactivate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushPrivacySovereignty.deactivateIncognitoMode(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's incognito status
router.get('/incognito/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushPrivacySovereignty.getUserIncognitoStatus(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create privacy access code
router.post('/access-code', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId, permissions, expiryHours = 24 } = req.body;

    const result = await lushPrivacySovereignty.createPrivacyAccessCode(userId, targetUserId, permissions, parseInt(expiryHours));

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validate privacy access code
router.post('/access-code/validate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { accessCode, requestedPermission } = req.body;

    const result = await lushPrivacySovereignty.validatePrivacyAccessCode(userId, accessCode, requestedPermission);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get privacy compliance report
router.get('/compliance-report', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushPrivacySovereignty.getPrivacyComplianceReport(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get privacy sovereignty dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushPrivacySovereignty.getPrivacyDashboardData(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get privacy recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushPrivacySovereignty.getPrivacyRecommendations(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;