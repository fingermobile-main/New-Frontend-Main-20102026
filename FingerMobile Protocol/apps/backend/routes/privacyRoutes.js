/**
 * Universal UGC Privacy & Interaction Routes
 * FingerMobile Protocol™
 * Exposes ReviewController, commentsController, ShareController, TagController, SaveController,
 * DownloadController, VisibilityController, and DurationController endpoints.
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const { authenticatedLimiter } = require('../middleware/rateLimiter');

const ReviewController = require('../controllers/ReviewController');
const commentsController = require('../controllers/commentsController');
const ShareController = require('../controllers/ShareController');
const TagController = require('../controllers/TagController');
const SaveController = require('../controllers/SaveController');
const DownloadController = require('../controllers/DownloadController');
const VisibilityController = require('../controllers/VisibilityController');
const DurationController = require('../controllers/DurationController');

const limiter = authenticatedLimiter || ((req, res, next) => next());

// Optional auth helper (for read routes that allow anonymous access if content is public)
const optionalAuthenticate = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
};

// ==========================================
// 1. REVIEWS (ReviewController)
// ==========================================
router.get('/:contentType/:contentId/reviews', optionalAuthenticate, limiter, ReviewController.getReviews);
router.post('/:contentType/:contentId/reviews', authenticate, limiter, ReviewController.createReview);
router.delete('/reviews/:id', authenticate, limiter, ReviewController.deleteReview);
router.get('/reviews/user/me', authenticate, limiter, ReviewController.getUserReviews);

// ==========================================
// 2. COMMENTS (commentsController)
// ==========================================
router.get('/:contentType/:contentId/comments', optionalAuthenticate, limiter, commentsController.getComments);
router.post('/:contentType/:contentId/comments', authenticate, limiter, commentsController.createComment);
router.delete('/comments/:commentId', authenticate, limiter, commentsController.deleteComment);
router.get('/comments/:commentId/replies', optionalAuthenticate, limiter, commentsController.getCommentReplies);

// ==========================================
// 3. SHARES (ShareController)
// ==========================================
router.post('/:contentType/:contentId/share', optionalAuthenticate, limiter, ShareController.shareContent);
router.get('/:contentType/:contentId/shares', optionalAuthenticate, limiter, ShareController.getShareStats);
router.post('/:contentType/:contentId/share-link', optionalAuthenticate, limiter, ShareController.generateShareLink);

// ==========================================
// 4. TAGS (TagController)
// ==========================================
router.post('/:contentType/:contentId/tags', authenticate, limiter, TagController.addTag);
router.get('/:contentType/:contentId/tags', optionalAuthenticate, limiter, TagController.getTags);
router.delete('/:contentType/:contentId/tags/:taggedUserId', authenticate, limiter, TagController.removeTag);

// ==========================================
// 5. SAVES / BOOKMARKS (SaveController)
// ==========================================
router.post('/:contentType/:contentId/save', authenticate, limiter, SaveController.saveContent);
router.delete('/:contentType/:contentId/save', authenticate, limiter, SaveController.unsaveContent);
router.get('/saved', authenticate, limiter, SaveController.getUserSavedItems);

// ==========================================
// 6. DOWNLOADS (DownloadController)
// ==========================================
router.post('/:contentType/:contentId/download', optionalAuthenticate, limiter, DownloadController.requestDownload);
router.get('/:contentType/:contentId/downloads/stats', optionalAuthenticate, limiter, DownloadController.getDownloadStats);

// ==========================================
// 7. VISIBILITY & FULL PRIVACY SETTINGS (VisibilityController)
// ==========================================
router.get('/:contentType/:contentId/visibility', optionalAuthenticate, limiter, VisibilityController.getVisibility);
router.put('/:contentType/:contentId/visibility', authenticate, limiter, VisibilityController.updateVisibility);
router.put('/:contentType/:contentId/privacy', authenticate, limiter, VisibilityController.updateFullPrivacySettings);

// ==========================================
// 8. DURATION & EXPIRATION (DurationController)
// ==========================================
router.get('/:contentType/:contentId/duration', optionalAuthenticate, limiter, DurationController.getDuration);
router.put('/:contentType/:contentId/duration', authenticate, limiter, DurationController.updateDuration);

module.exports = router;
