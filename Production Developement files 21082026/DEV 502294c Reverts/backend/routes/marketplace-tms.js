const express = require('express');
const marketplaceTms = require('../controllers/marketplace-tmsController.js');
const { commerceDb } = require("../db");
const router = express.Router();

router.get("/", marketplaceTms.getAll);
router.get("/:orderId", marketplaceTms.getById);
router.post("/", marketplaceTms.create);
router.put("/:orderId", marketplaceTms.update);
router.get("/:orderId/tracking", marketplaceTms.getById);

module.exports = router;