const express = require('express');
const authenticator = require('../controllers/authenticatorController.js');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { identityDb } = require('../db');
const { JWT_SECRET } = require('../config');
const router = express.Router();

router.post("/enable", authenticator.create);
router.post("/verify", authenticator.create);
router.post("/disable", authenticator.create);
router.post("/verify-login", authenticator.create);

module.exports = router;