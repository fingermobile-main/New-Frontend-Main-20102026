const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const rateLimiterModule = require('../middleware/rateLimiter');
const authenticatedLimiter = typeof rateLimiterModule.authenticatedLimiter === 'function'
  ? rateLimiterModule.authenticatedLimiter
  : (typeof rateLimiterModule === 'function' ? rateLimiterModule : (req, res, next) => next());
const CategoryController = require('../controllers/CategoryController');

// All routes are protected and require authentication
// GET /api/categories - Get all categories
router.get('/', authenticate, authenticatedLimiter, CategoryController.getAll);

// GET /api/categories/:id - Get category by ID
router.get('/:id', authenticate, authenticatedLimiter, CategoryController.getById);

// POST /api/categories - Create new category (admin only)
router.post('/', authenticate, authenticatedLimiter, CategoryController.create);

// PUT /api/categories/:id - Update category (admin only)
router.put('/:id', authenticate, authenticatedLimiter, CategoryController.update);

// DELETE /api/categories/:id - Delete category (admin only)
router.delete('/:id', authenticate, authenticatedLimiter, CategoryController.delete);

module.exports = router;
