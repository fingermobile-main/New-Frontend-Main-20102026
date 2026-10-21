/* eslint-disable no-unused-vars */
const express = require('express');
const photocredits = require('../controllers/photocreditsController.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Multer storage for media uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/photocredits');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max per media item (supports high-res images & videos)
});

// Specific route paths before wildcard :photoId
router.get('/', photocredits.getAll);
router.get('/suggested', (req, res) => {
  res.json({
    id: '1',
    photographer: '@israelobinna',
    available: 50
  });
});
router.get('/giveaway', photocredits.getGiveawayLeaderboard);
router.get('/categories', photocredits.getAll);
router.get('/licenses/user/:userId', photocredits.getById);

// Upload and Creation
router.post('/', photocredits.create);
router.post('/upload', upload.any(), photocredits.upload);

// Specific Photo Operations
router.get('/:id', photocredits.getById);
router.post('/:id/vote', photocredits.vote);
router.post('/:id/poll', photocredits.poll);
router.post('/:id/purchase-license', photocredits.create);
router.put('/:id', photocredits.update);
router.delete('/:id', photocredits.delete);

module.exports = router;
