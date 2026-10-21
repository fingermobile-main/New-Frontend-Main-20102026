/**
 * Commission Service Unit Tests
 * Tests commission calculation, recording, payout processing, and statistics
 */

const { describe, it, before, after, beforeEach } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const CommissionService = require('../../services/CommissionService');

describe('CommissionService', () => {
  let mockPool;
  let mockClient;
  
  beforeEach(() => {
    // Create mock client with transaction support
    mockClient = {
      query: sinon.stub(),
      release: sinon.stub()
    }
    
    // Create mock pool
    mockPool = {
      connect: sinon.stub().resolves(mockClient),
      query: sinon.stub()
    }
    
    // Replace db module
    const originalRequire = require.cache[require.resolve('../../db')]
    delete require.cache[require.resolve('../../db')]
    require.cache[require.resolve('../../db')] = {
      exports: {
        pool: mockPool
      }
    }
  })
  
  afterEach(() => {
    sinon.restore();
  });
  
  describe('calculateCommission()', () => {
    it('should calculate correct commission split for marketplace_sale', async () => {
      // Mock commission rule
      mockPool.query.resolves({
        rows: [{
          platform_percentage: 20,
          creator_percentage: 80
        }]
      })
      
      const result = await CommissionService.calculateCommission(100, 'marketplace_sale')
      
      expect(result).to.deep.equal({
        totalAmount: 100,
        platformEarnings: 20,
        creatorEarnings: 80,
        breakdown: [
          { type: 'platform', percentage: 20, amount: 20 },
          { type: 'creator', percentage: 80, amount: 80 }
        ]
      })
    })

    it('should handle invalid transaction types', async () => {
      try {
        await CommissionService.calculateCommission(100, 'invalid_type');
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.include('Invalid transaction type');
      }
    });
  });

  describe('recordCommission()', () => {
    it('should record commission with correct amounts', async () => {
      const commissionData = {
        transactionId: 'test-trans-123',
        userId: 'test-user-456',
        amount: 25.50,
        type: 'sale',
        metadata: { source: 'marketplace' }
      };
      
      mockPool.query.resolves({ rowCount: 1 });
      
      const result = await CommissionService.recordCommission(commissionData);
      
      expect(result).to.be.true;
      expect(mockPool.query.calledOnce).to.be.true;
    });

    it('should handle database errors gracefully', async () => {
      const commissionData = {
        transactionId: 'test-trans-123',
        userId: 'test-user-456',
        amount: 25.50,
        type: 'sale',
        metadata: { source: 'marketplace' }
      };
      
      mockPool.query.rejects(new Error('Database error'));
      
      try {
        await CommissionService.recordCommission(commissionData);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.include('Database error');
      }
    });
  });

  describe('processPayout()', () => {
    it('should process payout for eligible commissions', async () => {
      mockPool.query.onFirstCall().resolves({
        rows: [{
          id: 'comm-1',
          user_id: 'test-user-456',
          amount: 100,
          status: 'pending',
          created_at: new Date()
        }]
      });
      mockPool.query.onSecondCall().resolves({ rowCount: 1 });
      
      const result = await CommissionService.processPayout('test-user-456');
      
      expect(result.success).to.be.true;
      expect(result.paidAmount).to.equal(100);
    });

    it('should handle insufficient balance', async () => {
      mockPool.query.resolves({ rows: [] });
      
      const result = await CommissionService.processPayout('test-user-456');
      
      expect(result.success).to.be.false;
      expect(result.message).to.equal('No pending commissions available for payout');
    });
  });

  describe('getCommissionStats()', () => {
    it('should return correct commission statistics', async () => {
      const mockStats = {
        totalEarned: 5000,
        pendingPayout: 1200,
        paidOut: 3800,
        commissionCount: 45
      };
      
      mockPool.query.resolves({ rows: [mockStats] });
      
      const result = await CommissionService.getCommissionStats('test-user-456');
      
      expect(result).to.deep.equal(mockStats);
    });

    it('should handle user with no commissions', async () => {
      mockPool.query.resolves({ rows: [] });
      
      const result = await CommissionService.getCommissionStats('nonexistent-user');
      
      expect(result).to.deep.equal({
        totalEarned: 0,
        pendingPayout: 0,
        paidOut: 0,
        commissionCount: 0
      });
    });
  });
});

module.exports = CommissionService;
