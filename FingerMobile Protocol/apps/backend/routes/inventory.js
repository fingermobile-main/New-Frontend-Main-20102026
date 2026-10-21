const express = require('express');
const router = express.Router();
const { getLowStockReport } = require('../controllers/inventoryReport');

// GET /api/inventory/low-stock-report - Fetch a report of low-stock items
router.get('/low-stock-report', getLowStockReport);

module.exports = router;
