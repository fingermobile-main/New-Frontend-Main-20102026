const express = require('express');
const enhanced_wallet = require('../controllers/enhanced_walletController.js');
const { authenticate } = require('../middleware/authenticate');
const { monetizationDb, identityDb } = require("../db");
const EnhancedWalletService = require("../services/enhanced_wallet_service");
const router = express.Router();

router.get("/", authenticate, enhanced_wallet.getAll);
router.post("/distribute-earnings", enhanced_wallet.create);
router.post("/stake", enhanced_wallet.create);
router.get("/stakes", enhanced_wallet.getAll);
router.get("/distribution-history", enhanced_wallet.getAll);
router.post("/convert/store-credit-to-fic", enhanced_wallet.create);

module.exports = router;