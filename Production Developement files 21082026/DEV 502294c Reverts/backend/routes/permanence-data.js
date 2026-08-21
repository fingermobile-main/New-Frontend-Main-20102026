const express = require('express');
const permanenceData = require('../controllers/permanence-dataController.js');
const { authenticate } = require('../middleware/authenticate');
const db = require("../db");
const router = express.Router();

router.get("/data", authenticate, permanenceData.getAll);
router.put("/settings", authenticate, permanenceData.update);

module.exports = router;