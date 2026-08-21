const express = require('express');
const ownit = require('../controllers/ownitController.js');
const { contentDb } = require("../db");
const router = express.Router();

router.get("/categories", ownit.getAll);
router.get("/entries", ownit.getAll);
router.get("/entries/:entryId", ownit.getById);
router.post("/entries", ownit.create);
router.put("/entries/:entryId", ownit.update);
router.delete("/entries/:entryId", ownit.delete);
router.get("/users/:userId/entries", ownit.getById);
router.get("/warranties/expiring", ownit.getAll);
router.get("/orders", ownit.getAll);
router.get("/orders/:orderId", ownit.getById);
router.post("/orders", ownit.create);
router.put("/orders/:orderId", ownit.update);
router.get("/users/:userId/orders", ownit.getById);
router.get("/returns", ownit.getAll);
router.post("/returns", ownit.create);
router.put("/returns/:returnId", ownit.update);
router.get("/warranty-claims", ownit.getAll);
router.post("/warranty-claims", ownit.create);
router.put("/warranty-claims/:claimId", ownit.update);

module.exports = router;