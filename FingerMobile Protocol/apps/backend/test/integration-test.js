/**
 * Integration test to verify that all components of the Advanced Feedback Anticipation Algorithm work together
 */

const logger = require('../utils/logger'); // Import logger
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported from server.js
const User = require('../models/User');
const { Hallmark, UserHallmark } = require('../models/Hallmark');
const Gem = require('../models/Gem');

describe('Advanced Feedback Anticipation Algorithm - Integration Tests', () => {
  let server;
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect(process.env.TEST_DB_URI || 'mongodb://localhost:27017/test_fingermobile', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Create a test user and get auth token
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'secure_test_password',
      firstName: 'Test',
      lastName: 'User',
      isActive: true
    });

    await testUser.save();
    testUserId = testUser._id;

    // In a real scenario, you would need to implement proper authentication
    // For this test, we'll assume we have a way to generate a token
    // authToken = generateTestToken(testUser._id);
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({
      username: 'testuser'
    });
    await Gem.deleteMany({
      userId: testUserId
    });
    await UserHallmark.deleteMany({
      userId: testUserId
    });
    await Hallmark.deleteMany({
      name: /Test/
    });

    await server.close();
    await mongoose.connection.close();
  });

  describe('Gems System', () => {
    test('Should create proof of play gems', async () => {
      const response = await request(app)
        .post('/api/gems/proof-of-play')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          trackId: 'test-track-id',
          listenDurationSeconds: 120, // 2 minutes of listening
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.gemsEarned).toBeDefined();
      expect(response.body.data.gem.type).toBe('proof_of_play');
    });

    test('Should create curation gems', async () => {
      const response = await request(app)
        .post('/api/gems/curation')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          playlistId: 'test-playlist-id',
          uniqueListeners: 1500, // Over the 1000 threshold
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.gemsEarned).toBeDefined();
      expect(response.body.data.gem.type).toBe('curation');
    });

    test('Should get user gems history', async () => {
      const response = await request(app)
        .get('/api/gems/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.gems)).toBe(true);
    });

    test('Should get user total gems', async () => {
      const response = await request(app)
        .get('/api/gems/total')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(typeof response.body.data.totalGems).toBe('number');
    });
  });

  describe('Hallmarks System', () => {
    let testHallmarkId;

    test('Should create a new hallmark (admin)', async () => {
      // Note: This test assumes you have a way to authenticate as an admin
      const response = await request(app)
        .post('/api/hallmarks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Hallmark',
          description: 'A test hallmark for integration testing',
          rarity: 'common',
          category: 'achievement'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Hallmark');
      testHallmarkId = response.body.data._id;
    });

    test('Should award a hallmark to a user (admin)', async () => {
      const response = await request(app)
        .post('/api/hallmarks/award')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testUserId.toString(),
          hallmarkId: testHallmarkId,
          reason: 'Testing purposes'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe(testUserId.toString());
    });

    test('Should get user hallmarks', async () => {
      const response = await request(app)
        .get(`/api/hallmarks/user/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Content Moderation', () => {
    test('Should assess content risk', async () => {
      const response = await request(app)
        .post('/api/moderation/assess-content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a test content for risk assessment',
          contentType: 'Post',
          contentId: 'test-content-id'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(typeof response.body.data.riskScore).toBe('number');
      expect(['low', 'medium', 'high', 'critical']).toContain(response.body.data.riskCategory);
    });

    test('Should request data portability', async () => {
      const response = await request(app)
        .post('/api/moderation/data-portability/request')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requestId).toBeDefined();
    });

    test('Should get compliance health', async () => {
      const response = await request(app)
        .get('/api/moderation/compliance-health')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.overallCompliance).toBeDefined();
    });
  });

  describe('Platform Compatibility', () => {
    test('Should get platform-specific settings', async () => {
      const response = await request(app)
        .get('/api/gems/platform-settings')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Platform', 'web')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.platform).toBe('web');
      expect(response.body.data.cognitiveLoadThresholds).toBeDefined();
      expect(response.body.data.antiBotThresholds).toBeDefined();
    });
  });
});

logger.info('Integration test file created. This test suite verifies that all components of the Advanced Feedback Anticipation Algorithm work together.');
