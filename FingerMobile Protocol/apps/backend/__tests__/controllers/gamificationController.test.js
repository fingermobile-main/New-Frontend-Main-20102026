/**
 * Unit Tests for Gamification Controller
 *,
Date: June 11, 2026
 */

const request = require('supertest');
const express = require('express');

// Mock database pool
jest.mock('../../db', () => ({
  pool: { query: jest.fn() },
  query: jest.fn()
}));

const gamificationController = require('../../controllers/gamificationController');
const { pool } = require('../../db');

const app = express()
app.use(express.json())

// Mock authentication middleware
app.use((req, res, next) => {
  req.user = { id: 'test-user-id' }
  next()
})

// Routes
app.get('/api/gamification/points', gamificationController.getUserPoints.bind(gamificationController))
app.post('/api/gamification/points/add', gamificationController.addPoints.bind(gamificationController))
app.get('/api/gamification/badges', gamificationController.getBadges.bind(gamificationController))
app.get('/api/gamification/user-badges', gamificationController.getUserBadges.bind(gamificationController))
app.get('/api/gamification/challenges', gamificationController.getChallenges.bind(gamificationController));
app.post('/api/gamification/challenges/:id/progress', gamificationController.updateChallengeProgress.bind(gamificationController));

describe('Gamification Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/gamification/points', () => {
    it('should return user points and level', async () => {
      const mockPoints = { rows: [{ points: 1500,
level: 5,
experience_points: 2500
        }]
      };

      pool.query.mockResolvedValue(mockPoints);

      const response = await request(app).get('/api/gamification/points');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.points).toBe(1500);
      expect(response.body.data.level).toBe(5);
    });

    it('should return default values if no points found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/gamification/points');

      expect(response.status).toBe(200);
      expect(response.body.data.points).toBe(0);
      expect(response.body.data.level).toBe(1);
    });
  });

  describe('POST /api/gamification/points/add', () => {
    it('should add points to user', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/gamification/points/add')
        .send({ points: 100,
reason: 'Completed challenge' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Points added');
    });

    it('should return 400 if points not provided', async () => {
      const response = await request(app)
        .post('/api/gamification/points/add')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/gamification/badges', () => {
    it('should return available badges', async () => {
      const mockBadges = { rows: [
          { id: '1',
name: 'First Post',
description: 'Created first post',
icon_url: '/icons/first.png' },
          { id: '2',
name: '100 Points',
description: 'Earned 100 points',
icon_url: '/icons/100.png' }
        ]
      };

      pool.query.mockResolvedValue(mockBadges);

      const response = await request(app).get('/api/gamification/badges');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe('GET /api/gamification/user-badges', () => {
    it('should return user earned badges', async () => {
      const mockUserBadges = { rows: [
          { badge_id: '1',
badge_name: 'First Post',
earned_at: new Date() }
        ]
      };

      pool.query.mockResolvedValue(mockUserBadges);

      const response = await request(app).get('/api/gamification/user-badges');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('GET /api/gamification/challenges', () => {
    it('should return active challenges', async () => {
      const mockChallenges = { rows: [
          { id: '1',
title: 'Daily Login',
reward_points: 10,
challenge_type: 'daily' }
        ]
      };

      pool.query.mockResolvedValue(mockChallenges);

      const response = await request(app).get('/api/gamification/challenges');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('POST /api/gamification/challenges/:id/progress', () => {
    it('should update challenge progress', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/gamification/challenges/challenge-123/progress')
        .send({ progress: 50 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
