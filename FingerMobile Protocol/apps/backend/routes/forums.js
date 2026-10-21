const express = require('express');
const ForumController = require('../controllers/ForumController');
const authModule = require('../middleware/authenticate');
const authenticate = typeof authModule === 'function' ? authModule : (authModule.authenticate || authModule);
const optionalAuthenticate = (authModule && authModule.optionalAuthenticate) ? authModule.optionalAuthenticate : ((req, res, next) => next());
const { contentFilterMiddleware, censorContent } = require('../middleware/ContentFilterMiddleware');
const router = express.Router();

// Censor preview or explicit text censorship
router.post('/censor', (req, res) => {
  const { text, content } = req.body;
  const target = text || content || '';
  const censored = censorContent(target);
  return res.json({
    success: true,
    original: target,
    censored: censored,
    isCensored: target !== censored
  });
});

// Get all forum posts (supports category, search, feedMode with PostgreSQL persistence)
router.get('/posts', optionalAuthenticate, ForumController.getAllPosts);

// Notification endpoints
router.get('/notifications', authenticate, ForumController.getNotifications);
router.get('/notifications/unread-count', authenticate, ForumController.getUnreadCount);
router.post('/notifications/read-all', authenticate, ForumController.markAllNotificationsRead);
router.post('/notifications/:id/read', authenticate, ForumController.markNotificationRead);

// Get all forum categories / forums
router.get('/', ForumController.getCategories);
router.get('/categories', ForumController.getCategories);

// Get forum threads by category
router.get('/:categoryId/threads', ForumController.getThreadsByCategory);

// Create a new forum thread
router.post('/:categoryId/threads', authenticate, contentFilterMiddleware, ForumController.createThread);

// Get a specific forum thread
router.get('/threads/:threadId', ForumController.getThreadById);

// Get posts in a forum thread
router.get('/threads/:threadId/posts', ForumController.getPostsByThread);

// Create a new forum post with all 9 attachment tools
router.post('/posts', optionalAuthenticate, contentFilterMiddleware, ForumController.createPost);
router.post('/threads/:threadId/posts', optionalAuthenticate, contentFilterMiddleware, (req, res, next) => {
  req.body.threadId = req.params.threadId;
  return ForumController.createPost(req, res, next);
});
router.post('/threads/:threadId/reply', optionalAuthenticate, contentFilterMiddleware, (req, res, next) => {
  req.body.threadId = req.params.threadId;
  return ForumController.createPost(req, res, next);
});

// Like / unlike forum post
router.post('/posts/:postId/like', optionalAuthenticate, ForumController.likePost);
router.delete('/posts/:postId/like', optionalAuthenticate, ForumController.unlikePost);
router.post('/posts/:postId/unlike', optionalAuthenticate, ForumController.unlikePost);

// In-Card Poll voting
router.post('/posts/:postId/poll/vote', optionalAuthenticate, ForumController.votePoll);

// In-Card Event RSVP
router.post('/posts/:postId/event/rsvp', optionalAuthenticate, ForumController.rsvpEvent);

// In-Card Comments
router.get('/posts/:postId/comments', optionalAuthenticate, ForumController.getComments);
router.post('/posts/:postId/comments', optionalAuthenticate, contentFilterMiddleware, ForumController.addComment);
router.post('/posts/:postId/comment', optionalAuthenticate, contentFilterMiddleware, ForumController.addComment);

// Share forum post
router.post('/posts/:postId/share', optionalAuthenticate, ForumController.sharePost);

// Saved / Bookmark posts functionality
router.post('/posts/:postId/save', optionalAuthenticate, ForumController.savePost);
router.delete('/posts/:postId/save', optionalAuthenticate, ForumController.unsavePost);
router.post('/posts/:postId/bookmark', optionalAuthenticate, ForumController.savePost);
router.delete('/posts/:postId/bookmark', optionalAuthenticate, ForumController.unsavePost);
router.get('/posts/saved', optionalAuthenticate, ForumController.getUserSavedPosts);

// Get a specific forum post
router.get('/posts/:postId', ForumController.getPostById);

// Update a forum thread
router.put('/threads/:threadId', authenticate, ForumController.updateThread);

// Update a forum post
router.put('/posts/:postId', authenticate, ForumController.updatePost);

// Delete a forum thread
router.delete('/threads/:threadId', authenticate, ForumController.deleteThread);

// Delete a forum post
router.delete('/posts/:postId', authenticate, ForumController.deletePost);

// Pin/unpin forum thread
router.post('/threads/:threadId/pin', authenticate, ForumController.pinThread);
router.put('/threads/:threadId/pin', authenticate, ForumController.pinThread);
router.delete('/threads/:threadId/pin', authenticate, ForumController.unpinThread);

// Lock/unlock forum thread
router.post('/threads/:threadId/lock', authenticate, ForumController.lockThread);
router.put('/threads/:threadId/lock', authenticate, ForumController.lockThread);
router.delete('/threads/:threadId/lock', authenticate, ForumController.unlockThread);

// Subscribe/unsubscribe to forum thread
router.post('/threads/:threadId/subscribe', authenticate, ForumController.subscribeToThread);
router.delete('/threads/:threadId/subscribe', authenticate, ForumController.unsubscribeFromThread);

// Report a forum post
router.post('/posts/:postId/report', authenticate, ForumController.reportPost);

// Search forum posts
router.get('/search', ForumController.searchPosts);

// Activity Type functionality
router.put('/threads/:threadId/activity', authenticate, ForumController.setThreadActivityType);

module.exports = router;