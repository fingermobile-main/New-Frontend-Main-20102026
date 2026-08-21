const express = require('express');
const moderation = require('../controllers/moderationController.js');
const { socialDb } = require("../db");
const router = express.Router();

router.get("/reports", moderation.getAll);
router.get("/reports/:reportId", moderation.getById);
router.post("/reports", moderation.create);
router.put("/reports/:reportId", moderation.update);
router.get("/warnings/:userId", moderation.getById);
router.get("/categories", moderation.getAll);
router.get("/dashboard-stats", moderation.getAll);

module.exports = router;