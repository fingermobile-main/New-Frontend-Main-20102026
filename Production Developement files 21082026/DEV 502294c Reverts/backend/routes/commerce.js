const express = require('express');
const commerce = require('../controllers/commerceController.js');
const { monetizationDb } = require("../db");
const crypto = require("crypto");
const router = express.Router();

router.get("/cart", (req, res) => commerce.getAll(req, res));
router.post("/cart/items", (req, res) => commerce.create(req, res));
router.put("/cart/items/:id", (req, res) => commerce.update(req, res));
router.delete("/cart/items/:id", (req, res) => commerce.delete(req, res));
router.post("/orders", (req, res) => commerce.create(req, res));
router.get("/orders", (req, res) => commerce.getAll(req, res));
router.get("/orders/:id", (req, res) => commerce.getById(req, res));

module.exports = router;