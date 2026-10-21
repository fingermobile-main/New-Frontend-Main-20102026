const express = require('express');
const router = express.Router();
const fingerluxController = require('../controllers/fingerluxController');
const authenticate = require('../middleware/authenticate');
const { body, param, query } = require('express-validator');

// Apply authentication to all fingerlux routes
router.use(authenticate);

// GET /api/fingerlux/contents - Get all premium contents with filtering and pagination
router.get('/contents', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().escape(),
  query('contentType').optional().isIn(['video', 'image', 'audio', 'document', 'exclusive_article', 'experience']).withMessage('Invalid content type'),
  query('accessLevel').optional().isIn(['premium', 'vip', 'exclusive', 'limited_edition']).withMessage('Invalid access level'),
  query('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  query('sortBy').optional().isIn(['created_at', 'view_count', 'like_count', 'price']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
], fingerluxController.getAllContents);

// POST /api/fingerlux/contents - Create a new premium content
router.post('/contents', [
  body('categoryId').isInt().withMessage('Category ID must be an integer'),
  body('title').notEmpty().withMessage('Title is required'),
  body('contentType').isIn(['video', 'image', 'audio', 'document', 'exclusive_article', 'experience']).withMessage('Invalid content type'),
  body('contentUrl').notEmpty().withMessage('Content URL is required'),
  body('accessLevel').isIn(['premium', 'vip', 'exclusive', 'limited_edition']).withMessage('Invalid access level'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
], fingerluxController.createContent);

// GET /api/fingerlux/contents/:id - Get a specific premium content by ID
router.get('/contents/:id', [
  param('id').isInt().withMessage('Content ID must be an integer')
], fingerluxController.getContentById);

// PUT /api/fingerlux/contents/:id - Update a premium content
router.put('/contents/:id', [
  param('id').isInt().withMessage('Content ID must be an integer'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
], fingerluxController.updateContent);

// DELETE /api/fingerlux/contents/:id - Delete a premium content
router.delete('/contents/:id', [
  param('id').isInt().withMessage('Content ID must be an integer')
], fingerluxController.deleteContent);

// GET /api/fingerlux/contents/access/:accessLevel - Get contents by access level
router.get('/contents/access/:accessLevel', [
  param('accessLevel').isIn(['premium', 'vip', 'exclusive', 'limited_edition']).withMessage('Invalid access level'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], fingerluxController.getContentsByAccessLevel);

// GET /api/fingerlux/contents/creator/:creatorId - Get contents by creator
router.get('/contents/creator/:creatorId', [
  param('creatorId').isInt().withMessage('Creator ID must be an integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], fingerluxController.getContentsByCreator);

// GET /api/fingerlux/contents/trending - Get trending contents (most viewed)
router.get('/contents/trending', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('days').optional().isInt({ min: 1, max: 30 }).withMessage('Days must be between 1 and 30')
], fingerluxController.getTrendingContents);

module.exports = router;
