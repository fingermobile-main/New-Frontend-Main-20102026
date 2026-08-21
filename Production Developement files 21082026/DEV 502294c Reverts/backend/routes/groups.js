const express = require('express');
const groups = require('../controllers/groupsController.js');
const { socialDb } = require("../db");
const router = express.Router();

router.get("/", groups.getAll);
router.get("/:groupId", groups.getById);
router.post("/", groups.create);
router.post("/:groupId/join", groups.create);
router.post("/:groupId/leave", groups.create);
router.get("/:groupId/members", groups.getById);
router.get("/user/:userId", groups.getById);
router.get("/categories", groups.getAll);

module.exports = router;