const express = require('express');
const biometric = require('../controllers/biometricController.js');
const { authenticate } = require('../middleware/authenticate');
const jwt = require("jsonwebtoken");
const { identityDb } = require("../db");
const { JWT_SECRET } = require("../config");
const router = express.Router();

router.post("/enroll", authenticate, biometric.create);
router.post("/authenticate", authenticate, biometric.create);
router.delete("/remove", authenticate, biometric.delete);
router.get("/status", authenticate, biometric.getAll);

module.exports = router;