/**
 * Postcards Routes - FingerMobile Protocol™
 * Advanced Postcard Media & Attachment Engine
 * Date: September 29, 2026
 */

const express = require('express');
const router = express.Router();
const postcardController = require('../controllers/postcardController');

// Chunked heavy document upload endpoints (placed before :id route)
router.post('/chunks/initiate', postcardController.initiateChunkedUpload);
router.post('/chunks/upload', postcardController.uploadChunk);
router.post('/chunks/assemble', postcardController.assembleChunks);

// Postcards feed & creation
router.post('/', postcardController.createPostcard);
router.get('/', postcardController.getPostcards);
router.get('/:id', postcardController.getPostcardById);
router.post('/:id/like', postcardController.toggleLike);
router.delete('/:id', postcardController.deletePostcard);

module.exports = router;
