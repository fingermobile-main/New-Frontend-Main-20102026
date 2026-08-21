const express = require('express');
const blocking = require('../controllers/blockingController.js');
const { socialDb } = require("../db");
const router = express.Router();

router.get("/", blocking.getAll);
router.post("/", blocking.create);
router.delete("/:blockedmemberId", blocking.delete);
router.get("/check/:memberId", blocking.getById);
router.get("/blocked-by", blocking.getAll);

module.exports = router;