const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');
const { optionalAuthenticate } = require('../middleware/authenticate');

// Public read endpoints for store products & catalogues
router.get('/general', catalogController.getGeneralCatalog);
router.get('/general/:id', catalogController.getCatalogProductById);
router.get('/marketplace', catalogController.getMarketplaceCatalog);
router.get('/flamingo', catalogController.getFlamingoCatalog);
router.get('/ownit', catalogController.getOwnitCatalog);
router.get('/storefront', catalogController.getStorefrontCatalog);

// Management & Administrative mutation endpoints
router.post('/general', optionalAuthenticate, catalogController.createCatalogProduct);
router.put('/general/:id', optionalAuthenticate, catalogController.updateCatalogProduct);
router.delete('/general/:id', optionalAuthenticate, catalogController.deleteCatalogProduct);
router.post('/general/:id/curate', optionalAuthenticate, catalogController.curateStoreAllocation);
router.post('/general/:id/restock', optionalAuthenticate, catalogController.restockProduct);
router.post('/general/:id/media-batch', optionalAuthenticate, catalogController.batchManageMedia);

// Storefront Vetting & Censorship endpoint
router.post('/storefront/:id/vet', optionalAuthenticate, catalogController.vetStorefrontProduct);

module.exports = router;
