const express = require('express');
const media = require('../controllers/mediaController.js');
const { contentDb } = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

router.get("/", media.getAll);
router.get("/:mediaId", media.getById);
router.post("/upload", media.create);
router.put("/:mediaId", media.update);
router.delete("/:mediaId", media.delete);
router.get("/user/:userId", media.getById);
router.get("/trending", media.getAll);

module.exports = router;