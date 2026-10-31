const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const tributController = require('../controllers/tributController');

const router = express.Router();

// Multer storage for hardware device uploads
const uploadDir = path.join(__dirname, '../public/uploads/tribut');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.webp';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for high-res photo and 4K video clips
  }
});

// Hardware device media upload endpoints
router.post('/upload', upload.single('media'), tributController.uploadMedia);
router.post('/upload-multiple', upload.array('media', 20), tributController.uploadMedia);
const mediaPackUpload = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'cover', maxCount: 1 },
  { name: 'video', maxCount: 5 }
]);
router.post('/upload-pack', mediaPackUpload, tributController.uploadMediaPack.bind(tributController));
router.get('/uploads', tributController.getUploads);

// Tribut overview & admin endpoints
router.get('/overview', tributController.getOverview.bind(tributController));
router.get('/admin/pins', tributController.getAllPinsAdmin.bind(tributController));
router.post('/pins/reorder', tributController.reorderPins.bind(tributController));

// Tribut pins & posts endpoints
router.post('/pins', tributController.createPin);
router.get('/pins', tributController.getPins);
router.post('/pins/:id/comments', tributController.addComment.bind(tributController));
router.get('/pins/:id/comments', tributController.getComments.bind(tributController));
router.post('/pins/:id/vote', tributController.votePin.bind(tributController));
router.put('/pins/:id', tributController.updatePin.bind(tributController));
router.patch('/pins/:id/pin-status', tributController.togglePinStatus);
router.patch('/pins/:id/freeze', tributController.toggleFreeze.bind(tributController));
router.patch('/pins/:id/censor', tributController.toggleCensor.bind(tributController));
router.patch('/pins/:id/suspend', tributController.toggleSuspend.bind(tributController));
router.patch('/pins/:id/pause-comments', tributController.togglePauseComments.bind(tributController));
router.post('/pins/:id/report', tributController.reportPin.bind(tributController));
router.delete('/pins/batch', tributController.batchDeletePins);
router.delete('/pins/:id', tributController.deletePin);

module.exports = router;
