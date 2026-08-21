const express = require("express");
const walletController = require('../controllers/WalletControllerComplete');
const { authenticate } = require("../middleware/authenticate");
const router = express.Router();

// Get user's wallet information
router.get("/", authenticate, walletController.getWallet);

// Create user's wallet
router.post("/", authenticate, walletController.createWallet);

// Get wallet balance
router.get("/balance", authenticate, walletController.getBalance);

// Get wallet transactions
router.get("/transactions", authenticate, walletController.getTransactions);

// Deposit funds to wallet
router.post("/deposit", authenticate, walletController.deposit);

// Withdraw funds from wallet
router.post("/withdraw", authenticate, walletController.withdraw);

// Transfer funds to another wallet
router.post("/transfer", authenticate, walletController.transfer);

// Get current exchange rates
router.get("/exchange-rates", walletController.getExchangeRates);

module.exports = router;

