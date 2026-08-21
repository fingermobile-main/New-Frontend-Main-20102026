const express = require('express');
const publicitee = require('../controllers/publiciteeController.js');
const { authenticate } = require('../middleware/authenticate');
const { monetizationDb } = require("../db");
const router = express.Router();

router.get("/campaigns", publicitee.getAll);
router.get("/campaigns/:campaignId", publicitee.getById);
router.post("/campaigns", publicitee.create);
router.put("/campaigns/:campaignId", publicitee.update);
router.delete("/campaigns/:campaignId", authenticate, publicitee.delete);
router.get("/campaigns/:campaignId/impressions", publicitee.getById);
router.post("/impressions", authenticate, publicitee.create);
router.get("/campaigns/:campaignId/analytics", publicitee.getById);
router.get("/members/:memberId/campaigns", authenticate, publicitee.getById);

module.exports = router;