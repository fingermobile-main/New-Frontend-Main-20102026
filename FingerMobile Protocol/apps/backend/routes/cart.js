const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const authenticate = require('../middleware/authenticate');
const { body, param } = require('express-validator');

// Apply authentication to all cart routes
router.use(authenticate);

// GET /api/cart - Get user's cart
router.get('/', CartController.getUserCart);

// POST /api/cart - Add item to cart
router.post('/', [
  body('productId').isNumeric().withMessage('Product ID must be a number'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('variantId').optional().isNumeric().withMessage('Variant ID must be a number')
], CartController.addToCart);

// PUT /api/cart/:itemId - Update cart item quantity
router.put('/:itemId', [
  param('itemId').isNumeric().withMessage('Item ID must be a number'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
], CartController.updateCartItem);

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', [
  param('itemId').isNumeric().withMessage('Item ID must be a number')
], CartController.removeCartItem);

// DELETE /api/cart - Clear entire cart
router.delete('/', CartController.clearCart);

// GET /api/cart/summary - Get cart summary
router.get('/summary', CartController.getCartSummary);

// POST /api/cart/merge - Merge guest cart with user cart
router.post('/merge', CartController.mergeCarts);

module.exports = router;
