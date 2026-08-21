const express = require('express');
const router = express.Router();
const BlogsController = require('../controllers/BlogsController');
const { authenticate } = require('../middleware/authenticate');

// Public blog routes (no authentication required)
router.get('/', BlogsController.getAllBlogs);
router.get('/:blogId', BlogsController.getBlogById);

// Protected blog routes (require authentication)
router.use(authenticate);

// Create new blog post
router.post('/', BlogsController.createBlog);

// Update blog post
router.put('/:blogId', BlogsController.updateBlog);

// Delete blog post
router.delete('/:blogId', BlogsController.deleteBlog);

// Get user's blogs
router.get('/user/:userId', BlogsController.getUserBlogs);

module.exports = router;
