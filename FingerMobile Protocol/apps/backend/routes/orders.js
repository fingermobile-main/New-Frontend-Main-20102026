const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const rateLimiterModule = require('../middleware/rateLimiter');
const authenticatedLimiter = typeof rateLimiterModule.authenticatedLimiter === 'function'
  ? rateLimiterModule.authenticatedLimiter
  : (typeof rateLimiterModule === 'function' ? rateLimiterModule : (req, res, next) => next());
const OrderController = require('../controllers/OrderController');

// All routes are protected and require authentication
// GET /api/orders - Get all orders (admin only)
router.get('/', authenticate, authenticatedLimiter, OrderController.getAll);

// GET /api/orders/:id - Get order by ID
router.get('/:id', authenticate, authenticatedLimiter, OrderController.getById);

// POST /api/orders - Create new order
router.post('/', authenticate, authenticatedLimiter, OrderController.create);

// PUT /api/orders/:id - Update order (admin only)
router.put('/:id', authenticate, authenticatedLimiter, OrderController.update);

// PATCH /api/orders/:id/status - Update order status (admin only)
router.patch('/:id/status', authenticate, authenticatedLimiter, OrderController.updateStatus);

// GET /api/orders/user/:userId - Get user's orders
router.get('/user/:userId', authenticate, authenticatedLimiter, OrderController.getUserOrders);

module.exports = router;
