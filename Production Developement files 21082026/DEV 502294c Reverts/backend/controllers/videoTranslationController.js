const VideoTranslationService = require('../services/videoTranslationService');
const logger = require('../utils/logger'); // Fixed: Added missing logger dependency module
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure uploads directory exists
    const uploadDir = 'uploads/';
    cb(null, uploadDir);
  }, 
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only video files
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter, 
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

/**
 * Upload a video for translation
 */
// Fixed: Restructured syntax from a broken array assignment into a proper clean middleware wrapper pipeline
exports.uploadVideo = [
  upload.single('video'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false, message: 'No video file provided'
        });
      }

      // Parse target languages from request body
      let targetLanguages = req.body.targetLanguages;
      if (typeof targetLanguages === 'string') {
        try {
          targetLanguages = JSON.parse(targetLanguages);
        } catch (e) {
          // If parsing fails, treat as a single language
          targetLanguages = [targetLanguages];
        }
      }

      if (!Array.isArray(targetLanguages) || targetLanguages.length === 0) {
        return res.status(400).json({
          success: false, message: 'At least one target language is required'
        });
      }

      // Validate user ID exists
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false, message: 'User not authenticated'
        });
      }

      // Fixed: Added missing structural comma between req.file and targetLanguages parameters
      const result = await VideoTranslationService.uploadVideo(
        req.user.id,
        req.file, 
        targetLanguages
      );

      res.status(200).json(result);
    } catch (error) {
      logger.error('Upload video error:', error);
      res.status(500).json({
        success: false, message: error.message || 'Internal server error during video upload'
      });
    }
  }
];

/**
 * Get translation status
 */
exports.getTranslationStatus = async (req, res) => {
  try {
    const { processingId } = req.params;

    if (!processingId) {
      return res.status(400).json({
        success: false, message: 'Processing ID is required'
      });
    }

    const result = await VideoTranslationService.getTranslationStatus(processingId);

    res.status(200).json(result);
  } catch (error) {
    logger.error('Get translation status error:', error);
    res.status(500).json({
      success: false, message: error.message || 'Internal server error during status check'
    });
  }
};

/**
 * Get user's translated videos
 */
exports.getUserVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false, message: 'Invalid page or limit values'
      });
    }

    const result = await VideoTranslationService.getUserVideos(userId, page, limit);

    res.status(200).json(result);
  } catch (error) {
    logger.error('Get user videos error:', error);
    res.status(500).json({
      success: false, message: error.message || 'Internal server error during video retrieval'
    });
  }
};

/**
 * Get available target languages
 */
exports.getAvailableLanguages = async (req, res) => {
  try {
    const result = await VideoTranslationService.getAvailableLanguages();

    res.status(200).json(result);
  } catch (error) {
    logger.error('Get available languages error:', error);
    res.status(500).json({
      success: false, message: error.message || 'Internal server error during language retrieval'
    });
  }
};

/**
 * Delete a translated video
 */
exports.deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    if (!videoId) {
      return res.status(400).json({
        success: false, message: 'Video ID is required'
      });
    }

    const result = await VideoTranslationService.deleteVideo(userId, videoId);

    res.status(200).json(result);
  } catch (error) {
    logger.error('Delete video error:', error);
    res.status(500).json({
      success: false, message: error.message || 'Internal server error during video deletion'
    });
  }
};

/**
 * Get user's storage quota information
 */
exports.getQuotaInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await VideoTranslationService.getUserQuota(userId);

    res.status(200).json(result);
  } catch (error) {
    logger.error('Get quota info error:', error);
    res.status(500).json({
      success: false, message: error.message || 'Internal server error during quota retrieval'
    });
  }
};