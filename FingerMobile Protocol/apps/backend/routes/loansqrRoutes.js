/**
 * LoanSqr Routes
 * Complete Digital Micro-Financing API Endpoints
 * FingerMobile Protocol™ - Architected by Mbah Israel Obinna
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/loansqrController');

// 1. Products & Offerings
router.get('/products', controller.getProducts);
router.get('/products/:id', controller.getProductById);

// 2. Applications & Underwriting
router.post('/apply', controller.submitApplication);
router.post('/applications', controller.submitApplication);
router.get('/applications', controller.getApplications);
router.patch('/applications/:id/approve', controller.approveApplication);
router.patch('/applications/:id/reject', controller.rejectApplication);
router.post('/applications/:id/disburse', controller.disburseLoan);

// 3. Active Loans & Repayments
router.get('/loans', controller.getLoans);
router.post('/loans/:id/repay', controller.makeRepayment);

// 4. POS Merchant Settlements
router.get('/pos-settlements', controller.getPosSettlements);
router.post('/pos-settlements/simulate', controller.simulatePosSettlement);

// 5. Dashboard Metrics & Stats
router.get('/stats', controller.getStats);

// 6. Guardian AI Support & Live Chat
router.post('/support/chat', controller.supportChat);

// 7. Guardian AI ₦5,000 Fee Collection Webhook
router.post('/webhooks/fee-collection', (req, res) => controller.handleFeeWebhook(req, res));
router.post('/fee-webhook', (req, res) => controller.handleFeeWebhook(req, res));

module.exports = router;
