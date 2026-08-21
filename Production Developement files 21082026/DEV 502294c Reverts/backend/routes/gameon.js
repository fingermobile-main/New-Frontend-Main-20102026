const express = require('express');
const gameon = require('../controllers/gameonController.js');
const { contentDb } = require("../db");
const router = express.Router();

router.get("/events", gameon.getAll);
router.get("/events/:eventId", gameon.getById);
router.post("/events", gameon.create);
router.post("/events/:eventId/register", gameon.create);
router.delete("/events/:eventId/unregister", gameon.delete);
router.get("/users/:userId/events", gameon.getById);
router.get("/users/:userId/organized-events", gameon.getById);
router.get("/categories", gameon.getAll);

module.exports = router;