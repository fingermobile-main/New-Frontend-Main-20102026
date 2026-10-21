const express = require('express');
const router = express.Router();
const LoanController = require('../controllers/LoanController');
const authenticate = require('../middleware/authenticate');
const { body, param } = require('express-validator');

// Apply authentication to all loan routes
router.use(authenticate);

// GET /api/loans - Get all loans with pagination and filtering
router.get('/', LoanController.getAllLoans);

// POST /api/loans - Create a new loan
router.post('/', [
  body('principalAmount').isFloat({ min: 0 }).withMessage('Principal amount must be a positive number'),
  body('interestRate').isFloat({ min: 0, max: 100 }).withMessage('Interest rate must be between 0 and 100'),
  body('termMonths').isInt({ min: 1 }).withMessage('Term must be at least 1 month')
], LoanController.createLoan);

// GET /api/loans/:id - Get a single loan by ID
router.get('/:id', [
  param('id').isNumeric().withMessage('Loan ID must be a number')
], LoanController.getLoanById);

// PUT /api/loans/:id - Update a loan
router.put('/:id', [
  param('id').isNumeric().withMessage('Loan ID must be a number')
], LoanController.updateLoan);

// DELETE /api/loans/:id - Delete a loan
router.delete('/:id', [
  param('id').isNumeric().withMessage('Loan ID must be a number')
], LoanController.deleteLoan);

// GET /api/loans/user - Get loans by user
router.get('/user/my-loans', LoanController.getLoansByUser);

// GET /api/loans/:id/schedule - Get loan repayment schedule
router.get('/:id/schedule', [
  param('id').isNumeric().withMessage('Loan ID must be a number')
], LoanController.getRepaymentSchedule);

module.exports = router;
