/* eslint-disable no-unused-vars */
const express = require('express');
const luminaMedia = require('../controllers/lumina-mediaController.js');
const { authenticate } = require('../middleware/authenticate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.post('/upload', authenticate, luminaMedia.create);
router.post('/transcode', authenticate, luminaMedia.create);
router.post('/apply-filter', authenticate, luminaMedia.create);
router.get('/files/:id', luminaMedia.getById);
router.get('/my-assets', authenticate, luminaMedia.getAll);
router.delete('/files/:id', authenticate, luminaMedia.delete);

module.exports = router;
