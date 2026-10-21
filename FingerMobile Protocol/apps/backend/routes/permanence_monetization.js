/* eslint-disable no-unused-vars */
const express = require('express');
const permanence_monetization = require('../controllers/permanence_monetizationController.js');
const { authenticate } = require('../middleware/authenticate');
const PermanenceMonetizationService = require('../services/permanence_monetization_service');
const router = express.Router();

router.post('/challenges/:challengeId/stake', authenticate, permanence_monetization.create);
router.get('/earnings', permanence_monetization.getAll);

module.exports = router;
