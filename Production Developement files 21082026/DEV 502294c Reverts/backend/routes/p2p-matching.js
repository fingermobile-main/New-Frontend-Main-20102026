const express = require('express');
const p2pMatching = require('../controllers/p2p-matchingController.js');
const db = require("../db");
const router = express.Router();

router.get("/member-profiles", p2pMatching.getAll);
router.get("/member-profiles/:id", p2pMatching.getById);
router.post("/member-profiles", p2pMatching.create);
router.post("/find-matches", p2pMatching.create);
router.post("/matches", p2pMatching.create);
router.get("/matches/:memberId", p2pMatching.getById);
router.put("/matches/:matchId", p2pMatching.update);
router.get("/fic-subscriptions/:memberId", p2pMatching.getById);
router.post("/fic-subscriptions", p2pMatching.create);
router.post("/procurement-documents", p2pMatching.create);
router.get("/procurement-documents", p2pMatching.getAll);
router.post("/three-way-matching", p2pMatching.create);
router.get("/three-way-matches", p2pMatching.getAll);
router.post("/ai-insights", p2pMatching.create);
router.get("/analytics-reports", p2pMatching.getAll);
router.post("/supply-demand-policies", p2pMatching.create);
router.get("/profile-analysis/:analyzedmemberId", p2pMatching.getById);
router.post("/marketing-matches", p2pMatching.create);
router.get("/sentinel-logs", p2pMatching.getAll);

module.exports = router;