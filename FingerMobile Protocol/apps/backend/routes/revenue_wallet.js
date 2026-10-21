const express = require('express');
const router = express.Router();
const RevenueWalletController = require('../controllers/RevenueWalletController');

// Retrieve wallet details and balance
router.get('/:userId/balance', RevenueWalletController.getWalletBalance);

// Simulated deposit endpoint
router.post('/deposit', RevenueWalletController.depositFunds);

// P2P Tip transfer endpoint
router.post('/tip', RevenueWalletController.sendTip);

module.exports = router;
