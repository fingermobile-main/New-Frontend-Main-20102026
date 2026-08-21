const express = require('express');
const lumina = require('../controllers/luminaController.js');
const { authenticate } = require('../middleware/authenticate');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { contentDb } = require("../db");
const ffmpegService = require("../services/ffmpegService");
const mediaProcessingService = require("./../services/mediaProcessingService");
const router = express.Router();

router.post("/upload", lumina.create);
router.get("/user/:userId/assets", lumina.getById);
router.get("/user/:userId/balance", lumina.getById);
router.post("/claim-reward", lumina.create);
router.post("/transcode", authenticate, lumina.create);
router.post("/thumbnail", authenticate, lumina.create);
router.get("/artworks", lumina.getAll);

module.exports = router;