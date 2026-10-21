const express = require('express');
const enhanced_wallet = require('../controllers/enhanced_walletController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

router.get('/', authenticate, (req, res) => enhanced_wallet.getAll(req, res));
router.post('/distribute-earnings', authenticate, (req, res) => enhanced_wallet.create(req, res));
router.post('/stake', authenticate, (req, res) => enhanced_wallet.create(req, res));
router.get('/stakes', authenticate, (req, res) => enhanced_wallet.getAll(req, res));
router.get('/distribution-history', authenticate, (req, res) => enhanced_wallet.getAll(req, res));
router.post('/convert/store-credit-to-fic', authenticate, (req, res) => enhanced_wallet.create(req, res));

// Store Credit Endpoints
router.post('/spend-store-credit', authenticate, (req, res) => enhanced_wallet.spendStoreCredit(req, res));
router.get('/store-credit-transactions', authenticate, (req, res) => enhanced_wallet.getStoreCreditTransactions(req, res));
router.post('/grant-store-credit', authenticate, (req, res) => enhanced_wallet.grantStoreCredit(req, res));
router.post('/refund-store-credit', authenticate, (req, res) => enhanced_wallet.refundStoreCredit(req, res));
router.get('/earning-split-calculator', (req, res) => enhanced_wallet.calculateSplit(req, res));

module.exports = router;
