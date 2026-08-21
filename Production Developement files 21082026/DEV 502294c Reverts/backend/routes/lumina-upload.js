const express = require('express');
const luminaUpload = require('../controllers/lumina-uploadController.js');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { contentDb } = require("../db");
const router = express.Router();

router.post("/upload", luminaUpload.create);
router.post("/transcode", luminaUpload.create);

module.exports = router;