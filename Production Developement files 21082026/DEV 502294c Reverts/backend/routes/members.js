const express = require('express');
const members = require('../controllers/membersController.js');
const { authenticate } = require('../middleware/authenticate');
const { identityDb } = require("../db");
const router = express.Router();

router.get("/", authenticate, (req, res) => members.getAll(req, res));
router.get("/:memberId", authenticate, (req, res) => members.getById(req, res));
router.put("/:memberId", authenticate, (req, res) => members.update(req, res));
router.get("/:memberId/followers", authenticate, (req, res) => members.getById(req, res));
router.get("/:memberId/following", authenticate, (req, res) => members.getById(req, res));
router.post("/:memberId/follow", authenticate, (req, res) => members.create(req, res));
router.post("/:memberId/unfollow", authenticate, (req, res) => members.create(req, res));
router.get("/profile", authenticate, (req, res) => members.getAll(req, res));
router.get("/:memberId/wallet-balance", authenticate, (req, res) => members.getById(req, res));
router.get("/:memberId/notifications/count", authenticate, (req, res) => members.getById(req, res));

module.exports = router;