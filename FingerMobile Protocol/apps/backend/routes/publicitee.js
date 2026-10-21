/**
 * Publicitee Routes
 * FingerMobile Protocol™ - Short Film, Vlogging & Skit Maker Reels
 * Strict 168-Hour (7-Day) TTL | $3.00 Monthly Creator Tier | Multi-Placement Embedding
 */

const express = require('express');
const router = express.Router();
const publicitee = require('../controllers/publiciteeController');
const { authenticate } = require('../middleware/authenticate');

// --- FEED & DISCOVERY ---
// Multi-location placement discovery feed (newsfeed_tab, newsfeed_section, forum, gems, etc.)
router.get('/feed', publicitee.getFeed);
router.get('/creator/:authorId', publicitee.getCreatorReels);
router.get('/item/:id', publicitee.getById);

// --- CREATOR UPLOAD & MANAGEMENT ---
// Submits 1 video card only (max 1.5GB, max 1hr 55m, $3/mo sub required)
router.post('/', authenticate, publicitee.create);
router.put('/:id', authenticate, publicitee.update);
router.delete('/:id', authenticate, publicitee.delete);

// --- INTERACTIONS ---
router.post('/:id/view', publicitee.recordView);
router.post('/:id/like', authenticate, publicitee.toggleLike);
router.get('/:id/comments', publicitee.getComments);
router.post('/:id/comments', authenticate, publicitee.addComment);
router.delete('/comments/:commentId', authenticate, publicitee.deleteComment);
router.post('/:id/share', publicitee.shareItem);

// --- SUBSCRIPTIONS ($3.00/month) ---
router.post('/subscription/subscribe', authenticate, publicitee.subscribe);
router.post('/subscribe', authenticate, publicitee.subscribe);
router.get('/subscription/status', authenticate, publicitee.getSubscriptionStatus);

// --- CREATOR ANALYTICS ---
router.get('/analytics/creator', authenticate, publicitee.getAnalytics);

// --- HOUSEKEEPING ---
router.post('/admin/expire-old', authenticate, publicitee.expireOldItems);

// --- BACKWARD COMPATIBILITY STUBS ---
router.get('/campaigns', publicitee.getFeed);
router.get('/campaigns/:id', publicitee.getById);
router.post('/campaigns', authenticate, publicitee.create);
router.put('/campaigns/:id', authenticate, publicitee.update);
router.delete('/campaigns/:id', authenticate, publicitee.delete);

module.exports = router;
