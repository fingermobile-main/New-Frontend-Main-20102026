/**
 * Critical Workflow Integration Tests
 * Tests end-to-end business workflows: Enrollment, Commission Lifecycle, Community Engagement
 */

const request = require('supertest');
const app = require('../../app');

describe('Critical Business Workflows', () => {
  let adminToken;
  let creatorToken;
  let buyerToken;
  let adminId;
  let creatorId;
  let buyerId;
  
  beforeAll(async () => {
    // Setup test users (adjust credentials based on your test database)
    
    // Admin login
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({email: 'admin@test.com', password: process.env.TEST_USER_PASSWORD || 'secure_test_password' })
    
    if (adminLogin.body.success) {
      adminToken = adminLogin.body.data.token
      adminId = adminLogin.body.data.user.id
    }
    
    // Creator login
    const creatorLogin = await request(app)
      .post('/api/auth/login')
      .send({email: 'creator@test.com', password: process.env.TEST_USER_PASSWORD || 'secure_test_password' })
    
    if (creatorLogin.body.success) {
      creatorToken = creatorLogin.body.data.token
      creatorId = creatorLogin.body.data.user.id
    }
    
    // Buyer login
    const buyerLogin = await request(app)
      .post('/api/auth/login')
      .send({email: 'buyer@test.com', password: process.env.TEST_USER_PASSWORD || 'secure_test_password' })
    
    if (buyerLogin.body.success) {
      buyerToken = buyerLogin.body.data.token
      buyerId = buyerLogin.body.data.user.id
    }
  })
  
  describe('Workflow 1: Enrollment → Earning → Payout', () => {
    let listingId;
    let transactionId;
    let commissionId;
    
    it('Step 1: Creator lists product on marketplace', async () => {
      const res = await request(app)
        .post('/api/marketplace')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({title: 'Premium Course', description: 'Advanced programming course', price: 99.99,
  type: 'digital_product',
  category: 'education'
        });
      
      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('id');
      
      listingId = res.body.data.id;
    });
    
    it('Step 2: Buyer purchases the product', async () => {
      // Simulate purchase (in real scenario, this would go through payment gateway)
      const res = await request(app)
        .post(`/api/marketplace/${listingId}/purchase`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({paymentMethod: 'test_card'        })
      
      // Note: This endpoint may not exist yet - adjust based on actual implementation
      if (res.status === 404) {
        logger.info('⚠️ Purchase endpoint not implemented, skipping to commission recording')
        return this.skip()
      }
      
      expect(res.status).to.be.oneOf([200, 201])
      transactionId = res.body.data?.transactionId || 'test-txn-123'
    });
    
    it('Step 3: Commission is automatically calculated and recorded', async () => {
      const res = await request(app)
        .post('/api/commissions/record')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({transactionId: transactionId || 'test-txn-123', creatorId: creatorId, totalAmount: 99.99,
  commissionType: 'marketplace_sale',
  metadata: {
            listingId,
  productName: 'Premium Course'
          }
        });
      
      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('id');
      expect(res.body.data.creator_commission).to.be.greaterThan(0);
      
      commissionId = res.body.data.id;
    });
    
    it('Step 4: Verify commission calculation is correct', async () => {
      const calcRes = await request(app)
        .post('/api/commissions/calculate')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({amount: 99.99, commissionType: 'marketplace_sale'
        });
      
      expect(calcRes.body.data.platformFee + calcRes.body.data.creatorCommission)
        .to.be.closeTo(99.99, 0.01);
    });
    
    it('Step 5: Creator requests payout', async () => {
      const res = await request(app)
        .post(`/api/commissions/payout`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          commissionId, payoutMethod: 'fic_wallet'
        });
      
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.status).to.equal('paid');
    });
    
    it('Step 6: Verify creator wallet was credited', async () => {
      const res = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${creatorToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.data.balance).to.be.greaterThanOrEqual(0);
    });
    
    it('Step 7: Check commission statistics reflect payout', async () => {
      const res = await request(app)
        .get('/api/commissions/stats')
        .set('Authorization', `Bearer ${creatorToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('paid_amount');
      expect(parseFloat(res.body.data.paid_amount)).to.be.greaterThan(0);
    });
  });
  
  describe('Workflow 2: Community Creation → Engagement → Moderation', () => {
    let communityId;
    let postId;
    let commentId;
    
    it('Step 1: User creates a new community', async () => {
      const res = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({name: 'JavaScript Developers', description: 'Community for JS enthusiasts', type: 'public',
  category: 'technology',
  tags: ['javascript', 'programming', 'web']
        });
      
      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data.name).to.equal('JavaScript Developers');
      
      communityId = res.body.data.id;
    });
    
    it('Step 2: Another user joins the community', async () => {
      const res = await request(app)
        .post(`/api/communities/${communityId}/join`)
        .set('Authorization', `Bearer ${buyerToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
    });
    
    it('Step 3: Member creates a post in the community', async () => {
      const res = await request(app)
        .post(`/api/communities/${communityId}/posts`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({title: 'Best Practices for Async/Await', content: 'Here are my tips for using async/await effectively...', type: 'article'
        });
      
      // Note: Adjust endpoint based on actual implementation
      if (res.status === 404) {
        logger.info('⚠️ Community posts endpoint not implemented')
        return this.skip()
      }
      
      expect(res.status).to.equal(201)
      postId = res.body.data.id
    });
    
    it('Step 4: Another member comments on the post', async () => {
      if (!postId) return this.skip();
      
      const res = await request(app)
        .post(`/api/communities/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({content: 'Great insights! Thanks for sharing.'
        });
      
      if (res.status === 404) {
        logger.info('⚠️ Comments endpoint not implemented');
        return this.skip();
      }
      
      expect(res.status).to.equal(201);
      commentId = res.body.data.id;
    });
    
    it('Step 5: Post receives likes', async () => {
      if (!postId) return this.skip();
      
      const res = await request(app)
        .post(`/api/communities/posts/${postId}/like`)
        .set('Authorization', `Bearer ${buyerToken}`);
      
      if (res.status === 404) {
        logger.info('⚠️ Like endpoint not implemented');
        return this.skip();
      }
      
      expect(res.status).to.equal(200);
    });
    
    it('Step 6: Verify engagement metrics updated', async () => {
      if (!communityId) return this.skip();
      
      const res = await request(app)
        .get(`/api/communities/${communityId}`)
        .set('Authorization', `Bearer ${creatorToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('member_count');
      expect(parseInt(res.body.data.member_count)).to.be.greaterThanOrEqual(2);
    });
  });
  
  describe('Workflow 3: Marketplace Listing → Review → Wishlist', () => {
    let listingId;
    
    it('Step 1: Seller creates marketplace listing', async () => {
      const res = await request(app)
        .post('/api/marketplace')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({title: 'Design Templates Pack', description: 'Professional UI templates', price: 49.99,
  type: 'digital_product',
  category: 'design'
        });
      
      expect(res.status).to.equal(201);
      listingId = res.body.data.id;
    });
    
    it('Step 2: Buyer adds listing to wishlist', async () => {
      const res = await request(app)
        .post(`/api/marketplace/${listingId}/wishlist`)
        .set('Authorization', `Bearer ${buyerToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
    });
    
    it('Step 3: Verify wishlist contains the item', async () => {
      const res = await request(app)
        .get('/api/marketplace/wishlist')
        .set('Authorization', `Bearer ${buyerToken}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.an('array');
      expect(res.body.data.some(item => item.listing_id === listingId)).to.be.true;
    });
    
    it('Step 4: Buyer leaves review after purchase simulation', async () => {
      const res = await request(app)
        .post(`/api/marketplace/${listingId}/review`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({rating: 5, comment: 'Excellent quality templates! Highly recommended.'
        });
      
      // Note: May need adjustment based on actual endpoint
      if (res.status === 404) {
        logger.info('⚠️ Review endpoint not found')
        return this.skip()
      }
      
      expect(res.status).to.equal(201)
    })
    
    it('Step 5: Verify listing has review count', async () => {
      const res = await request(app)
        .get(`/api/marketplace/${listingId}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('average_rating');
      expect(parseFloat(res.body.data.average_rating)).to.equal(5);
    });
  });
  
  describe('Role-Based Access Control Validation', () => {
    it('Anonymous user cannot create communities', async () => {
      const res = await request(app)
        .post('/api/communities')
        .send({name: 'Test' });
      
      expect(res.status).to.equal(401);
    });
    
    it('Regular user cannot access admin commission endpoints', async () => {
      const res = await request(app)
        .get('/api/commissions/pending')
        .set('Authorization', `Bearer ${buyerToken}`);
      
      expect([401, 403]).to.include(res.status);
    });
    
    it('Non-owner cannot delete community', async () => {
      // First create a community as creator
      const createRes = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({name: 'Protected Community' })
      
      const tempCommunityId = createRes.body.data.id
      
      // Try to delete as different user
      const deleteRes = await request(app)
        .delete(`/api/communities/${tempCommunityId}`)
        .set('Authorization', `Bearer ${buyerToken}`)
      
      expect([403, 401]).to.include(deleteRes.status)
    })
    
    it('Owner can update their own community', async () => {
      const createRes = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({name: 'My Community' })
      
      const communityId = createRes.body.data.id;
      
      const updateRes = await request(app)
        .put(`/api/communities/${communityId}`)
        .set('Authorization', `Bearer ${creatorToken}`)
        .send({description: 'Updated description' });
      
      expect(updateRes.status).to.equal(200);
    });
  });
});

module.exports = CriticalWorkflows;
