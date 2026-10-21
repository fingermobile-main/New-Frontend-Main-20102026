const express = require('express');
const router = express.Router();
const DownloadController = require('../controllers/DownloadController');
const authenticate = require('../middleware/authenticate');

// Apply authentication to all download routes
router.use(authenticate);

// GET /api/download/request/:contentType/:contentId - Request to download content
router.get('/request/:contentType/:contentId', DownloadController.requestDownload);

// GET /api/download/stats/:contentType/:contentId - Get content download statistics
router.get('/stats/:contentType/:contentId', DownloadController.getContentDownloads);

// GET /api/download/history - Get user's download history
router.get('/history', DownloadController.getUserDownloads);

// GET /api/download/content/:token - Direct download endpoint using token
router.get('/content/:token', DownloadController.downloadContent);

module.exports = router;
