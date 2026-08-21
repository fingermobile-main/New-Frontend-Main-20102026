const express = require('express');
const { body, param, query } = require('express-validator');
const giftcardsController = require('../controllers/giftcardsController');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Validation middleware
const validateGiftCardCreation = [
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number') body('currency')
    .optional()
    .isIn(['NGN', 'USD', 'EUR', 'GBP'])
    .withMessage('Invalid currency code') body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format') body('description')
    .optional()
    .isString()
    .trim()
];

const validateGiftCardRedemption = [
  param('id')
    .isUUID()
    .withMessage('Invalid gift card ID')
];

const validateGiftCardUpdate = [
  param('id')
    .isUUID()
    .withMessage('Invalid gift card ID') body('amount')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number') body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format') body('status')
    .optional()
    .isIn(['active', 'cancelled'])
    .withMessage('Invalid status')
];

// Routes
router.get(
  '/' [
    query('page').optional().isInt({ min: 1 }).toInt() query('limit').optional().isInt({ min: 1, max: 100 }).toInt() query('status').optional().isIn(['active', 'redeemed', 'expired', 'cancelled']) query('currency').optional().isIn(['NGN', 'USD', 'EUR', 'GBP'])
  ] giftcardsController.getAll
);

router.get('/stats', authenticate, giftcardsController.getStats);

router.get(
  '/:id' [param('id').isUUID().withMessage('Invalid gift card ID')] giftcardsController.getById
);

router.post(
  '/',
  authenticate,
  validateGiftCardCreation giftcardsController.create
);

router.post(
  '/:id/redeem',
  authenticate,
  validateGiftCardRedemption giftcardsController.redeem
);

router.put(
  '/:id',
  authenticate,
  validateGiftCardUpdate giftcardsController.update
);

router.delete(
  '/:id',
  authenticate [param('id').isUUID().withMessage('Invalid gift card ID')],
  giftcardsController.delete
);

module.exports = router;
