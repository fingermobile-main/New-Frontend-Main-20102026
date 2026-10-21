/**
 * Financial Economic Ecosystem Routes
 * FingerMobile Protocol™ Production Architecture
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/financialEcosystemController');

// Sovereign Bank Rails (Revenue vs. Profit)
router.get('/rails', controller.getRails);

// Core Definitions (Revenue, Income, Profit)
router.get('/definitions', controller.getDefinitions);

// 18 Extracted Financial Sheets (from Excel blueprint)
router.get('/sheets', controller.getAllSheets);
router.get('/sheets/:key', controller.getSheetByKey);

// Business & Accounting Ratios
router.get('/ratios', controller.getRatios);
router.post('/ratios/evaluate', controller.evaluateCustomRatios);

// Interest & Growth Mathematical Engines
router.post('/calculators/simple-interest', controller.calculateSimpleInterest);
router.post('/calculators/compound-interest', controller.calculateCompoundInterest);
router.post('/calculators/present-value', controller.calculatePresentValue);
router.post('/calculators/effective-annual-rate', controller.calculateEffectiveAnnualRate);

// Financial Ledger & Profit Sweep
router.get('/ledger', controller.getLedger);
router.post('/ledger', controller.recordLedgerEntry);

module.exports = router;
