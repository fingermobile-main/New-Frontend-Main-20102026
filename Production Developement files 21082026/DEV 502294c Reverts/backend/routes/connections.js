const express = require('express');
const connections = require('../controllers/connectionsController.js');
const { authenticate } = require('../middleware/authenticate');
const { socialDb } = require("../db");
const router = express.Router();

router.get("/", authenticate, connections.getAll);
router.get("/requests", authenticate, connections.getAll);
router.post("/request/:targetMemberId", authenticate, connections.create);
router.post("/accept/:requestId", authenticate, connections.create);
router.post("/reject/:requestId", authenticate, connections.create);
router.delete("/remove/:connectedMemberId", authenticate, connections.delete);
router.post("/block/:targetMemberId", authenticate, connections.create);
router.delete("/unblock/:blockedMemberId", authenticate, connections.delete);
router.get("/blocked", authenticate, connections.getAll);
router.get("/search/:query", authenticate, connections.getById);
router.get("/suggestions", authenticate, connections.getAll);

module.exports = router;