const express = require('express');
const router = express.Router();
const BlogsController = require('../controllers/BlogsController');
const { authenticate } = require('../middleware/authenticate');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  authenticate(req, res, next);
};

// Public blog routes (no authentication required)
router.get('/posts', BlogsController.getPosts);
router.get('/posts/:id', BlogsController.getPostById);
router.post('/posts/:id/like', optionalAuth, BlogsController.togglePostLike);
router.get('/', BlogsController.getPosts);
router.get('/:blogId', BlogsController.getPostById);

// Protected blog routes (require authentication)
router.use(authenticate);

// Create new blog post
router.post('/posts', BlogsController.createPost);
router.post('/', BlogsController.createPost);

// Update blog post
router.put('/posts/:id', BlogsController.updatePost);
router.put('/:blogId', BlogsController.updatePost);

// Delete blog post
router.delete('/posts/:id', BlogsController.deletePost);
router.delete('/:blogId', BlogsController.deletePost);

// Get user's blogs
router.get('/user/:userId', (req, res) => {
  req.query.owner_id = req.params.userId;
  return BlogsController.getPosts(req, res);
});

module.exports = router;
