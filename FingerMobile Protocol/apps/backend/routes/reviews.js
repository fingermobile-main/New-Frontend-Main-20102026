const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const rateLimiterModule = require('../middleware/rateLimiter');
const authenticatedLimiter = typeof rateLimiterModule.authenticatedLimiter === 'function'
  ? rateLimiterModule.authenticatedLimiter
  : (typeof rateLimiterModule === 'function' ? rateLimiterModule : (req, res, next) => next());
const ReviewController = require('../controllers/ReviewController');

// All routes are protected and require authentication
// GET /api/reviews - Get all reviews
router.get('/', authenticate, authenticatedLimiter, ReviewController.getAll);

// GET /api/reviews/:id - Get review by ID
router.get('/:id', authenticate, authenticatedLimiter, ReviewController.getById);

// POST /api/reviews - Create new review
router.post('/', authenticate, authenticatedLimiter, ReviewController.create);

// PUT /api/reviews/:id - Update review
router.put('/:id', authenticate, authenticatedLimiter, ReviewController.update);

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', authenticate, authenticatedLimiter, ReviewController.delete);

// GET /api/reviews/product/:productId - Get reviews for a product
router.get('/product/:productId', authenticate, authenticatedLimiter, ReviewController.getProductReviews);

// GET /api/reviews/user/:userId - Get reviews by a user
router.get('/user/:userId', authenticate, authenticatedLimiter, ReviewController.getUserReviews);

module.exports = router;
