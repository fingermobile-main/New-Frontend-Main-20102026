const express = require('express');
const dashboard = require('../controllers/dashboardController.js');
const { authenticate } = require('../middleware/authenticate');
const { identityDb, socialDb, contentDb } = require("../db");
const router = express.Router();

router.get("/", authenticate, dashboard.getAll);
router.get("/", authenticate, dashboard.getAll);
router.get("/", authenticate, dashboard.getAll);

module.exports = router;