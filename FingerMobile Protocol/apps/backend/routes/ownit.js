/* eslint-disable no-unused-vars */
const express = require('express');
const ownit = require('../controllers/ownitController.js');
const router = express.Router();

// Stores (Celebrity Stalls, Branded Shopfronts, Shops within Shops, Pavilions)
router.get('/stores', ownit.getStores);
router.get('/stores/:slug', ownit.getStoreBySlug);

// 4K Luxury Products
router.get('/products', ownit.getProducts);
router.get('/products/:id', ownit.getProductById);
router.post('/products/:id/vote', ownit.votePoll);
router.post('/products/:id/react', ownit.reactProduct);

// Categories & Analytics
router.get('/categories', ownit.getCategories);
router.get('/stats', ownit.getStats);
router.get('/analytics', ownit.getStats);

// Legacy Fallbacks
router.post('/products/register', ownit.registerProduct);
router.get('/entries', ownit.getAll);
router.get('/entries/:entryId', ownit.getById);
router.get('/warranty-claims/my-claims', ownit.getMyClaims);
router.get('/warranty-claims', ownit.getMyClaims);
router.post('/warranty-claims', ownit.submitWarrantyClaim);

module.exports = router;
