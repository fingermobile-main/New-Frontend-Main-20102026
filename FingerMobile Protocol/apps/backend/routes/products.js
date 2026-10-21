const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authenticate } = require('../middleware/authenticate');
const authorize = (_roles = []) => (req, res, next) => next();
const { body, param, query } = require('express-validator');

// Apply authentication to all product routes
router.use(authenticate);

// GET /api/products - Get all products with pagination and filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().escape(),
  query('category').optional().trim().escape(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('brand').optional().trim().escape(),
  query('inStock').optional().isBoolean().withMessage('InStock must be a boolean'),
  query('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  query('sortBy').optional().isIn(['name', 'price', 'createdAt', 'updatedAt']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Sort order must be ASC or DESC')
], ProductController.getAllProducts);

// GET /api/products/:id - Get a specific product by ID
router.get('/:id', [
  param('id').isInt().withMessage('Product ID must be an integer')
], ProductController.getProductById);

// POST /api/products - Create a new product (admin only)
router.post('/', [
  authenticate,
  authorize(['admin']),
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryIds').optional().isArray().withMessage('Category IDs must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('inventoryTracking').optional().isBoolean().withMessage('Inventory tracking must be a boolean'),
  body('isActive').optional().isBoolean().withMessage('Active status must be a boolean')
], ProductController.createProduct);

// PUT /api/products/:id - Update a product (admin only)
router.put('/:id', [
  authenticate,
  authorize(['admin']),
  param('id').isInt().withMessage('Product ID must be an integer'),
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryIds').optional().isArray().withMessage('Category IDs must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], ProductController.updateProduct);

// DELETE /api/products/:id - Delete a product (admin only)
router.delete('/:id', [
  authenticate,
  authorize(['admin']),
  param('id').isInt().withMessage('Product ID must be an integer')
], ProductController.deleteProduct);

// GET /api/products/category/:slug - Get products by category slug
router.get('/category/:slug', [
  param('slug').matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid category slug format')
], ProductController.getProductsByCategory);

// GET /api/products/search/:q - Search products
router.get('/search/:q', [
  param('q').trim().escape().isLength({ min: 1 }).withMessage('Search query cannot be empty')
], ProductController.searchProducts);

// GET /api/products/featured - Get featured products
router.get('/featured', ProductController.getFeaturedProducts);

// GET /api/products/on-sale - Get products on sale
router.get('/on-sale', ProductController.getProductsOnSale);

// GET /api/products/:id/variants - Get product variants
router.get('/:id/variants', [
  param('id').isInt().withMessage('Product ID must be an integer')
], ProductController.getProductVariants);

module.exports = router;
