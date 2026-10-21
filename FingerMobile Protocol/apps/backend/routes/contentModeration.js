/* eslint-disable no-unused-vars */
const express = require('express');
const contentmoderation = require('../controllers/contentModerationController.js');
const { authenticate } = require('../middleware/authenticate');
const contentModerationService = require('../services/contentModerationService');
const router = express.Router();

router.post('/assess-content', authenticate, contentmoderation.create);
router.post('/submit-for-review', authenticate, contentmoderation.create);
router.post('/data-portability/request', authenticate, contentmoderation.create);
router.post('/child-protection', authenticate, contentmoderation.create);
router.get('/compliance-health', authenticate, contentmoderation.getAll);

module.exports = router;
