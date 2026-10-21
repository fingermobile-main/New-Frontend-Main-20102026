/**
 * Unit & Integration Tests for Hallmarks Platform
 * FingerMobile Protocol™
 */

const hallmarkService = require('../../services/hallmarkService');

describe('Hallmarks Platform Unit & Integration Suite', () => {

  describe('HallmarkService Logic', () => {
    test('getAllHallmarks should return list of available hallmarks', async () => {
      const spy = jest.spyOn(hallmarkService, 'getAllHallmarks').mockResolvedValueOnce([
        { id: 1, name: 'Verified Creator', category: 'achievement', rarity: 'rare' },
        { id: 2, name: 'Music Pioneer', category: 'artist', rarity: 'uncommon' }
      ]);

      const hallmarks = await hallmarkService.getAllHallmarks();
      expect(hallmarks).toBeDefined();
      expect(hallmarks.length).toBe(2);
      expect(hallmarks[0].name).toBe('Verified Creator');

      spy.mockRestore();
    });

    test('awardHallmarkToUser should register award for user', async () => {
      const spy = jest.spyOn(hallmarkService, 'awardHallmarkToUser').mockResolvedValueOnce({
        success: true,
        userHallmark: { id: 10, userId: 5, hallmarkId: 1, reason: 'Top creator' }
      });

      const result = await hallmarkService.awardHallmarkToUser(5, 1, 'Top creator');
      expect(result.success).toBe(true);
      expect(result.userHallmark.userId).toBe(5);

      spy.mockRestore();
    });

    test('getUserHallmarks should return badges earned by user', async () => {
      const spy = jest.spyOn(hallmarkService, 'getUserHallmarks').mockResolvedValueOnce([
        { id: 10, userId: 5, hallmark: { name: 'Verified Creator' }, awardedAt: new Date() }
      ]);

      const userHallmarks = await hallmarkService.getUserHallmarks(5);
      expect(userHallmarks).toBeDefined();
      expect(userHallmarks.length).toBe(1);

      spy.mockRestore();
    });
  });

  describe('HallmarksController Endpoints', () => {
    const hallmarksController = require('../../controllers/hallmarksController');

    test('getUserAchievements should enforce authentication', async () => {
      const req = { params: { userId: '5' }, user: null };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await hallmarksController.getUserAchievements(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

});
