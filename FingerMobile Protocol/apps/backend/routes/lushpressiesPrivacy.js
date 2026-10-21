/**
 * Lush Pressies Privacy Routes
 * Unified router for all 8 UGC privacy controllers.
 * Base mount: /api/lushpressies/privacy
 * Date: September 29, 2026
 */

const express = require('express');
const router = express.Router();
const {
  LushReviewController,
  LushCommentsController,
  LushShareController,
  LushTagController,
  LushSaveController,
  LushDownloadController,
  LushVisibilityController,
  LushDurationController
} = require('../controllers/LushPrivacyController');

// ── 7. VISIBILITY — Privacy Settings CRUD ─────────────────────────────────────
// GET  /api/lushpressies/privacy/settings/:contentType/:contentId
// PUT  /api/lushpressies/privacy/settings/:contentType/:contentId
// GET  /api/lushpressies/privacy/can-view/:contentType/:contentId
router.get('/settings/:contentType/:contentId', LushVisibilityController.getSettings);
router.put('/settings/:contentType/:contentId', LushVisibilityController.upsertSettings);
router.get('/can-view/:contentType/:contentId', LushVisibilityController.checkCanView);

// ── 1. REVIEWS — enforces allow_reviews ────────────────────────────────────────
// GET  /api/lushpressies/privacy/reviews/:contentType/:contentId
// POST /api/lushpressies/privacy/reviews/:contentType/:contentId
router.get('/reviews/:contentType/:contentId', LushReviewController.getReviews);
router.post('/reviews/:contentType/:contentId', LushReviewController.addReview);

// ── 2. COMMENTS — enforces allow_comments (threaded) ─────────────────────────
// GET    /api/lushpressies/privacy/comments/:contentType/:contentId
// POST   /api/lushpressies/privacy/comments/:contentType/:contentId
// DELETE /api/lushpressies/privacy/comments/:commentId
router.get('/comments/:contentType/:contentId', LushCommentsController.getComments);
router.post('/comments/:contentType/:contentId', LushCommentsController.addComment);
router.delete('/comments/:commentId', LushCommentsController.deleteComment);

// ── 3. SHARE — enforces allow_sharing + 24h tokens ───────────────────────────
// POST /api/lushpressies/privacy/share/:contentType/:contentId
// GET  /api/lushpressies/privacy/share/resolve/:token
router.post('/share/:contentType/:contentId', LushShareController.shareContent);
router.get('/share/resolve/:token', LushShareController.resolveShareToken);

// ── 4. TAGS — enforces allow_tagging + approval ───────────────────────────────
// POST /api/lushpressies/privacy/tags/:contentType/:contentId
// PUT  /api/lushpressies/privacy/tags/:tagId/approve
router.post('/tags/:contentType/:contentId', LushTagController.tagUser);
router.put('/tags/:tagId/approve', LushTagController.approveTag);

// ── 5. SAVES — enforces allow_saving + collections ───────────────────────────
// POST   /api/lushpressies/privacy/saves/:contentType/:contentId
// DELETE /api/lushpressies/privacy/saves/:contentType/:contentId
// GET    /api/lushpressies/privacy/saves/me
router.post('/saves/:contentType/:contentId', LushSaveController.saveContent);
router.delete('/saves/:contentType/:contentId', LushSaveController.unsaveContent);
router.get('/saves/me', LushSaveController.getSavedByUser);

// ── 6. DOWNLOADS — enforces allow_download + signed tokens ───────────────────
// POST /api/lushpressies/privacy/download/:contentType/:contentId
router.post('/download/:contentType/:contentId', LushDownloadController.requestDownload);

// ── 8. DURATION — enforces content TTL ────────────────────────────────────────
// PUT  /api/lushpressies/privacy/duration/:contentType/:contentId
// GET  /api/lushpressies/privacy/duration/expired (admin)
router.put('/duration/:contentType/:contentId', LushDurationController.setDuration);
router.get('/duration/expired', LushDurationController.purgeExpiredContent);

module.exports = router;
