const express = require('express');
const router = express.Router();
const RepaymentController = require('../controllers/RepaymentController');
const authenticate = require('../middleware/authenticate');
const { body, param } = require('express-validator');

// Apply authentication to all repayment routes
router.use(authenticate);

// GET /api/repayments - Get all repayments with pagination and filtering
router.get('/', RepaymentController.getAllRepayments);

// POST /api/repayments - Create a new repayment
router.post('/', [
  body('loanId').isNumeric().withMessage('Loan ID must be a number'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], RepaymentController.createRepayment);

// GET /api/repayments/:id - Get a single repayment by ID
router.get('/:id', [
  param('id').isNumeric().withMessage('Repayment ID must be a number')
], RepaymentController.getRepaymentById);

// PUT /api/repayments/:id - Update a repayment
router.put('/:id', [
  param('id').isNumeric().withMessage('Repayment ID must be a number')
], RepaymentController.updateRepayment);

// DELETE /api/repayments/:id - Delete a repayment
router.delete('/:id', [
  param('id').isNumeric().withMessage('Repayment ID must be a number')
], RepaymentController.deleteRepayment);

// GET /api/repayments/loan/:loanId - Get repayments by loan
router.get('/loan/:loanId', [
  param('loanId').isNumeric().withMessage('Loan ID must be a number')
], RepaymentController.getRepaymentsByLoan);

// GET /api/repayments/stats - Get repayment statistics
router.get('/stats', RepaymentController.getRepaymentStats);

module.exports = router;
