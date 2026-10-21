/* eslint-disable no-unused-vars */
const express = require('express');
// 1. Added validationResult to extract errors
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();

const paymentsController = require('../controllers/paymentsController');
const { authenticate } = require('../middleware/authenticate');

// 2. Reusable middleware to catch and return validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation middleware chains
const validatePaymentInitialization = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'NGN']).withMessage('Invalid currency code'),
  body('description').optional().isString().trim(),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  validate // <-- Added error handler
];

const validateCustomerCreation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('first_name').optional().isString().trim(),
  body('last_name').optional().isString().trim(),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  validate // <-- Added error handler
];

const validateRefund = [
  body('paymentIntentId').notEmpty().withMessage('Payment Intent ID is required'),
  body('amount').optional().isFloat({ min: 1 }).withMessage('Refund amount must be positive'),
  body('reason').optional().isString(),
  validate // <-- Added error handler
];

// --- Routes ---

// POST /api/payments/create-intent
router.post(
  '/create-intent',
  authenticate,
  validatePaymentInitialization,
  paymentsController.createPaymentIntent
);

// POST /api/payments/confirm
router.post(
  '/confirm',
  authenticate,
  [
    body('paymentIntentId').notEmpty().withMessage('Payment Intent ID required'),
    validate // <-- Intercept inline validations
  ],
  paymentsController.confirmPayment
);

// GET /api/payments/history
router.get(
  '/history',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    validate
  ],
  paymentsController.getPaymentHistory
);

// POST /api/payments/refund
router.post(
  '/refund',
  authenticate,
  validateRefund,
  paymentsController.processRefund
);

// GET /api/payments/invoices
router.get(
  '/invoices',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    validate
  ],
  paymentsController.getInvoices
);

// GET /api/payments/invoices/:id
router.get(
  '/invoices/:id',
  authenticate,
  [
    param('id').notEmpty().withMessage('Invoice ID is required'),
    validate
  ],
  paymentsController.getInvoiceById
);

// GET /api/payments/invoices/:id/download
router.get(
  '/invoices/:id/download',
  authenticate,
  [
    param('id').notEmpty().withMessage('Invoice ID is required'),
    validate
  ],
  paymentsController.downloadInvoice
);

// Webhook endpoint
// NOTE: Ensure your global app-level bodyParser/express.json() doesn't intercept this route first.
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentsController.handleWebhook
);

// Subscription Management Routes
router.post(
  '/subscriptions/create',
  authenticate,
  paymentsController.createSubscription
);

router.post(
  '/subscriptions/cancel',
  authenticate,
  [
    body('subscriptionId').notEmpty().withMessage('Subscription ID required'),
    validate
  ],
  paymentsController.cancelSubscription
);

router.get(
  '/subscriptions/status',
  authenticate,
  paymentsController.getSubscriptionStatus
);

// Bank Account & Payout Management Routes
router.post(
  '/bank-accounts',
  authenticate,
  paymentsController.addBankAccount
);

router.get(
  '/bank-accounts',
  authenticate,
  paymentsController.getBankAccounts
);

router.post(
  '/payouts/request',
  authenticate,
  paymentsController.requestBankPayout
);

router.get(
  '/payouts/history',
  authenticate,
  paymentsController.getBankPayoutHistory
);

module.exports = router;
