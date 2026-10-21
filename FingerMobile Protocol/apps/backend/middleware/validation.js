const { body, validationResult } = require('express-validator');

/**
 * Validation middleware for video upload
 */
const validateVideoUpload = [
  body('targetLanguages')
    .isArray({ min: 1 })
    .withMessage('At least one target language is required')
    .custom((languages) => {
      const validLanguages = ['es', 'fr', 'pt', 'cmn-CN', 'hi-IN', 'ar-XA', 'bn-IN', 'ru-RU', 'id-ID', 'ja-JP', 'ko-KR', 'de-DE', 'it-IT', 'tr-TR', 'vi-VN', 'th-TH', 'pl-PL'];
      const invalidLanguages = languages.filter(lang => !validLanguages.includes(lang));
      if (invalidLanguages.length > 0) {
        throw new Error(`Invalid language codes: ${invalidLanguages.join(', ')}`);
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Validation middleware for video status check
 */
const validateVideoStatus = [
  (req, res, next) => {
    const { processingId } = req.params;

    if (!processingId || typeof processingId !== 'string' || processingId.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Processing ID is required and must be a valid string'
      });
    }

    next();
  }
];

/**
 * Validation middleware for video deletion
 */
const validateVideoDeletion = [
  (req, res, next) => {
    const videoId = req.params.videoId;
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Video ID is required'
      });
    }

    // Basic MongoDB ObjectId validation
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(videoId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video ID format'
      });
    }

    next();
  }
];

module.exports = {
  validateVideoUpload,
  validateVideoStatus,
  validateVideoDeletion
};
