import request from 'supertest';
import express from 'express';
import walletRoutes from '../routes/wallet.routes';
import authMiddleware from '../middleware/auth';

// Mock the auth middleware
jest.mock('../middleware/auth', () => {
  return jest.fn((req, res, next) => {
    req.user = {
id: 'test-user-id',
email: 'test@example.com' }
    next()
  })
})

// Mock the WalletController methods
const mockWalletController = {
getWalletDetails: jest.fn((req, res) => {
    res.json({
wallet: {
id: 'wallet-123',
userId: 'test-user-id',
balance: 100.50,
currency: 'USD',
status: 'active'
      }
    })
  }),
distributeEarnings: jest.fn((req, res) => {
    res.status(201).json({
message: 'Earnings distributed successfully',
amount: req.body.amount
    })
  }),
stakeTokens: jest.fn((req, res) => {
    res.status(201).json({
message: 'Tokens staked successfully',
amount: req.body.amount
    })
  }),
getStakes: jest.fn((req, res) => {
    res.json({
stakes: []
    })
  }),
getDistributionHistory: jest.fn((req, res) => {
    res.json({
transactions: []
    });
  }),
processPayment: jest.fn((req, res) => {
    res.status(201).json({
message: 'Payment processed successfully',
amount: req.body.amount
    });
  })
};

jest.mock('../controllers/WalletController', () => mockWalletController);

const app = express();
app.use(express.json());
app.use('/api', walletRoutes);

describe('Wallet Routes', () => {
  describe('GET /enhanced-wallet', () => {
    it('should return wallet details', async () => {
      const response = await request(app)
        .get('/api/enhanced-wallet')
        .expect(200);

      expect(response.body.wallet).toBeDefined();
      expect(response.body.wallet.balance).toBe(100.50);
      expect(mockWalletController.getWalletDetails).toHaveBeenCalled();
    });
  });

  describe('POST /enhanced-wallet/distribute-earnings', () => {
    it('should distribute earnings with valid data', async () => {
      const response = await request(app)
        .post('/api/enhanced-wallet/distribute-earnings')
        .send({
amount: 50.00,
source: 'views',
description: 'Test earnings'
        })
        .expect(201);

      expect(response.body.message).toBe('Earnings distributed successfully');
      expect(mockWalletController.distributeEarnings).toHaveBeenCalled();
    });

    it('should reject invalid amount', async () => {
      const response = await request(app)
        .post('/api/enhanced-wallet/distribute-earnings')
        .send({
amount: -10,
source: 'views'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /enhanced-wallet/stake', () => {
    it('should stake tokens with valid amount', async () => {
      const response = await request(app)
        .post('/api/enhanced-wallet/stake')
        .send({
amount: 100.00 })
        .expect(201);

      expect(response.body.message).toBe('Tokens staked successfully');
      expect(mockWalletController.stakeTokens).toHaveBeenCalled();
    });

    it('should reject missing amount', async () => {
      const response = await request(app)
        .post('/api/enhanced-wallet/stake')
        .send({})
        .expect(400);
    });
  });

  describe('GET /enhanced-wallet/stakes', () => {
    it('should return user stakes', async () => {
      const response = await request(app)
        .get('/api/enhanced-wallet/stakes')
        .expect(200);

      expect(response.body.stakes).toBeDefined();
      expect(mockWalletController.getStakes).toHaveBeenCalled();
    });
  });

  describe('GET /enhanced-wallet/distribution-history', () => {
    it('should return distribution history', async () => {
      const response = await request(app)
        .get('/api/enhanced-wallet/distribution-history')
        .expect(200);

      expect(response.body.transactions).toBeDefined();
      expect(mockWalletController.getDistributionHistory).toHaveBeenCalled();
    });
  });

  describe('POST /enhanced-wallet/process-payment', () => {
    it('should process payment with valid data', async () => {
      const response = await request(app)
        .post('/api/enhanced-wallet/process-payment')
        .send({
amount: 25.00,
recipientId: 'recipient-123',
description: 'Test payment'
        })
        .expect(201);

      expect(response.body.message).toBe('Payment processed successfully');
      expect(mockWalletController.processPayment).toHaveBeenCalled();
    });

    it('should reject missing recipientId', async () => {
      const response = await request(app)
        .post('/api/enhanced-wallet/process-payment')
        .send({
amount: 25.00
        })
        .expect(400);
    });

    it('should reject invalid amount', async () => {
      const response = await request(app)
        .post('/api/enhanced-wallet/process-payment')
        .send({
amount: 0,
recipientId: 'recipient-123'
        })
        .expect(400);
    });
  });
});
