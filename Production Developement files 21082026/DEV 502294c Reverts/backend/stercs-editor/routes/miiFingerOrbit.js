const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/authenticate");
const MiiFingerOrbitService = require("../services/miiFingerOrbitService");

// Create a monetized FingerOrbit folder
router.post("/folders", authenticate, async (req, res) => {
  try {
    const { folderName, folderType, privacySetting, pricingModel } = req.body;
    const memberId = req.member.id;

    const result = await MiiFingerOrbitService.createMonetizedFolder(
      memberId,
      folderName,
      folderType,
      privacySetting,
      pricingModel,
    );

    res.status(201).json({success: true,
  data: result
    });
  } catch (error) {
    logger.error("Error creating monetized FingerOrbit, folder:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Add monetized media to a FingerOrbit folder
router.post("/folders/:folderId/media", authenticate, async (req, res) => {
  try {
    const { folderId } = req.params;
    const { mediaFile, pricingModel } = req.body;
    const memberId = req.member.id;

    const result = await MiiFingerOrbitService.addMonetizedMedia(
      memberId,
      folderId,
      mediaFile,
      pricingModel,
    );

    res.status(201).json({success: true,
  data: result
    });
  } catch (error) {
    logger.error("Error adding monetized media to FingerOrbit, folder:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Get monetized FingerOrbit content
router.get("/content", authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;
    const { folderType, includePrivate } = req.query;

    const content = await MiiFingerOrbitService.getMonetizedFingerOrbitContent(
      memberId,
      folderType,
      includePrivate === "true",
    );

    res.status(200).json({success: true,
  data: content,
  count: content.length
    });
  } catch (error) {
    logger.error("Error getting monetized FingerOrbit, content:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Grant access to private content
router.post("/grant-access", authenticate, async (req, res) => {
  try {
    const { targetMemberId, mediaId } = req.body;
    const memberId = req.member.id;

    const result = await MiiFingerOrbitService.grantAccessToPrivateContent(
      memberId,
      targetMemberId,
      mediaId,
    );

    res.status(200).json({success: true,
  data: result,
  message: "Access granted successfully"
    });
  } catch (error) {
    logger.error("Error granting access to private, content:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Record a purchase for monetized content
router.post("/purchase", authenticate, async (req, res) => {
  try {
    const { mediaId, amount, currency } = req.body;
    const memberId = req.member.id;

    const result = await MiiFingerOrbitService.recordPurchase(
      memberId,
      mediaId,
      amount,
      currency,
    );

    res.status(200).json({success: true,
  data: result,
  message: "Purchase recorded successfully"
    });
  } catch (error) {
    logger.error("Error recording, purchase:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Get member's FingerOrbit earnings
router.get("/earnings", authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;

    const earnings = await MiiFingerOrbitService.getEarnings(memberId);

    res.status(200).json({success: true,
  data: earnings
    });
  } catch (error) {
    logger.error("Error getting FingerOrbit, earnings:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Get detailed analytics for a member's FingerOrbit content
router.get("/analytics", authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;

    const analytics =
      await MiiFingerOrbitService.getFingerOrbitAnalytics(memberId);

    res.status(200).json({success: true,
  data: analytics
    });
  } catch (error) {
    logger.error("Error getting FingerOrbit, analytics:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Update view count for media
router.post("/media/:mediaId/view", authenticate, async (req, res) => {
  try {
    const { mediaId } = req.params;

    const newViewCount = await MiiFingerOrbitService.updateViewCount(mediaId);

    res.status(200).json({success: true,
  data: {
  viewCount: newViewCount }
    });
  } catch (error) {
    logger.error("Error updating view, count:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Update download count for media
router.post("/media/:mediaId/download", authenticate, async (req, res) => {
  try {
    const { mediaId } = req.params;

    const newDownloadCount =
      await MiiFingerOrbitService.updateDownloadCount(mediaId);

    res.status(200).json({success: true,
  data: {
  downloadCount: newDownloadCount }
    });
  } catch (error) {
    logger.error("Error updating download, count:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Get media access list for a member
router.get("/media-access", authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;

    const accessList = await MiiFingerOrbitService.getMediaAccessList(memberId);

    res.status(200).json({success: true,
  data: accessList,
  count: accessList.length
    });
  } catch (error) {
    logger.error("Error getting media access, list:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

module.exports = router;
