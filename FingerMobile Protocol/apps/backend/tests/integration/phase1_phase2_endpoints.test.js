/**
 * Integration Tests for New API Endpoints
 * Tests Phase 1 & 2 implementations
 */

const request = require('supertest');
const app = require('../../app'); // Main Express app

describe('Phase 1 & 2 API Integration Tests', () => {
  let authToken
  let testUserId
  
  beforeAll(async () => {
    // Login to get auth token (adjust credentials as needed)
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({email: 'test@example.com', password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
      })
    
    if (loginResponse.body.success) {
      authToken = loginResponse.body.data.token
      testUserId = loginResponse.body.data.user.id
    }
  })
  
  describe('Commission System', () => {
    it('GET /api/commissions/stats should return statistics', async () => {
      const res = await request(app)
        .get('/api/commissions/stats')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalCommissions');
    });
    
    it('POST /api/commissions/calculate should calculate commission', async () => {
      const res = await request(app)
        .post('/api/commissions/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({amount: 100, tier: 'standard'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('commissionAmount');
    });
  });
  
  describe('Community Platform', () => {
    it('GET /api/communities should list communities', async () => {
      const res = await request(app)
        .get('/api/communities?limit=5');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data).toBe('array');
    });
    
    it('POST /api/communities should create community', async () => {
      const res = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({name: 'Test Community', description: 'Integration test community', type: 'public'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Test Community');
    });
  });
  
  describe('Marketplace', () => {
    it('GET /api/marketplace should list listings', async () => {
      const res = await request(app)
        .get('/api/marketplace?limit=5');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data).toBe('array');
    });
    
    it('POST /api/marketplace should create listing', async () => {
      const res = await request(app)
        .post('/api/marketplace')
        .set('Authorization', `Bearer ${authToken}`)
        .send({title: 'Test Product', description: 'Integration test product', price: 99.99,
  type: 'digital_product'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
    });
  });
  
  describe('Help Center FAQ', () => {
    it('GET /api/helpcenter/faqs should return FAQs', async () => {
      const res = await request(app)
        .get('/api/helpcenter/faqs?limit=5');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data).toBe('array');
    });
    
    it('GET /api/helpcenter/categories should return categories', async () => {
      const res = await request(app)
        .get('/api/helpcenter/categories');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data).toBe('array');
    });
  });
  
  describe('Recommendation Engine', () => {
    it('GET /api/recommendations/trending should return trending content', async () => {
      const res = await request(app)
        .get('/api/recommendations/trending?limit=5');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data).toBe('array');
    });
    
    it('POST /api/recommendations/interactions should record interaction', async () => {
      const res = await request(app)
        .post('/api/recommendations/interactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({itemId: 'test-item-123', interactionType: 'view', value: 1
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
  
  describe('Wallet Exchange Rates', () => {
    it('GET /api/wallet/exchange-rates should return live rates', async () => {
      const res = await request(app)
        .get('/api/wallet/exchange-rates');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('rates');
      expect(res.body.data.rates).toHaveProperty('FIC_USD');
    });
  });
  
  describe('Payment Invoices', () => {
    it('GET /api/payments/invoices should return invoices', async () => {
      const res = await request(app)
        .get('/api/payments/invoices?limit=5')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data).toBe('array');
    });
  });
  
  describe('UGC Media Uploads', () => {
    it('POST /api/ugc-media/upload-file should upload file', async () => {
      // Create a test file buffer
      const testFile = Buffer.from('test image data')
      const res = await request(app)
        .post('/api/ugc-media/upload-file')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testFile, 'test.jpg')
        .field('title', 'Test Upload')
        .field('category', 'profile')
      
      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('mediaId')
    });
    
    it('GET /api/ugc-media/content should list media', async () => {
      const res = await request(app)
        .get('/api/ugc-media/content?limit=5');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data).toBe('array');
    });
  });
  
  describe('Role-Based Access Control', () => {
    it('should prevent unauthorized access to admin endpoints', async () => {
      const res = await request(app)
        .get('/api/commissions/pending')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Should return 403 Forbidden or 401 Unauthorized
      expect([401, 403]).toContain(res.status)
    })
    
    it('should allow authenticated users to access protected resources', async () => {
      const res = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${authToken}`)
      
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true);
    });
  });
});

module.exports = IntegrationTests;
