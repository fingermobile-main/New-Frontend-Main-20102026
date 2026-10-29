'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crossStoreSearchController = require('../controllers/crossStoreSearchController');
const visualSearchController = require('../controllers/visualSearchController');
const { optionalAuthenticate } = require('../middleware/authenticate');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${Date.now()}_cross_store_visual_${Math.random().toString(36).substring(2, 9)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }
});

// GET /api/v1/stores/search or /api/stores/search
router.get('/search', (req, res) => crossStoreSearchController.searchStores(req, res));

// POST /api/stores/search/image or /api/v1/stores/search/image
router.post('/search/image', optionalAuthenticate, upload.single('image'), (req, res) => {
  return visualSearchController.searchByImage(req, res);
});

// POST /api/stores/image-search
router.post('/image-search', optionalAuthenticate, upload.single('image'), (req, res) => {
  return visualSearchController.searchByImage(req, res);
});

module.exports = router;
