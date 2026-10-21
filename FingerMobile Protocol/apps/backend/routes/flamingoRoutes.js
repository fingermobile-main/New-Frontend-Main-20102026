const express = require('express');
const controller = require('../controllers/flamingoController');
const router = express.Router();

router.get('/categories', controller.getCategories);
router.get('/products', controller.getProducts);
router.post('/products/:id/react', controller.reactToProduct);
router.post('/products/:id/vote', controller.voteProductPoll);

// Outfits
router.get('/outfits', controller.getOutfits);
router.post('/outfits', controller.createOutfit);

// Measurements
router.get('/measurements', controller.getMeasurements);
router.post('/measurements', controller.saveMeasurements);

// Size recommendations
router.get('/recommendations', controller.getSizeRecommendations);

// Posts (if any used elsewhere)
router.get('/posts', controller.getAllPosts);
router.post('/posts', controller.createPost);
router.get('/posts/trending', controller.getTrendingPosts);
router.get('/posts/:id', controller.getPostById);

module.exports = router;

