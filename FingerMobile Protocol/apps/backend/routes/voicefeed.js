/* eslint-disable no-unused-vars */
const express = require('express');
const voicefeed = require('../controllers/voicefeedController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

router.get('/posts', voicefeed.getPosts);
router.post('/posts', authenticate, voicefeed.createPost);
router.post('/posts/:id/play', authenticate, voicefeed.recordPlay);
router.get('/trending', voicefeed.getTrending || voicefeed.getPosts);

router.get('/clips', voicefeed.getPosts);
router.get('/clips/:clipId', voicefeed.getPosts);
router.post('/clips', authenticate, voicefeed.createPost);
router.put('/clips/:clipId', authenticate, voicefeed.getPosts);
router.delete('/clips/:clipId', authenticate, voicefeed.getPosts);
router.post('/clips/:clipId/like', authenticate, voicefeed.createPost);
router.delete('/clips/:clipId/like', authenticate, voicefeed.getPosts);
router.get('/members/:memberId/clips', authenticate, voicefeed.getPosts);
router.get('/clips/:clipId/comments', voicefeed.getPosts);
router.post('/clips/:clipId/comments', authenticate, voicefeed.createPost);
router.delete('/comments/:commentId', authenticate, voicefeed.getPosts);

router.get('/', voicefeed.getPosts);
router.post('/', authenticate, voicefeed.createPost);

module.exports = router;
