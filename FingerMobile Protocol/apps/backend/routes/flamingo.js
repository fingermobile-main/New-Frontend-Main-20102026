const express = require('express');
const router = express.Router();
const flamingoController = require('../controllers/flamingoController');
const authenticate = require('../middleware/authenticate');
const { body, param, query } = require('express-validator');

// Apply authentication to all flamingo routes
router.use(authenticate);

// GET /api/flamingo/posts - Get all posts with filtering and pagination
router.get('/posts', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().escape(),
  query('postType').optional().isIn(['text', 'image', 'video', 'carousel', 'link', 'product', 'story']).withMessage('Invalid post type'),
  query('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  query('isSponsored').optional().isBoolean().withMessage('isSponsored must be a boolean'),
  query('sortBy').optional().isIn(['created_at', 'like_count', 'comment_count', 'share_count', 'engagement_score']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
], flamingoController.getAllPosts);

// POST /api/flamingo/posts - Create a new post
router.post('/posts', [
  body('caption').notEmpty().withMessage('Caption is required'),
  body('postType').optional().isIn(['text', 'image', 'video', 'carousel', 'link', 'product', 'story']).withMessage('Invalid post type'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  body('isSponsored').optional().isBoolean().withMessage('isSponsored must be a boolean')
], flamingoController.createPost);

// GET /api/flamingo/posts/:id - Get a specific post by ID
router.get('/posts/:id', [
  param('id').isInt().withMessage('Post ID must be an integer')
], flamingoController.getPostById);

// PUT /api/flamingo/posts/:id - Update a post
router.put('/posts/:id', [
  param('id').isInt().withMessage('Post ID must be an integer'),
  body('caption').optional().notEmpty().withMessage('Caption cannot be empty')
], flamingoController.updatePost);

// DELETE /api/flamingo/posts/:id - Delete a post
router.delete('/posts/:id', [
  param('id').isInt().withMessage('Post ID must be an integer')
], flamingoController.deletePost);

// GET /api/flamingo/posts/author/:authorId - Get posts by author
router.get('/posts/author/:authorId', [
  param('authorId').isInt().withMessage('Author ID must be an integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('postType').optional().isIn(['text', 'image', 'video', 'carousel', 'link', 'product', 'story']).withMessage('Invalid post type'),
  query('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  query('sortBy').optional().isIn(['created_at', 'like_count', 'comment_count', 'share_count', 'engagement_score']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
], flamingoController.getPostsByAuthor);

// GET /api/flamingo/posts/trending - Get trending posts
router.get('/posts/trending', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('days').optional().isInt({ min: 1, max: 30 }).withMessage('Days must be between 1 and 30')
], flamingoController.getTrendingPosts);

// POST /api/flamingo/posts/:id/like - Like a post
router.post('/posts/:id/like', [
  param('id').isInt().withMessage('Post ID must be an integer')
], flamingoController.likePost);

// POST /api/flamingo/posts/:id/unlike - Unlike a post
router.post('/posts/:id/unlike', [
  param('id').isInt().withMessage('Post ID must be an integer')
], flamingoController.unlikePost);

// GET /api/flamingo/posts/type/:postType - Get posts by type
router.get('/posts/type/:postType', [
  param('postType').isIn(['text', 'image', 'video', 'carousel', 'link', 'product', 'story']).withMessage('Invalid post type'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], flamingoController.getPostsByType);

// NEW: Flamingo-specific routes for the adult wellness store

// GET /api/flamingo/categories - Get all categories
router.get('/categories', flamingoController.getCategories);

// GET /api/flamingo/products - Get all products
router.get('/products', [
  query('category').optional().trim().escape(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a non-negative number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a non-negative number'),
  query('search').optional().trim().escape(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
], flamingoController.getProducts);

// GET /api/flamingo/outfits - Get user's custom outfits
router.get('/outfits', flamingoController.getOutfits);

// POST /api/flamingo/outfits - Create a new custom outfit
router.post('/outfits', [
  body('name').notEmpty().withMessage('Outfit name is required'),
  body('description').optional().trim(),
  body('occasion').optional().isIn(['casual', 'formal', 'party', 'workout', 'date', 'other']).withMessage('Invalid occasion'),
  body('season').optional().isIn(['spring', 'summer', 'fall', 'winter', 'all_season']).withMessage('Invalid season'),
  body('style_tags').optional().isArray().withMessage('Style tags must be an array'),
  body('is_public').optional().isBoolean().withMessage('is_public must be a boolean')
], flamingoController.createOutfit);

// GET /api/flamingo/measurements - Get user's body measurements
router.get('/measurements', flamingoController.getMeasurements);

// POST /api/flamingo/measurements - Save user's body measurements
router.post('/measurements', [
  body('height_cm').optional().isFloat({ min: 0 }).withMessage('Height must be a positive number'),
  body('weight_kg').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('chest_cm').optional().isFloat({ min: 0 }).withMessage('Chest measurement must be a positive number'),
  body('waist_cm').optional().isFloat({ min: 0 }).withMessage('Waist measurement must be a positive number'),
  body('hips_cm').optional().isFloat({ min: 0 }).withMessage('Hips measurement must be a positive number'),
  body('preferred_fit').optional().isIn(['slim', 'regular', 'relaxed', 'oversized']).withMessage('Invalid fit preference')
], flamingoController.saveMeasurements);

// GET /api/flamingo/recommendations - Get size recommendations
router.get('/recommendations', flamingoController.getSizeRecommendations);

// GET /api/flamingo/brands/sizing - Get brand sizing information
router.get('/brands/sizing', flamingoController.getBrandSizings);

// POST /api/flamingo/verify-age - Verify user age for adult content access
router.post('/verify-age', [
  body('birthDate').isISO8601().withMessage('Birth date must be a valid ISO 8601 date')
], flamingoController.verifyAge);

// GET /api/flamingo/check-verification - Check if user is age verified
router.get('/check-verification', flamingoController.checkVerification);

module.exports = router;