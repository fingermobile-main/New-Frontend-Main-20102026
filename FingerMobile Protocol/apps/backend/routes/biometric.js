/* eslint-disable no-unused-vars */
const express = require('express');
const biometric = require('../controllers/biometricController.js');
const { authenticate } = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');
const { identityDb } = require('../db');
const { JWT_SECRET } = require('../config');
const router = express.Router();

router.post('/identify-1toN', biometric.identify1toN);
router.post('/verify-1to1', biometric.verify1to1);
router.post('/enroll', biometric.enrollFace || biometric.startRegistration);
router.post('/authenticate', biometric.startAuthentication);
router.delete('/remove', authenticate, biometric.disable);
router.get('/status', biometric.getStatus);

module.exports = router;
