const express = require('express');
const featureFlag = require('../controllers/FeatureFlagController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Feature flag endpoints
router.get('/check/:key', authenticate, featureFlag.checkFlag);
router.get('/all', authenticate, featureFlag.getAllFlags);
router.post('/', authenticate, featureFlag.createFlag); // Admin only
router.put('/:id', authenticate, featureFlag.updateFlag); // Admin only
router.delete('/:id', authenticate, featureFlag.deleteFlag); // Admin only

module.exports = router;
