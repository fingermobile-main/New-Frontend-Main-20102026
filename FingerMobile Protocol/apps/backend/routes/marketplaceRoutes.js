const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

// Platform Flagship Store
router.get('/flagship', marketplaceController.getFlagshipProducts);
router.post('/products/:id/vote', marketplaceController.votePoll);
router.post('/products/:id/react', marketplaceController.reactProduct);

// Unified endpoints used by MarketplacePage
router.get('/unified-products', marketplaceController.getFlagshipProducts); // Default to Flagship store items!
router.get('/unified-analytics', marketplaceController.getUnifiedAnalytics);
router.get('/unified-orders', marketplaceController.getUnifiedOrders);
router.get('/transactions', marketplaceController.getTransactions);
router.get('/tracking', marketplaceController.getTracking);
router.get('/vendors', marketplaceController.getVendors);
router.get('/listings', marketplaceController.getFlagshipProducts);

// Core Products and Orders endpoints
router.get('/products', marketplaceController.getFlagshipProducts);
router.post('/products', marketplaceController.createProduct);
router.get('/products/:id', marketplaceController.getProductById);
router.get('/listings/:id', marketplaceController.getProductById);
router.get('/orders', marketplaceController.getUnifiedOrders);
router.post('/orders', marketplaceController.createOrder);

module.exports = router;
