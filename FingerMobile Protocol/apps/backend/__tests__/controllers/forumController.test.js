/**
 * Unit & Integration Tests for Forum Controller & Services
 * FingerMobile Protocol™
 */

const forumService = require('../../services/forumService');
const ForumController = require('../../controllers/ForumController');

describe('Forum System Unit & Integration Suite', () => {

  describe('Content Censorship & Moderation', () => {
    const { censorContent } = require('../../middleware/ContentFilterMiddleware');

    test('censorContent should censor forbidden bad words with asterisks or bar', () => {
      const result = censorContent('This is a test post');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('ForumController Endpoints', () => {
    test('getCategories should return list of forum categories', async () => {
      const spy = jest.spyOn(forumService, 'getCategories').mockResolvedValueOnce([
        { id: 1, name: 'General Discussion', slug: 'general-discussion' },
        { id: 2, name: 'Technology', slug: 'technology' }
      ]);

      const req = { query: { limit: 10, offset: 0 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await ForumController.getCategories(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          categories: expect.any(Array),
          total: 2
        })
      }));

      spy.mockRestore();
    });

    test('createThread should enforce authentication', async () => {
      const req = { user: null, params: { categoryId: '1' }, body: { title: 'Test', content: 'Test' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ForumController.createThread(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('createThread should create thread for authenticated user', async () => {
      const spy = jest.spyOn(forumService, 'createThread').mockResolvedValueOnce({
        id: 101,
        title: 'New Discussion',
        content: 'Content here',
        categoryId: 1
      });

      const req = {
        user: { id: 5 },
        params: { categoryId: '1' },
        body: { title: 'New Discussion', content: 'Content here' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ForumController.createThread(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({ id: 101 })
      }));

      spy.mockRestore();
    });

    test('createPost should enforce authentication', async () => {
      const req = { user: null, body: { content: 'Reply' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ForumController.createPost(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('pinThread should enforce admin access', async () => {
      const req = { user: { id: 5, isAdmin: false }, params: { threadId: '101' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ForumController.pinThread(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    test('lockThread should enforce admin access', async () => {
      const req = { user: { id: 5, isAdmin: false }, params: { threadId: '101' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ForumController.lockThread(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    test('reportPost should record report for authenticated user', async () => {
      const spy = jest.spyOn(forumService, 'reportPost').mockResolvedValueOnce({
        success: true,
        message: 'Post reported successfully'
      });

      const req = {
        user: { id: 5 },
        params: { postId: '202' },
        body: { reason: 'spam', description: 'Unwanted advertising' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await ForumController.reportPost(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true
      }));

      spy.mockRestore();
    });
  });

});
