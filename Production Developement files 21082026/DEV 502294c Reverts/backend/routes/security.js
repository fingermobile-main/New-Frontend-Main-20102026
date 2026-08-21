const express = require('express');
const security = require('../controllers/securityController.js');
const { authenticate } = require('../middleware/authenticate');
const { identityDb } = require("../db");
const router = express.Router();

router.post("/enable-mfa", authenticate, security.create);
router.get("/settings", authenticate, security.getAll);
router.put("/settings", authenticate, security.update);
router.get("/sessions", authenticate, security.getAll);
router.delete("/sessions/:sessionId", authenticate, security.delete);
router.delete("/sessions", authenticate, security.delete);
router.get("/events", authenticate, security.getAll);

module.exports = router;