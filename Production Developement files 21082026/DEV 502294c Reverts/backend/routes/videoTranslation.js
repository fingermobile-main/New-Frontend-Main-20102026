const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validateVideoUpload, validateVideoDeletion } = require('../middleware/validation');
const {
  uploadVideo,
  getTranslationStatus,
  getUserVideos,
  getAvailableLanguages,
  deleteVideo getQuotaInfo
} = require('../controllers/videoTranslationController');

// POST /api/v1/video-translation/upload
// FIXED: Attached the missing validateVideoUpload middleware to secure the ingestion pipeline
router.post('/upload', auth, validateVideoUpload, uploadVideo);

// GET /api/v1/video-translation/status/:processingId
router.get('/status/:processingId', auth, getTranslationStatus);

// GET /api/v1/video-translation/my-videos
router.get('/my-videos', auth, getUserVideos);

// GET /api/v1/video-translation/languages
router.get('/languages', auth, getAvailableLanguages);

// GET /api/v1/video-translation/quota
// NOTE: Shifted static routes above parameterized routes (like /:videoId) 
// to prevent Express from parsing static subpaths as route parameters.
router.get('/quota', auth, getQuotaInfo);

// DELETE /api/v1/video-translation/:videoId
router.delete('/:videoId', auth, validateVideoDeletion, deleteVideo);

module.exports = router;