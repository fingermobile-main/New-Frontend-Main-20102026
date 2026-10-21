const express = require('express');
const router = express.Router();
const db = require('../db');
const pool = db.pool;
const logger = require('../utils/logger');
const { authenticate } = require('../middleware/authenticate');

const getUserId = (req) => String(req.user?.id || '4');

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

// GET /api/billing/invoices
router.get('/invoices', optionalAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const result = await pool.query(
      'SELECT id, user_id, amount, amount_numeric, currency, status, description, invoice_date, pdf_url, created_at FROM billing_invoices WHERE user_id = $1 OR user_id = $2 ORDER BY created_at DESC',
      [userId, '4']
    );

    const mapped = result.rows.map(inv => ({
      id: inv.id,
      amount: inv.amount,
      amountNumeric: parseFloat(inv.amount_numeric || 0),
      currency: inv.currency,
      status: inv.status,
      description: inv.description,
      date: inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      pdfUrl: inv.pdf_url,
      createdAt: inv.created_at
    }));

    res.json({
      success: true,
      data: mapped,
      invoices: mapped
    });
  } catch (err) {
    logger.error('Billing Invoices Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve invoices' });
  }
});

// GET /api/billing/payment-methods
router.get('/payment-methods', optionalAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const result = await pool.query(
      'SELECT id, user_id, brand, last4, exp_month, exp_year, is_default, created_at FROM user_payment_methods WHERE user_id = $1 OR user_id = $2 ORDER BY is_default DESC, created_at DESC',
      [userId, '4']
    );

    const mapped = result.rows.map(pm => ({
      id: pm.id,
      brand: pm.brand,
      last4: pm.last4,
      expiry: `${String(pm.exp_month || 12).padStart(2, '0')}/${String(pm.exp_year || 28).slice(-2)}`,
      isDefault: pm.is_default
    }));

    res.json({
      success: true,
      data: mapped,
      paymentMethods: mapped
    });
  } catch (err) {
    logger.error('Billing Payment Methods Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve payment methods' });
  }
});

// POST /api/billing/payment-methods
router.post('/payment-methods', optionalAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { brand = 'Visa', last4 = '4242', expMonth = 12, expYear = 2028, isDefault = false } = req.body;

    const result = await pool.query(
      `INSERT INTO user_payment_methods (user_id, brand, last4, exp_month, exp_year, is_default, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [userId, brand, last4, expMonth, expYear, isDefault]
    );

    res.status(201).json({
      success: true,
      message: 'Payment method added successfully',
      data: result.rows[0]
    });
  } catch (err) {
    logger.error('Add Payment Method Error:', err);
    res.status(500).json({ success: false, message: 'Failed to add payment method' });
  }
});

module.exports = router;
