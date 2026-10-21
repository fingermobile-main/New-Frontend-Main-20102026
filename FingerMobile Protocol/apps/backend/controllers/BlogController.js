/**
 * Blog Controller
 * Handles blog-related operations
 */

const Blog = require('../models/Blog');
const Category = require('../models/Category');
const User = require('../models/User');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class BlogController {
  // Create a new blog post
  async createBlog(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content, excerpt, categoryIds, tags, status, featuredImage } = req.body;
      const _authorId = req.user.id; // Using underscore prefix to indicate intentional unused variable

      // Validate category IDs if provided
      if (categoryIds && Array.isArray(categoryIds)) {
        const categories = await Category.findAll({
          where: { id: { [Op.in]: categoryIds } }
        });
        if (categories.length !== categoryIds.length) {
          return res.status(400).json({ error: 'One or more categories do not exist' });
        }
      }

      // Create the blog post
      const blog = await Blog.create({
        title,
        content,
        excerpt,
        authorId: _authorId,
        status: status || 'draft',
        featuredImage,
        tags: tags || [],
        categoryIds: categoryIds || []
      });

      res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        blog
      });
    } catch (error) {
      logger.error('Error creating blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while creating blog post',
        error: error.message
      });
    }
  }

  // Get all blog posts with pagination and filtering
  async getAllBlogs(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        category = '',
        status = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        author = ''
      } = req.query;

      // Convert to integers
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = {};

      if (search) {
        whereConditions[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { content: { [Op.like]: `%${search}%` } },
          { excerpt: { [Op.like]: `%${search}%` } }
        ];
      }

      if (status) {
        whereConditions.status = status;
      }

      if (author) {
        whereConditions.authorId = author;
      }

      // Apply category filter if specified
      let includeCondition = [];
      if (category) {
        includeCondition.push({
          model: Category,
          as: 'categories',
          where: { name: { [Op.like]: `%${category}%` } },
          attributes: ['id', 'name', 'slug']
        });
      }

      // Fetch blogs with pagination
      const blogs = await Blog.findAndCountAll({
        where: whereConditions,
        include: includeCondition,
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]],
        distinct: true // Important when using includes to avoid duplicates
      });

      // Calculate pagination info
      const totalPages = Math.ceil(blogs.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        blogs: blogs.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalBlogs: blogs.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching blog posts:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching blog posts',
        error: error.message
      });
    }
  }

  // Get a single blog post by ID
  async getBlogById(req, res) {
    try {
      const { id } = req.params;

      const blog = await Blog.findByPk(id, {
        include: [{
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'slug']
        }, {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'email', 'displayName']
        }]
      });

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      // Increment view count
      await blog.increment('viewCount');

      res.status(200).json({
        success: true,
        blog
      });
    } catch (error) {
      logger.error('Error fetching blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching blog post',
        error: error.message
      });
    }
  }

  // Update a blog post
  async updateBlog(req, res) {
    try {
      const { id } = req.params;
      const { title, content, excerpt, categoryIds, tags, status, featuredImage } = req.body;
      const userId = req.user.id;

      // Find the blog post
      const blog = await Blog.findByPk(id);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      // Check if user owns the blog post
      if (blog.authorId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this blog post'
        });
      }

      // Validate category IDs if provided
      if (categoryIds && Array.isArray(categoryIds)) {
        const categories = await Category.findAll({
          where: { id: { [Op.in]: categoryIds } }
        });
        if (categories.length !== categoryIds.length) {
          return res.status(400).json({ error: 'One or more categories do not exist' });
        }
      }

      // Update the blog post
      await blog.update({
        title: title || blog.title,
        content: content || blog.content,
        excerpt: excerpt || blog.excerpt,
        status: status || blog.status,
        featuredImage: featuredImage !== undefined ? featuredImage : blog.featuredImage,
        tags: tags || blog.tags,
        categoryIds: categoryIds || blog.categoryIds
      });

      res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        blog
      });
    } catch (error) {
      logger.error('Error updating blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating blog post',
        error: error.message
      });
    }
  }

  // Delete a blog post
  async deleteBlog(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Find the blog post
      const blog = await Blog.findByPk(id);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      // Check if user owns the blog post
      if (blog.authorId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this blog post'
        });
      }

      // Delete the blog post
      await blog.destroy();

      res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while deleting blog post',
        error: error.message
      });
    }
  }

  // Get blogs by category
  async getBlogsByCategory(req, res) {
    try {
      const { slug } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Find category by slug
      const category = await Category.findOne({ where: { slug } });
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Find blogs in this category
      const blogs = await Blog.findAndCountAll({
        include: [{
          model: Category,
          as: 'categories',
          where: { id: category.id },
          attributes: ['id', 'name', 'slug']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(blogs.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        blogs: blogs.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalBlogs: blogs.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching blogs by category:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching blogs by category',
        error: error.message
      });
    }
  }

  // Get blogs by author
  async getBlogsByAuthor(req, res) {
    try {
      const { authorId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const blogs = await Blog.findAndCountAll({
        where: { authorId },
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(blogs.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        blogs: blogs.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalBlogs: blogs.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching blogs by author:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching blogs by author',
        error: error.message
      });
    }
  }

  // Search blogs
  async searchBlogs(req, res) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const blogs = await Blog.findAndCountAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${q}%` } },
            { content: { [Op.like]: `%${q}%` } },
            { excerpt: { [Op.like]: `%${q}%` } },
            { tags: { [Op.overlap]: [q] } } // If tags are stored as array
          ],
          status: 'published' // Only search published blogs
        },
        include: [{
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'slug']
        }, {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [
          ['createdAt', 'DESC']
        ]
      });

      const totalPages = Math.ceil(blogs.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        blogs: blogs.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalBlogs: blogs.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error searching blogs:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while searching blogs',
        error: error.message
      });
    }
  }

  // Get recent blogs
  async getRecentBlogs(req, res) {
    try {
      const { limit = 5 } = req.query;
      const limitNum = parseInt(limit);

      const blogs = await Blog.findAll({
        where: { status: 'published' },
        limit: limitNum,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'displayName']
        }]
      });

      res.status(200).json({
        success: true,
        blogs
      });
    } catch (error) {
      logger.error('Error fetching recent blogs:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching recent blogs',
        error: error.message
      });
    }
  }

  // Get popular blogs (based on view count)
  async getPopularBlogs(req, res) {
    try {
      const { limit = 5 } = req.query;
      const limitNum = parseInt(limit);

      const blogs = await Blog.findAll({
        where: { status: 'published' },
        limit: limitNum,
        order: [['viewCount', 'DESC'], ['updatedAt', 'DESC']],
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'displayName']
        }]
      });

      res.status(200).json({
        success: true,
        blogs
      });
    } catch (error) {
      logger.error('Error fetching popular blogs:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching popular blogs',
        error: error.message
      });
    }
  }
}

module.exports = new BlogController();
