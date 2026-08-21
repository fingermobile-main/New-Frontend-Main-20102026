const express = require('express');
const hallmarks = require('../controllers/hallmarksController.js');
const { authenticate } = require('../middleware/authenticate');
const hallmarkService = require('../services/hallmarkService');
const router = express.Router();

router.get("/", authenticate, hallmarks.getAll);
router.get("/user/:userId", authenticate, hallmarks.getById);
router.post("/", authenticate, hallmarks.create);
router.post("/award", authenticate, hallmarks.create);
router.post("/check-milestones", authenticate, hallmarks.create);

module.exports = router;