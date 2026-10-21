jest.mock('../../db', () => ({
  query: jest.fn()
}));

jest.mock('../../services/paystackService', () => ({
  generateReference: jest.fn(() => 'ref_12345'),
  initializeTransaction: jest.fn(async () => ({
    authorizationUrl: 'https://paystack.com/auth',
    accessCode: 'acc_123',
    reference: 'ref_12345',
    expiresAt: '2026-10-01'
  })),
  verifyTransaction: jest.fn(async () => ({ verified: true })),
  listTransactions: jest.fn(async () => ({ data: [], meta: { page: 1, perPage: 20, total: 0, pageCount: 0 } }))
}));

const db = require('../../db');
const paymentsController = require('../../controllers/paymentsController');

describe('Payments & Bank Payout Controller Suite', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { id: '00000000-0000-0000-0000-000000000001' },
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('addBankAccount', () => {
    it('should reject unauthenticated request', async () => {
      req.user = null;
      await paymentsController.addBankAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should create bank account record', async () => {
      req.body = {
        bank_code: '057',
        bank_name: 'Zenith Bank',
        account_number: '1234567890',
        account_name: 'John Doe'
      };

      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, bank_name: 'Zenith Bank', account_number: '1234567890' }]
      });

      await paymentsController.addBankAccount(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Bank account added successfully'
        })
      );
    });
  });

  describe('requestBankPayout', () => {
    it('should require positive amount', async () => {
      req.body = { amount: 0 };
      await paymentsController.requestBankPayout(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should process payout request and update balance', async () => {
      req.body = {
        bank_account_id: 1,
        amount: 5000,
        currency: 'NGN'
      };

      // Mock user wallet balance check
      db.query.mockResolvedValueOnce({ rows: [{ balance: '10000.00' }] });
      // Mock bank payout insertion
      db.query.mockResolvedValueOnce({
        rows: [{ id: 10, amount: 5000, status: 'requested', reference: 'po_live_123' }]
      });
      // Mock wallet balance update
      db.query.mockResolvedValueOnce({ rowCount: 1 });

      await paymentsController.requestBankPayout(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Bank payout requested successfully'
        })
      );
    });
  });

  describe('getBankAccounts', () => {
    it('should return bank accounts for user', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, bank_name: 'GTBank', account_number: '0123456789' }]
      });

      await paymentsController.getBankAccounts(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array)
        })
      );
    });
  });
});
