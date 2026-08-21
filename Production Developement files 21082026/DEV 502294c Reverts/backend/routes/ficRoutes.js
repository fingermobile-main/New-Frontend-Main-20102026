const express = require('express');
const ficroutes = require('../controllers/FICOperationsController.js');
const router = express.Router();

router.post("/wallet/initialize", ficroutes.initializeWallet.bind(ficroutes));
router.get("/wallet/:memberId", ficroutes.getWallet.bind(ficroutes));
router.post("/transaction", ficroutes.createTransaction.bind(ficroutes));
router.post("/exchange", ficroutes.exchange.bind(ficroutes));
router.post("/payment", ficroutes.payment.bind(ficroutes));
router.post("/payout", ficroutes.payout.bind(ficroutes));
router.post("/biometric/register", ficroutes.registerBiometric.bind(ficroutes));
router.post("/biometric/verify", ficroutes.verifyBiometric.bind(ficroutes));
router.get("/anonymity/:memberId", ficroutes.getAnonymity.bind(ficroutes));
router.put("/anonymity/:memberId", ficroutes.updateAnonymity.bind(ficroutes));
router.post("/subscription/payment", ficroutes.payment.bind(ficroutes));
router.post("/paylink", ficroutes.createPaylink.bind(ficroutes));
router.post("/paylink/redeem", ficroutes.redeemPaylink.bind(ficroutes));
router.get("/paylink/:memberId", ficroutes.getPaylink.bind(ficroutes));
router.put("/paylink/cancel/:paylinkId", ficroutes.cancelPaylink.bind(ficroutes));
router.get("/transactions/:memberId", ficroutes.getTransactions.bind(ficroutes));
router.get("/exchange-rate", ficroutes.getExchangeRates.bind(ficroutes));
router.get("/payment-gateways", ficroutes.getPaymentGateways.bind(ficroutes));
router.get("/biometric/:memberId", ficroutes.getBiometric.bind(ficroutes));

module.exports = router;