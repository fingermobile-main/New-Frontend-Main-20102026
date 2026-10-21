/* eslint-disable no-unused-vars */
const express = require('express');
const authenticator = require('../controllers/authenticatorController.js');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { identityDb } = require('../db');
const { JWT_SECRET } = require('../config');
const router = express.Router();

router.post('/enable', authenticator.setup);
router.post('/verify', authenticator.verify);
router.post('/disable', authenticator.disable);
router.post('/verify-login', authenticator.validate);

module.exports = router;
