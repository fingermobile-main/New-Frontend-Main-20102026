const express = require('express');
const permanence = require('../controllers/permanenceController.js');
const { authenticate } = require('../middleware/authenticate');
const permanenceService = require("../services/permanenceService");
const { socialDb } = require("../db"); // Adding the missing database import
const router = express.Router();

router.get("/challenges", permanence.getAll);
router.get("/challenges/:id", permanence.getById);
router.post("/challenges", permanence.create);
router.put("/challenges/:id", permanence.update);
router.delete("/challenges/:id", permanence.delete);
router.post("/challenges/:id/participate", authenticate, permanence.create);
router.post("/challenges/:id/stake", permanence.create);
router.get("/streams", permanence.getAll);
router.post("/streams", permanence.create);
router.put("/streams/:id/start", permanence.update);
router.put("/streams/:id/stop", permanence.update);

module.exports = router;