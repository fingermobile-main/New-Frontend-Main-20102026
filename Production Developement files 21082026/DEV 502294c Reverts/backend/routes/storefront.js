const express = require('express');
const storefront = require('../controllers/storefrontController.js');
const { commerceDb } = require("../db");
const router = express.Router();

router.get("/", storefront.getAll);
router.get("/:slug", storefront.getById);
router.post("/", storefront.create);
router.put("/:storeId", storefront.update);
router.delete("/:storeId", storefront.delete);
router.get("/users/:userId/storefronts", storefront.getById);
router.get("/:storeId/products", storefront.getById);
router.get("/products/:productId", storefront.getById);
router.post("/:storeId/products", storefront.create);
router.put("/products/:productId", storefront.update);
router.delete("/products/:productId", storefront.delete);
router.get("/products/:productId/inventory", storefront.getById);
router.put("/inventory/:inventoryId", storefront.update);
router.post("/inventory/:inventoryId/restock", storefront.create);
router.get("/inventory/:inventoryId/logs", storefront.getById);
router.get("/:storeId/inventory/low-stock", storefront.getById);
router.get("/:storeId/analytics/daily", storefront.getById);
router.get("/:storeId/analytics/events", storefront.getById);
router.get("/:storeId/analytics/dashboard", storefront.getById);

module.exports = router;