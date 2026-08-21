const express = require('express');
const photocredits = require('../controllers/photocreditsController.js');
const { contentDb } = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

router.get("/", photocredits.getAll);
router.get("/:photoId", photocredits.getById);
router.post("/upload", photocredits.create);
router.post("/:photoId/purchase-license", photocredits.create);
router.get("/licenses/user/:userId", photocredits.getById);
router.get("/categories", photocredits.getAll);
router.put("/:photoId", photocredits.update);

module.exports = router;