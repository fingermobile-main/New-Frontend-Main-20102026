const express = require('express');
const router = express.Router();
const trendsController = require('../controllers/trendsController');

router.get('/', trendsController.getTrending);
router.get('/hashtags', trendsController.getTrendingHashtags);
router.get('/topics', trendsController.getTrendingTopics);

module.exports = router;
