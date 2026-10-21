/**
 * NexusGNN API Integration Tests
 * Testing complete API endpoints with database
 *,
Date: June 12, 2026
 */

const request = require('supertest');
const app = require('../app');
const { pool } = require('../db');

describe('NexusGNN API Integration Tests', () => {
  let authToken;
  let testUserId;
  let testContentId;

  beforeAll(async () => {
    // Setup test user and content
    const userResult = await pool.query(
      `INSERT INTO users (username, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      ['testuser_nexusgnn', 'test@nexusgnn.com', 'hashed_password']
    );
    testUserId = userResult.rows[0].id;

    const contentResult = await pool.query(
      `INSERT INTO posts (author_id, title, content, category) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [testUserId, 'Test Post', 'Test content for NexusGNN', 'technology']
    );
    testContentId = contentResult.rows[0].id;

    // Get auth token (simplified - use your actual auth mechanism)
    const authResponse = await request(app)
      .post('/api/auth/login')
      .send({email: 'test@nexusgnn.com',
  password: process.env.TEST_USER_PASSWORD || 'secure_test_password' })
    
    authToken = authResponse.body.token || 'test-token'
  })

  afterAll(async () => {
    // Cleanup test data
    await pool.query('DELETE FROM nexusgnn_graph_nodes WHERE entity_id = $1', [testUserId])
    await pool.query('DELETE FROM posts WHERE id = $1', [testContentId])
    await pool.query('DELETE FROM users WHERE id = $1', [testUserId])
  })

  describe('POST /api/nexusgnn/match', () => {
    it('should find matches for authenticated user', async () => {
      const response = await request(app)
        .post('/api/nexusgnn/match')
        .set('Authorization', `Bearer ${authToken}`)
        .send({contentType: 'post',
  limit: 10
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('matches');
      expect(Array.isArray(response.body.data.matches)).toBe(true);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .post('/api/nexusgnn/match')
        .send({contentType: 'post',
  limit: 10 });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should validate request parameters', async () => {
      const response = await request(app)
        .post('/api/nexusgnn/match')
        .set('Authorization', `Bearer ${authToken}`)
        .send({contentType: 'post',
  limit: 150 // Exceeds maximum
        })

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/nexusgnn/recommendations/:userId', () => {
    it('should get recommendations for a user', async () => {
      const response = await request(app)
        .get(`/api/nexusgnn/recommendations/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({contentType: 'post',
  limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('recommendations');
      expect(response.body.data.userId).toBe(testUserId);
    });
  });

  describe('POST /api/nexusgnn/content/:id/lifecycle', () => {
    it('should update content lifecycle', async () => {
      const response = await request(app)
        .post(`/api/nexusgnn/content/${testContentId}/lifecycle`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({contentType: 'post',
  metrics: {
  impressions: 100,
  saves: 15,
  shares: 8,
  value_sentiment_score: 0.7
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.lifecycle).toHaveProperty('current_phase');
    });

    it('should validate metrics object', async () => {
      const response = await request(app)
        .post(`/api/nexusgnn/content/${testContentId}/lifecycle`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          contentType: 'post',
          metrics: { 
            impressions: 100
            // Missing required fields: saves, shares
          }
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  });

  describe('GET /api/nexusgnn/graph/analytics', () => {
    it('should retrieve graph analytics', async () => {
      const response = await request(app)
        .get('/api/nexusgnn/graph/analytics')
        .set('Authorization', `Bearer ${authToken}`)
        .query({timeRange: '7 days' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('nodes');
      expect(response.body.data).toHaveProperty('edges');
      expect(response.body.data).toHaveProperty('lifecycleDistribution');
    });
  });

  describe('POST /api/nexusgnn/graph/node', () => {
    it('should create a graph node', async () => {
      const response = await request(app)
        .post('/api/nexusgnn/graph/node')
        .set('Authorization', `Bearer ${authToken}`)
        .send({entityType: 'user',
  entityId: testUserId,
  metadata: { test: true }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.node).toHaveProperty('id');
      expect(response.body.data.node.entity_id).toBe(testUserId);
    });
  });

  describe('POST /api/nexusgnn/graph/edge', () => {
    it('should create a graph edge', async () => {
      // First create two nodes
      await request(app)
        .post('/api/nexusgnn/graph/node')
        .set('Authorization', `Bearer ${authToken}`)
        .send({entityType: 'user',
  entityId: testUserId })

      await request(app)
        .post('/api/nexusgnn/graph/node')
        .set('Authorization', `Bearer ${authToken}`)
        .send({entityType: 'post',
  entityId: testContentId })

      const response = await request(app)
        .post('/api/nexusgnn/graph/edge')
        .set('Authorization', `Bearer ${authToken}`)
        .send({sourceEntityId: testUserId,
  targetEntityId: testContentId,
  edgeType: 'high_intent_functional',
  edgeSubtype: 'save',
  weight: 0.9
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true);
      expect(response.body.data.edge).toHaveProperty('id');
    });
  });

  describe('GET /api/nexusgnn/score/:userId/:contentId', () => {
    it('should calculate match score', async () => {
      const response = await request(app)
        .get(`/api/nexusgnn/score/${testUserId}/${testContentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({contentType: 'post' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.score).toHaveProperty('finalScore');
      expect(response.body.data.score.finalScore).toBeGreaterThanOrEqual(0);
      expect(response.body.data.score.finalScore).toBeLessThanOrEqual(1);
    });

    it('should return cached score on second request', async () => {
      // First request - calculate
      await request(app)
        .get(`/api/nexusgnn/score/${testUserId}/${testContentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({contentType: 'post' })

      // Second request - should be cached
      const response = await request(app)
        .get(`/api/nexusgnn/score/${testUserId}/${testContentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({contentType: 'post' })

      expect(response.status).toBe(200)
      expect(response.body.cached).toBe(true)
    })
  });

  describe('GET /api/nexusgnn/serendipity/:userId', () => {
    it('should get serendipity content', async () => {
      const response = await request(app)
        .get(`/api/nexusgnn/serendipity/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('content');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on match endpoint', async () => {
      const promises = [];
      for (let i = 0; i < 35; i++) {
        promises.push(
          request(app)
            .post('/api/nexusgnn/match')
            .set('Authorization', `Bearer ${authToken}`)
            .send({contentType: 'post',
  limit: 5 })
        );
      }

      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(r => r.status === 429);

      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
