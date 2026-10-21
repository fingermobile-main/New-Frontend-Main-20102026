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
router.get('/uploads', tributController.getUploads);

// Tribut pins & posts endpoints
router.post('/pins', tributController.createPin);
router.get('/pins', tributController.getPins);
router.patch('/pins/:id/pin-status', tributController.togglePinStatus);
router.delete('/pins/batch', tributController.batchDeletePins);
router.delete('/pins/:id', tributController.deletePin);

module.exports = router;
