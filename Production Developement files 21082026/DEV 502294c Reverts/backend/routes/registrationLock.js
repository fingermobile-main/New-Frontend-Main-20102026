const express = require('express');
const registrationlock = require('../controllers/registrationLockController.js');
const { authenticate } = require('../middleware/authenticate');
const registrationLockService = require("../services/registrationLockService");
const { logSecurityEvent } = require("../utils/securityLogger");
const router = express.Router();

router.post("/set", authenticate, registrationlock.create);
router.post("/verify", authenticate, registrationlock.create);
router.delete("/remove", authenticate, registrationlock.delete);
router.get("/status", authenticate, registrationlock.getAll);

module.exports = router;