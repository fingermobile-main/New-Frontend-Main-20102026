const express = require('express');
const gems = require('../controllers/gemsController.js');
const { authenticate } = require('../middleware/authenticate');
const { identityDb, monetizationDb } = require("../db");
const router = express.Router();

router.get("/balance", authenticate, gems.getAll);
router.get("/transactions", authenticate, gems.getAll);
router.post("/award", authenticate, gems.create);
router.post("/deduct", authenticate, gems.create);
router.post("/transfer", authenticate, gems.create);

module.exports = router;