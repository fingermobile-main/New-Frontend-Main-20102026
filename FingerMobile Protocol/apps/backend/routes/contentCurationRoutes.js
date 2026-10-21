const express = require('express');
const router = express.Router();
const ContentCurationController = require('../controllers/ContentCurationController');
const { requireSuperAdmin } = require('../middleware/authMiddleware');

// Route protection (Admin/SuperAdmin level depending on the platform policy)
router.use(requireSuperAdmin);

// Store curation routes
router.post('/products/upload', ContentCurationController.uploadProduct);

// Entertainment media curation routes
router.post('/media/upload', ContentCurationController.uploadMedia);

// Ad management routes
router.post('/ads/manage', ContentCurationController.manageAds);

module.exports = router;
