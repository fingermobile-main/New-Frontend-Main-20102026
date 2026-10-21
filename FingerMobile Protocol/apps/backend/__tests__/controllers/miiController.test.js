/**
 * Unit & Integration Tests for Mii Persona & Avatar Engine
 * FingerMobile Protocol™
 */

const miiController = require('../../controllers/miiController');

describe('Mii Persona & Avatar Engine Unit & Integration Suite', () => {

  describe('MiiController Endpoints', () => {
    test('getUserAvatars should enforce authentication', async () => {
      const req = { params: {}, user: null };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await miiController.getUserAvatars(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('createAvatar should require authenticated user', async () => {
      const req = { user: null, body: { base_model: 'standard_v1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await miiController.createAvatar(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

});
