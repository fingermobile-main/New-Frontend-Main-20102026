const express = require('express');
const integrations = require('../controllers/integrationsController.js');
const { authDb } = require("../db");
const router = express.Router();

router.get("/", integrations.getAll);
router.post("/", integrations.create);
router.get("/:integrationId", integrations.getById);
router.put("/:integrationId", integrations.update);
router.delete("/:integrationId", integrations.delete);
router.get("/services/list", integrations.getAll);

module.exports = router;