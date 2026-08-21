const express = require('express');
const trends = require('../controllers/trendsController.js');
const { contentDb, socialDb } = require("../db");
const router = express.Router();

router.get("/trends", trends.getAll);
router.get("/hashtags", trends.getAll);
router.get("/topics/:category", trends.getById);
router.get("/creators", trends.getAll);
router.get("/summary", trends.getAll);

module.exports = router;