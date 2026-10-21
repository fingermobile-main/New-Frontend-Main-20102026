/**
 * Unit & Integration Tests for Groups & Circles Community Infrastructure
 * FingerMobile Protocol™
 */

const GroupController = require('../../controllers/GroupController');

describe('Groups & Circles Community Unit & Integration Suite', () => {

  describe('GroupController Endpoints', () => {
    test('create should require authenticated user', async () => {
      const req = { user: null, body: { name: 'Tech Circle' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await GroupController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('join should require authenticated user', async () => {
      const req = { user: null, params: { groupId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await GroupController.join(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('leave should require authenticated user', async () => {
      const req = { user: null, params: { groupId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await GroupController.leave(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

});
