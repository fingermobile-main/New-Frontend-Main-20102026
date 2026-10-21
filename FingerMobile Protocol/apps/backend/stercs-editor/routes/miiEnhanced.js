const logger = require('../../utils/logger');
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/authenticate');
const MiiEnhancedService = require('../services/miiEnhancedService');
const miiMCPService = require('../../mcp-servers/mii-mcp-service');

// Create disappearing media (FingerOrbit feature)
router.post('/media', authenticate, async (req, res) => {
  try {
    const { mediaFile, timerType } = req.body;
    const memberId = req.member.id;

    const result = await MiiEnhancedService.createDisappearingMedia(
      memberId,
      mediaFile,
      timerType,
    );

    res.status(201).json({success: true,
      data: result
    });
  } catch (error) {
    logger.error('Error creating disappearing, media:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Create FingerOrbit folder
router.post('/fingerorbit/folders', authenticate, async (req, res) => {
  try {
    const { folderName, folderType, privacySetting } = req.body;
    const memberId = req.member.id;

    const result = await MiiEnhancedService.createFingerOrbitFolder(
      memberId,
      folderName,
      folderType,
      privacySetting,
    );

    res.status(201).json({success: true,
      data: result
    });
  } catch (error) {
    logger.error('Error creating FingerOrbit, folder:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Add media to FingerOrbit folder
router.post(
  '/fingerorbit/folders/:folderId/media/:mediaId',
  authenticate,
  async (req, res) => {
    try {
      const { folderId, mediaId } = req.params;
      const { timerType } = req.body;
      const memberId = req.member.id;

      const result = await MiiEnhancedService.addMediaToFingerOrbitFolder(
        memberId,
        folderId,
        mediaId,
        timerType,
      );

      res.status(200).json({success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error adding media to FingerOrbit, folder:', error);
      res.status(500).json({success: false,
        message: error.message
      });
    }
  },
);

// Get FingerOrbit content
router.get('/fingerorbit/content', authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;
    const { folderType } = req.query;

    const content = await MiiEnhancedService.getFingerOrbitContent(
      memberId,
      folderType,
    );

    res.status(200).json({success: true,
      data: content,
      count: content.length
    });
  } catch (error) {
    logger.error('Error getting FingerOrbit, content:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Check if content can be downloaded (requires PIN exchange)
router.get('/can-download/:contentOwnerId', authenticate, async (req, res) => {
  try {
    const { contentOwnerId } = req.params;
    const memberId = req.member.id;

    const canDownload = await MiiEnhancedService.canDownloadContent(
      memberId,
      contentOwnerId,
    );

    res.status(200).json({success: true,
      data: { canDownload }
    });
  } catch (error) {
    logger.error('Error checking download, permission:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Update currently listening status
router.post('/currently-listening', authenticate, async (req, res) => {
  try {
    const { mediaInfo } = req.body;
    const memberId = req.member.id;

    const result = await MiiEnhancedService.updateCurrentlyListening(
      memberId,
      mediaInfo,
    );

    res.status(200).json({success: true,
      data: result
    });
  } catch (error) {
    logger.error('Error updating currently, listening:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Update currently watching status
router.post('/currently-watching', authenticate, async (req, res) => {
  try {
    const { mediaInfo } = req.body;
    const memberId = req.member.id;

    const result = await MiiEnhancedService.updateCurrentlyWatching(
      memberId,
      mediaInfo,
    );

    res.status(200).json({success: true,
      data: result
    });
  } catch (error) {
    logger.error('Error updating currently, watching:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Get showcase info (what member is listening/watching)
router.get('/showcase/:memberId', authenticate, async (req, res) => {
  try {
    const { memberId } = req.params;

    const showcaseInfo = await MiiEnhancedService.getShowcaseInfo(memberId);

    res.status(200).json({success: true,
      data: showcaseInfo
    });
  } catch (error) {
    logger.error('Error getting showcase, info:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Get authorized viewers for a member's status
router.get('/authorized-viewers/:memberId', authenticate, async (req, res) => {
  try {
    const { memberId } = req.params;

    const authorizedViewers =
      await MiiEnhancedService.getAuthorizedViewers(memberId);

    res.status(200).json({success: true,
      data: authorizedViewers,
      count: authorizedViewers.length
    });
  } catch (error) {
    logger.error('Error getting authorized, viewers:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Create a reply to a Mii update
router.post('/updates/:updateId/reply', authenticate, async (req, res) => {
  try {
    const { updateId } = req.params;
    const { content } = req.body;
    const memberId = req.member.id;

    const result = await MiiEnhancedService.createMiiReply(
      memberId,
      updateId,
      content,
    );

    res.status(201).json({success: true,
      data: result
    });
  } catch (error) {
    logger.error('Error creating Mii, reply:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Get contact showcases (what contacts are listening/watching)
router.get('/contact-showcases', authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;

    const contactShowcases =
      await MiiEnhancedService.getContactShowcases(memberId);

    res.status(200).json({success: true,
      data: contactShowcases,
      count: contactShowcases.length
    });
  } catch (error) {
    logger.error('Error getting contact, showcases:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// MCP Service Routes - Advanced Messaging Features (already implemented in mii.js)

// Get member's pending messages
router.get('/messages', authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;

    const messages = miiMCPService.getMemberMessages(memberId);

    res.status(200).json({success: true,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    logger.error('Error getting, messages:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Get member's groups
router.get('/groups', authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;

    const groups = miiMCPService.getMemberGroups(memberId);

    res.status(200).json({success: true,
      data: groups,
      count: groups.length
    });
  } catch (error) {
    logger.error('Error getting, groups:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

// Get MCP service status
router.get('/mcp-status', authenticate, async (req, res) => {
  try {
    const status = miiMCPService.getStatus();

    res.status(200).json({success: true,
      data: status
    });
  } catch (error) {
    logger.error('Error getting MCP, status:', error);
    res.status(500).json({success: false,
      message: error.message
    });
  }
});

module.exports = router;
