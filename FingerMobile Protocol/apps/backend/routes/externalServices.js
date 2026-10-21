const express = require('express');
const externalServicesController = require('../controllers/externalServicesController.js');
const router = express.Router();

// Signalwire routes for SMS and OTP
router.post('/signalwire/send-sms', externalServicesController.sendSignalwireSMS);
router.post('/signalwire/send-otp', externalServicesController.sendSignalwireOTP);

// Moniepoint payment routes
router.post('/moniepoint/init-transaction', externalServicesController.initMoniepointTransaction);
router.post('/moniepoint/process-payout', externalServicesController.processMoniepointPayout);
router.get('/moniepoint/wallet-balance', externalServicesController.getMoniepointWalletBalance);

// OPAY payment routes
router.post('/opay/process-payout', externalServicesController.processOpayPayout);
router.post('/opay/validate-payment', externalServicesController.validateOpayPayment);

// PhotoCredits routes
router.post('/photocredits/create', externalServicesController.purchasePhotoCredits);
router.post('/photocredits/add-to-board', externalServicesController.create);
router.post('/photocredits/record-download', externalServicesController.create);
router.get('/photocredits/trending', externalServicesController.getAll);
router.get('/photocredits/recommended/:memberId', externalServicesController.getById);

// Super Six Game routes
router.post('/supersix/session', externalServicesController.handleSuperSix);
router.put('/supersix/session/:sessionId', externalServicesController.handleSuperSix);
router.put('/supersix/session/:sessionId/end', externalServicesController.handleSuperSix);
router.get('/supersix/member/:memberId/stats', externalServicesController.handleSuperSix);
router.get('/supersix/leaderboards', externalServicesController.handleSuperSix);
router.get('/supersix/daily-challenges', externalServicesController.handleSuperSix);

module.exports = router;
