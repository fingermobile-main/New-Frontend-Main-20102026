const express = require('express');
const router = express.Router();
const controller = require('../controllers/recommendationsController');
const { authenticate } = require('../middleware/authenticate');

router.get('/discover', authenticate, controller.getDiscoverFeed);

module.exports = router;
