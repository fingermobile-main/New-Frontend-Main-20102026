/**
 * Lush Pressies API Routes
 * Complete route definitions for the Lush Pressies AI-Governed Social Dating,
 * Fintech & UGC Ecosystem.
 * Date: September 29, 2026 - Phase 2 Advanced Ecosystem
 */

const express = require('express');
const path = require('path');
const multer = require('multer');
const lushpressies = require('../controllers/lushpressiesController.js');

const router = express.Router();

// Multer storage for Lush Pressies uploads (Images/Videos/Audio/Documents)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/lushpressies'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'lush-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB individual file ceiling
    files: 2 // Max 2 files
  }
});

// ============================================================
// PROFILE MANAGEMENT (Bio, Avatars, Covers, Intent, Location)
// ============================================================
router.get('/profile', lushpressies.getProfile);
router.put('/profile', lushpressies.updateProfile);

// ============================================================
// POST FEED & COMMUNITY & ATTACHMENTS
// ============================================================
router.get('/posts', lushpressies.getPosts);
router.post('/posts', lushpressies.createPost);
router.post('/posts/upload', upload.array('files', 2), lushpressies.uploadPostFiles);
router.post('/posts/:id/like', lushpressies.likePost);
router.post('/posts/:id/comment', lushpressies.commentOnPost);
router.post('/posts/:id/claim-gift', lushpressies.claimGiftExchange);
router.post('/posts/:id/share', lushpressies.sharePost);
router.post('/posts/:id/unlock', lushpressies.unlockPost);
router.post('/posts/:id/hide', lushpressies.hidePost);
router.post('/posts/:id/report', lushpressies.reportPost);
router.get('/trending', lushpressies.getTrending);
router.get('/trending/hashtags', lushpressies.getTrendingHashtags);
router.delete('/cleanup', lushpressies.cleanupExpiredContent);

// ============================================================
// ENCORE VIP BONDS & FINGERLUX RENDEZVOUS ENGINE
// (3-5 Star Members, Propose Meets/Expeditions, OwnIt/Flamingo Gifting)
// ============================================================
router.get('/encore', lushpressies.getEncoreMembers);
router.post('/encore/propose-meet', lushpressies.proposeMeet);
router.post('/encore/send-luxury-gift', lushpressies.sendLuxuryGift);

// ============================================================
// DISCOVER & SWIPE DECK ENGINE
// ============================================================
router.get('/discover', lushpressies.getDiscoverProfiles);
router.get('/discover/queue', lushpressies.getSwipeDeck);
router.post('/swipe', lushpressies.recordSwipe);
router.post('/swipe/reverse', lushpressies.reverseRoll);
router.get('/matches', lushpressies.getMatches);
// ============================================================
// NOTIFICATIONS ENGINE
// ============================================================
router.get('/notifications', lushpressies.getNotifications);
router.get('/notifications/unread-count', lushpressies.getUnreadNotificationsCount);
router.put('/notifications/mark-all-read', lushpressies.markAllNotificationsRead);
router.put('/notifications/:id/read', lushpressies.markNotificationRead);
// ============================================================
// PLATFORM PREMIUM STORES & GIFT EXCHANGE
// (OwnIt Store, Flamingo, Lush Gift store, Gems store, FIC)
// ============================================================
router.get('/stores/items', lushpressies.getPremiumStoreItems);

// ============================================================
// GIFT-FIRST INTERACTION ENGINE & VIRTUAL GIFT SHOP
// ============================================================
router.get('/gifts/shop', lushpressies.getVirtualGiftShop);
router.post('/gifts/send', lushpressies.sendGift);

// ============================================================
// 6-DIGIT PIN EXCHANGE, 50-GENERATION QUOTA, & REVOCATION ENGINE
// ============================================================
router.post('/pins/generate', lushpressies.generatePin);
router.post('/pins/verify', lushpressies.verifyPin);
router.post('/pins/exchange', lushpressies.exchangePin);
router.post('/pins/revoke', lushpressies.revokePin);
router.get('/pins/quota', lushpressies.getPinQuota);
router.post('/pins/packages/purchase', lushpressies.purchasePinPackage);
router.get('/pins/connections', lushpressies.getActivePinConnections);

// ============================================================
// 30 LAPIDAIRE COMPATIBILITY QUESTIONS & QWEN AI SCORING
// ============================================================
router.get('/lapidaires', lushpressies.getLapidaires);
router.post('/lapidaires/seed', lushpressies.seedLapidaires);
router.get('/lapidaires', lushpressies.getLapidaires);
router.post('/lapidaires/seed', lushpressies.seedLapidaires);

// ============================================================
// MEMBER REVIEWS & DEFENSE RESPONSES
// ============================================================
router.post('/reviews', lushpressies.addReview);
router.post('/reviews/:id/respond', lushpressies.respondToReview);

// ============================================================
// RADIATE & RADIATE++ MATCHING BOOST ENGINE
// ============================================================
router.post('/radiate', lushpressies.activateRadiate);

// ============================================================
// 5 SPECIAL MARKETPLACE WIDGETS
// ============================================================
router.post('/widgets/activate', lushpressies.activateWidget);

// ============================================================
// COMMIT BUTTON & 5-MONTH ELIGIBILITY TRACKER
// ============================================================
router.get('/commit/check', lushpressies.checkCommitEligibility);

// ============================================================
// 60/20/20 UGC REVENUE SPLIT ENGINE
// ============================================================
router.post('/purchases/ugc', lushpressies.processUgcPurchase);

// ============================================================
// LEGACY ARRANGEMENT ENDPOINTS (Backwards Compatible)
// ============================================================
router.get('/arrangements', lushpressies.getAll);
router.get('/arrangements/:arrangementId', lushpressies.getById);
router.post('/arrangements', lushpressies.create);
router.get('/categories', lushpressies.getAll);
router.get('/creators/:creatorId/arrangements', lushpressies.getById);
router.put('/arrangements/:arrangementId', lushpressies.update);
router.delete('/arrangements/:arrangementId', lushpressies.delete);

module.exports = router;
