const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const controller = require('../controllers/commerceLuxuryConsoleController');

// Ensure upload directory exists for commerce & luxury assets
const uploadDir = path.join(__dirname, '../public/uploads/commerce');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage engine for high-resolution luxury product images and 3D assets
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB for luxury lookbooks and 3D files
});

// Overview telemetry for Marketplace, Storefront, Flamingo, OwnIt, FingerLux, Tribut
router.get('/overview', (req, res) => controller.getOverview(req, res));

// Spawned Consoles Registry
router.get('/spawned-consoles', (req, res) => controller.listSpawnedConsoles(req, res));
router.post('/spawn-console', (req, res) => controller.spawnConsole(req, res));

// Multipart Media Upload (Direct to Express backend, no localStorage fallback)
router.post('/upload', upload.single('mediaFile'), (req, res) => controller.uploadMedia(req, res));

// Reorder Items (Up / Down rearrangement)
router.post('/service/:serviceKey/reorder', (req, res) => controller.reorderItems(req, res));

// Freeze / Unfreeze Toggle
router.post('/service/:serviceKey/:id/toggle-freeze', (req, res) => controller.toggleFreeze(req, res));

// CRUD for Specific Service Key
router.get('/service/:serviceKey', (req, res) => controller.getServiceItems(req, res));
router.post('/service/:serviceKey', (req, res) => controller.createItem(req, res));
router.put('/service/:serviceKey/:id', (req, res) => controller.updateItem(req, res));
router.delete('/service/:serviceKey/:id', (req, res) => controller.deleteItem(req, res));

module.exports = router;
