/* eslint-disable no-unused-vars */
const express = require('express');
const voicelines = require('../controllers/voicelinesController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Categories & Discovery
router.get('/categories', voicelines.getCategories);
router.get('/categories/:category', voicelines.getClips);
router.get('/categories/:category/random', voicelines.getRandomClip);
router.get('/random', voicelines.getRandomClip);
router.get('/search', voicelines.searchClips);

// Playback Logging & Pipecat Configuration
router.post('/log', voicelines.logPlayback);
router.get('/pipecat/config', voicelines.getPipecatConfig);
router.get('/config', voicelines.getPipecatConfig);

// Clips CRUD & Interactions
router.get('/clips', voicelines.getClips);
router.post('/clips', authenticate, voicelines.uploadClip);
router.post('/clips/:id/download', authenticate, voicelines.downloadClip);

// Direct / Root routing
router.get('/', voicelines.getClips);
router.post('/', authenticate, voicelines.uploadClip);

// Legacy fallback compatibility
router.get('/voicelines', voicelines.getClips);
router.get('/voicelines/:voiceLineId', voicelines.getClips);
router.post('/voicelines', authenticate, voicelines.uploadClip);
router.put('/voicelines/:voiceLineId', authenticate, voicelines.getClips);
router.delete('/voicelines/:voiceLineId', authenticate, voicelines.getClips);
router.post('/voicelines/:voiceLineId/like', authenticate, voicelines.uploadClip);
router.delete('/voicelines/:voiceLineId/like', authenticate, voicelines.getClips);
router.get('/members/:memberId/voicelines', authenticate, voicelines.getClips);
router.get('/voicelines/:voiceLineId/comments', voicelines.getClips);
router.post('/voicelines/:voiceLineId/comments', authenticate, voicelines.uploadClip);
router.delete('/comments/:commentId', authenticate, voicelines.getClips);

module.exports = router;
