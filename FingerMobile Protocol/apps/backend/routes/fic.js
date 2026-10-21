const express = require('express');
const fic = require('../controllers/FICController.js');
const { authenticate, requireAdmin } = require('../middleware/authenticate');
const router = express.Router();

// Balance & Transactions
router.get('/balance', authenticate, fic.getBalance);
router.get('/transactions', authenticate, fic.getTransactions);

// Operations
router.post('/transfer', authenticate, fic.transfer);
router.post('/purchase', authenticate, fic.purchase);

// Admin
router.get('/stats', requireAdmin, fic.getStats);

module.exports = router;
