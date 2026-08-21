const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const aiCreditBalanceController = require('../controllers/AICreditBalanceController');

/**
 * AI Credit Balance Routes
 * Manages AI credit balances for users
 */

// Get user's AI credit balance
router.get('/', authenticate, aiCreditBalanceController.getBalance);

// Add credits to user's balance
router.post('/add', authenticate, aiCreditBalanceController.addCredits);

// Deduct credits from user's balance
router.post('/deduct', authenticate, aiCreditBalanceController.deductCredits);

// Get transaction history
router.get('/transactions', authenticate, aiCreditBalanceController.getTransactions);

module.exports = router;
