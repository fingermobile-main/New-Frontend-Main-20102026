const express = require('express');
const nysc = require('../controllers/nyscController.js');
const { socialDb } = require("../db");
const router = express.Router();

router.get("/batches", nysc.getAll);
router.get("/batches/:batchId", nysc.getById);
router.get("/batches/:batchId/corpers", nysc.getById);
router.get("/corpers/:corperId", nysc.getById);
router.post("/register", nysc.create);
router.get("/state/:stateCode", nysc.getById);
router.get("/corpers/:corperId/service-record", nysc.getById);
router.post("/projects", nysc.create);
router.get("/events", nysc.getAll);

module.exports = router;