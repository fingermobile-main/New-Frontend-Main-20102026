const express = require('express');
const apikeys = require('../controllers/apiKeysController.js');
const { authenticate } = require('../middleware/authenticate');
const apiKeyService = require("../services/apiKeyService");
const router = express.Router();

router.post("/", authenticate, apikeys.create);
router.get("/:apiKeyId", authenticate, apikeys.getById);
router.get("/", authenticate, apikeys.getAll);
router.delete("/:apiKeyId", authenticate, apikeys.delete);
router.put("/:apiKeyId/rotate", authenticate, apikeys.update);
router.post("/verify", apikeys.create);

module.exports = router;