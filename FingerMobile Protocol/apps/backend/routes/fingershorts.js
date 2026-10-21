/**
 * FingerShorts Routes
 * FingerMobile Protocol™ - Stories Module
 * 48-Hour TTL | Up to 20 Media Cards | 20MB / 60s per Card | Duet | Stitch | Sounds | Video Replies
 */

const express = require('express');
const router = express.Router();
const fingershorts = require('../controllers/fingershortsController');
const { authenticate } = require('../middleware/authenticate');

// --- FEEDS ---
router.get('/for-you', fingershorts.getForYou);
router.get('/following', authenticate, fingershorts.getFollowing);
router.get('/trending', fingershorts.getTrending);

// --- SESSIONS & CARDS (Up to 20 cards per session) ---
router.get('/sessions/:id', fingershorts.getSessionById);
router.post('/sessions', authenticate, fingershorts.createSession);
router.post('/sessions/:sessionId/cards', authenticate, fingershorts.addCardToSession);
router.delete('/sessions/:id', authenticate, fingershorts.deleteSession);

// --- INTERACTIVE: DUET & STITCH ---
router.post('/duet', authenticate, fingershorts.createDuet);
router.post('/stitch', authenticate, fingershorts.createStitch);

// --- SOUNDS LIBRARY ---
router.get('/sounds', fingershorts.getSounds);
router.post('/sounds', authenticate, fingershorts.uploadSound);

// --- VIDEO REPLIES ---
router.post('/video-replies', authenticate, fingershorts.createVideoReply);

// --- CARD INTERACTIONS ---
router.post('/cards/:cardId/view', fingershorts.recordView);
router.post('/cards/:cardId/like', authenticate, fingershorts.toggleLike);
router.get('/cards/:cardId/comments', fingershorts.getComments);
router.post('/cards/:cardId/comments', authenticate, fingershorts.addComment);
router.delete('/comments/:commentId', authenticate, fingershorts.deleteComment);

// --- ANALYTICS ---
router.get('/analytics/creator', authenticate, fingershorts.getCreatorAnalytics);

// --- HOUSEKEEPING ---
router.post('/admin/expire-old', authenticate, fingershorts.expireOldShorts);

// --- BACKWARD COMPATIBILITY ALIASES ---
router.get('/', fingershorts.getForYou);
router.post('/', authenticate, fingershorts.createSession);
router.get('/videos', fingershorts.getForYou);
router.get('/videos/:id', fingershorts.getSessionById);
router.post('/videos', authenticate, fingershorts.createSession);
router.put('/videos/:id', authenticate, (req, res) => res.json({ success: true, message: 'Updated' }));
router.delete('/videos/:id', authenticate, fingershorts.deleteSession);
router.post('/videos/:id/view', fingershorts.recordView);
router.post('/videos/:id/like', authenticate, fingershorts.toggleLike);
router.get('/videos/:id/comments', fingershorts.getComments);
router.post('/videos/:id/comments', authenticate, fingershorts.addComment);
router.get('/metrics/algorithm', authenticate, (req, res) => res.json({ success: true, data: { status: 'healthy', ttl: 48 } }));

module.exports = router;
