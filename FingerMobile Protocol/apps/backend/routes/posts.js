const express = require('express');
const postsController = require('../controllers/postsController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Get all posts with filtering, sorting and pagination
router.get('/', authenticate, postsController.getAll);

// Composer Draft synchronization endpoints (Web & Mobile Auto-Save)
router.get('/draft', authenticate, postsController.getDraft);
router.get('/composer/draft', authenticate, postsController.getDraft);
router.post('/draft', authenticate, postsController.saveDraft);
router.post('/composer/draft', authenticate, postsController.saveDraft);
router.put('/draft', authenticate, postsController.saveDraft);
router.put('/composer/draft', authenticate, postsController.saveDraft);
router.delete('/draft', authenticate, postsController.deleteDraft);
router.delete('/composer/draft', authenticate, postsController.deleteDraft);

// AI-Powered Post Content Enhancement & Editing
router.post('/ai-edit', authenticate, postsController.aiEditPost);

// Get a specific post by ID
router.get('/:postId', authenticate, postsController.getById);

// Create a new post
router.post('/', authenticate, postsController.create);

// Update a post
router.put('/:postId', authenticate, postsController.update);

// Delete a post
router.delete('/:postId', authenticate, postsController.delete);

// Like or unlike a post
router.post('/:postId/like', authenticate, postsController.likePost);

// Get comments for a post
router.get('/:postId/comments', authenticate, postsController.getComments);

// Add a comment to a post
router.post('/:postId/comments', authenticate, postsController.addComment);

// Dislike a post
router.post('/:postId/dislike', authenticate, postsController.dislikePost);

// Vote on a poll
router.post('/:postId/poll/vote', authenticate, postsController.votePoll);

// Send gift, giftcard, gem, product
router.post('/:postId/gift', authenticate, postsController.sendGift);
router.post('/:postId/giftcard', authenticate, postsController.sendGiftcard);
router.post('/:postId/gem', authenticate, postsController.sendGem);
router.post('/:postId/product', authenticate, postsController.sendProduct);

module.exports = router;

// =====================================================
// AUTO-REFACTORING NOTE - 2026-06-08 14:15:19
// =====================================================
// This route file has been prepared for controller integration.
//
// TO COMPLETE REFACTORING:
// 1. Find inline async handlers like:
//    router.get('/', authenticate, async (req, res) => { ... });
//
// 2. Replace with controller methods:
//    router.get('/', authenticate, postsController.getAll);
//
// 3. Common controller methods:
//    - getAll / get[Name]Details  : GET /
//    - getById                    : GET /:id
//    - create                     : POST /
//    - update                     : PUT /:id
//    - delete                     : DELETE /:id
//
// 4. Check postsController for available methods
// 5. Test each endpoint after refactoring
// =====================================================

module.exports = router;
