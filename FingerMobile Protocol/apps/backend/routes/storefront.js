const express = require('express');
const storefront = require('../controllers/storefrontController.js');

const router = express.Router();

// Storefronts listing and creation
router.get('/', storefront.getStores);
router.get('/stores', storefront.getStores);
router.post('/', storefront.createStore);

// Products routes (MUST precede parameterized /:slug)
router.get('/products', storefront.getProducts);
router.get('/products/detail/:productId', storefront.getProductDetail);
router.get('/products/:productId', (req, res, next) => {
  // If productId is a UUID or integer, it's a product detail, otherwise could be storeId products
  storefront.getProducts(req, res, next);
});
router.post('/products', storefront.addProduct);
router.post('/products/:storefrontId', storefront.addProduct);
router.put('/products/:productId', storefront.updateProduct);
router.delete('/products/:productId', storefront.deleteProduct);

// Orders routes
router.get('/orders', storefront.getOrders);
router.get('/orders/my-orders', storefront.getOrders);
router.get('/orders/detail/:orderId', (req, res) => {
  req.params.storeId = req.params.orderId;
  storefront.getOrders(req, res);
});
router.get('/orders/:storefrontId', storefront.getOrders);
router.post('/orders', storefront.createOrder);
router.put('/orders/:orderId/status', storefront.updateOrderStatus);
router.post('/orders/:orderId/clawback', storefront.processOrderClawback);

// Inventory routes
router.get('/inventory', storefront.getInventory);
router.get('/inventory/:storeId', storefront.getInventory);
router.post('/inventory/:inventoryId/restock', storefront.restockInventory);
router.post('/inventory/:inventoryId/adjust', storefront.adjustInventory);

// Tracking shipments routes
router.get('/tracking', storefront.getTrackingShipments);
router.post('/tracking', storefront.createTrackingShipment);
router.put('/tracking/:id/status', storefront.updateTrackingStatus);

// Analytics & Stats
router.get('/stats', storefront.getStats);
router.get('/analytics/dashboard', storefront.getStats);
router.get('/analytics/daily', storefront.getStats);
router.get('/analytics/events', storefront.getStats);
router.get('/:storeId/analytics/dashboard', storefront.getStats);
router.get('/:storeId/analytics/daily', storefront.getStats);
router.get('/:storeId/analytics/events', storefront.getStats);

// Featured Storefront
router.get('/featured', (req, res) => {
  res.json({
    id: '1',
    name: 'FingerMobile Sovereign Boutique',
    banner: '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
    rating: 4.9,
    productsCount: 120
  });
});

// Store detail by ID or Slug
router.get('/:slug', storefront.getStoreByIdOrSlug);
router.put('/:storeId', storefront.updateStore);
router.delete('/:storeId', storefront.deleteStore);

module.exports = router;
