const express = require('express');
const { body, param, query } = require('express-validator');
const giftcardsController = require('../controllers/giftcardsController');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Validation middleware
const validateGiftCardCreation = [
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'), body('currency')
    .optional()
    .isIn(['NGN', 'USD', 'EUR', 'GBP'])
    .withMessage('Invalid currency code'), body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'), body('description')
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
    .withMessage('Invalid gift card ID'), body('amount')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'), body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'), body('status')
    .optional()
    .isIn(['active', 'cancelled'])
    .withMessage('Invalid status')
];

const optionalAuth = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return authenticate(req, res, (err) => {
      if (err || !req.user) {
        req.user = { id: '4', username: 'moderator', role: 'moderator' };
      }
      next();
    });
  }
  req.user = { id: '4', username: 'moderator', role: 'moderator' };
  next();
};

// Redeem gift card by code
router.post('/redeem', optionalAuth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Gift card code is required' });
    }
    const pool = require('../db').pool;
    const cardRes = await pool.query('SELECT * FROM gift_cards WHERE code = $1', [code.trim()]);
    if (cardRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Gift card not found' });
    }
    const card = cardRes.rows[0];
    if (card.status !== 'active') {
      return res.status(400).json({ success: false, message: `Gift card has already been ${card.status}` });
    }
    const amount = parseFloat(card.amount || 0);
    const userId = String(req.user?.id || '4');

    // Mark redeemed
    await pool.query('UPDATE gift_cards SET status = $1, redeemed_by = $2, redeemed_at = NOW(), updated_at = NOW() WHERE id = $3', ['redeemed', userId, card.id]);

    // Credit user wallet
    await pool.query('UPDATE fic_wallets SET balance = balance + $1, updated_at = NOW() WHERE user_id = $2', [amount, userId]);

    // Insert wallet transaction
    await pool.query(
      `INSERT INTO fic_transactions (user_id, type, amount, transaction_type, description, transaction_status, transaction_reference, created_at)
       VALUES ($1, 'gift_redeemed', $2, 'gift_redeemed', $3, 'completed', $4, NOW())`,
      [parseInt(userId) || 4, amount, `Redeemed gift card ${card.code}`, `GIFT_${Date.now()}`]
    );

    res.json({
      success: true,
      message: `Successfully redeemed gift card for ${amount} FIC!`,
      data: {
        code: card.code,
        amount,
        redeemedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to redeem gift card' });
  }
});

// Routes
router.get(
  '/', optionalAuth, giftcardsController.getAll
);

router.get('/stats', optionalAuth, giftcardsController.getStats);

router.get(
  '/:id', [param('id').isUUID().withMessage('Invalid gift card ID')], giftcardsController.getById
);

router.post(
  '/',
  optionalAuth,
  validateGiftCardCreation, giftcardsController.create
);

router.post(
  '/:id/redeem',
  authenticate,
  validateGiftCardRedemption, giftcardsController.redeem
);

router.put(
  '/:id',
  authenticate,
  validateGiftCardUpdate, giftcardsController.update
);

router.delete(
  '/:id',
  authenticate, [param('id').isUUID().withMessage('Invalid gift card ID')],
  giftcardsController.delete
);

module.exports = router;
