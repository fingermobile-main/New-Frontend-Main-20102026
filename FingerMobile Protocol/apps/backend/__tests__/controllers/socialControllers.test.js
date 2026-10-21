/**
 * Unit Tests for Social Controllers (Likes, Connections, Followers)
 *,
Date: June 11, 2026
 */

const request = require('supertest');
const express = require('express');

jest.mock('../../db', () => ({
  pool: { query: jest.fn() },
  query: jest.fn()
}));

const likesController = require('../../controllers/likesController');
const connectionsController = require('../../controllers/connectionsController');

const { pool } = require('../../db');

describe('Social Controllers Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.user = { id: 'test-user-id' };
      next();
    });
    jest.clearAllMocks();
  });

  describe('Likes Controller', () => {
    beforeEach(() => {
      app.post('/api/likes/:targetType/:targetId', likesController.like.bind(likesController));
      app.delete('/api/likes/:targetType/:targetId', likesController.unlike.bind(likesController));
      app.get('/api/likes/:targetType/:targetId/count', likesController.getLikeCount.bind(likesController));
    });

    it('should like a target', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).post('/api/likes/post/post-123');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should unlike a target', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const response = await request(app).delete('/api/likes/post/post-123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should get like count', async () => {
      const mockCount = { rows: [{ count: 42 }] };
      pool.query.mockResolvedValue(mockCount);

      const response = await request(app).get('/api/likes/post/post-123/count');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBe(42);
    });
  });

  describe('Connections Controller', () => {
    beforeEach(() => {
      const conn = connectionsController.sendRequest ? connectionsController : (connectionsController.default || connectionsController);
      app.post('/api/connections/request', conn.sendRequest.bind(conn));
      app.post('/api/connections/:id/accept', conn.acceptRequest.bind(conn));
      app.post('/api/connections/:id/reject', conn.rejectRequest.bind(conn));
      app.get('/api/connections/my-connections', conn.getMyConnections.bind(conn));
    });

    it('should send connection request', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/connections/request')
        .send({ user_id: 'user-456' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should accept connection request', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).post('/api/connections/conn-123/accept');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject connection request', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).post('/api/connections/conn-123/reject');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should get my connections', async () => {
      const mockConnections = { rows: [
          { user_id: 'user-1',
username: 'john_doe',
connected_at: new Date() }
        ]
      };
      pool.query.mockResolvedValue(mockConnections);

      const response = await request(app).get('/api/connections/my-connections');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });
});
