const express = require('express');
const developer = require('../controllers/developerController.js');
const { authDb } = require("../db");
const crypto = require("crypto");
const router = express.Router();

router.get("/applications", developer.getAll);
router.post("/applications", developer.create);
router.get("/applications/:appId", developer.getById);
router.put("/applications/:appId", developer.update);
router.delete("/applications/:appId", developer.delete);
router.get("/applications/:appId/keys", developer.getById);
router.post("/applications/:appId/keys", developer.create);
router.put("/keys/:keyId", developer.update);
router.delete("/keys/:keyId", developer.delete);

module.exports = router;