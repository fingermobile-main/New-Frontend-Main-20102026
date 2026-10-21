const express = require('express');
const router = express.Router();
const { getPlatformLogos } = require('../controllers/getPlatformLogos'); // Path to the controller

// Define the route
router.get('/platform-logos', getPlatformLogos);

module.exports = router;
