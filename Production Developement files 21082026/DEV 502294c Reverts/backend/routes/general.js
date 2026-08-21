const express = require('express');
const general = require('../controllers/generalController.js');
const { identityDb } = require("../db");
const router = express.Router();

router.get("/status", general.getAll);
router.get("/config", general.getAll);
router.get("/stats", general.getAll);
router.get("/search", general.getAll);
router.get("/trending", general.getAll);
router.get("/announcements", general.getAll);
router.get("/health", general.getAll);

module.exports = router;