const express = require('express');
const lushpressies = require('../controllers/lushpressiesController.js');
const { commerceDb } = require("../db");
const router = express.Router();

router.get("/arrangements", lushpressies.getAll);
router.get("/arrangements/:arrangementId", lushpressies.getById);
router.post("/arrangements", lushpressies.create);
router.get("/categories", lushpressies.getAll);
router.get("/creators/:creatorId/arrangements", lushpressies.getById);
router.put("/arrangements/:arrangementId", lushpressies.update);
router.delete("/arrangements/:arrangementId", lushpressies.delete);

module.exports = router;