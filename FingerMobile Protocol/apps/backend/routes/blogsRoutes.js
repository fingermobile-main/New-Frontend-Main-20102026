const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/BlogController');

router.get('/', BlogController.getAllBlogs);
router.post('/', BlogController.createBlog);
router.get('/:id', BlogController.getBlogById);
router.put('/:id', BlogController.updateBlog);
router.delete('/:id', BlogController.deleteBlog);

module.exports = router;
