/**
 * Comprehensive Unit Tests for Universal UGC Member Privacy Control Framework
 * FingerMobile Protocol™
 * Tests all 8 privacy controllers: ReviewController, CommentsController, ShareController, TagController, SaveController, DownloadController, VisibilityController, DurationController
 */

const ugcPrivacyService = require('../../services/ugcPrivacyService');

describe('Universal UGC Member Privacy Control Suite', () => {

  describe('UGCPrivacyService Core Logic', () => {
    test('getPrivacySettings should return default privacy configuration for unconfigured content', async () => {
      const settings = await ugcPrivacyService.getPrivacySettings('post', 'test_post_101');
      expect(settings).toBeDefined();
      expect(settings.allow_reviews).toBe('everyone');
      expect(settings.allow_comments).toBe('everyone');
      expect(settings.allow_sharing).toBe('everyone');
      expect(settings.allow_tagging).toBe('everyone');
      expect(settings.allow_saving).toBe('everyone');
      expect(settings.allow_download).toBe('everyone');
      expect(settings.visibility).toBe('public');
      expect(settings.duration_type).toBe('permanent');
    });

    test('checkPermission should allow creator/owner full permission regardless of privacy toggles', async () => {
      const spy = jest.spyOn(ugcPrivacyService, 'getPrivacySettings').mockResolvedValueOnce({
        owner_id: '99',
        allow_reviews: 'none',
        allow_comments: 'none',
        visibility: 'private'
      });

      const perm = await ugcPrivacyService.checkPermission('post', 'test_post_101', '99', 'comment');
      expect(perm.allowed).toBe(true);
      expect(perm.reason).toContain('Owner permission');
      spy.mockRestore();
    });

    test('checkPermission should deny action when setting is none for non-owner', async () => {
      const spy = jest.spyOn(ugcPrivacyService, 'getPrivacySettings').mockResolvedValueOnce({
        owner_id: '99',
        allow_reviews: 'none',
        allow_comments: 'none',
        allow_sharing: 'followers',
        visibility: 'public'
      });

      const perm = await ugcPrivacyService.checkPermission('post', 'test_post_101', '100', 'comment');
      expect(perm.allowed).toBe(false);
      expect(perm.reason).toContain('disabled comments');
      spy.mockRestore();
    });

    test('checkPermission should deny view if duration is expired', async () => {
      const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
      const spy = jest.spyOn(ugcPrivacyService, 'getPrivacySettings').mockResolvedValueOnce({
        owner_id: '99',
        expires_at: pastDate,
        visibility: 'public'
      });

      const perm = await ugcPrivacyService.checkPermission('post', 'test_post_101', '100', 'view');
      expect(perm.allowed).toBe(false);
      expect(perm.reason).toContain('expired');
      spy.mockRestore();
    });
  });

  describe('ReviewController', () => {
    const ReviewController = require('../../controllers/ReviewController');

    test('createReview should reject if allow_reviews is none', async () => {
      const spy = jest.spyOn(ugcPrivacyService, 'checkPermission').mockResolvedValueOnce({
        allowed: false,
        reason: 'Owner has disabled reviews on this content'
      });

      const req = {
        user: { id: '100' },
        params: { contentType: 'post', contentId: 'post_123' },
        body: { rating: 5, reviewText: 'Awesome!' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ReviewController.createReview(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('disabled reviews')
      }));

      spy.mockRestore();
    });
  });

  describe('CommentsController', () => {
    const CommentsController = require('../../controllers/CommentsController');

    test('createComment should reject if allow_comments is none', async () => {
      const spy = jest.spyOn(ugcPrivacyService, 'checkPermission').mockResolvedValueOnce({
        allowed: false,
        reason: 'Owner has disabled comments on this content'
      });

      const req = {
        user: { id: '100' },
        params: { contentType: 'post', contentId: 'post_123' },
        body: { commentText: 'Nice post!' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CommentsController.createComment(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));

      spy.mockRestore();
    });
  });

  describe('ShareController', () => {
    const ShareController = require('../../controllers/ShareController');

    test('shareContent should reject if allow_sharing is none', async () => {
      const spy = jest.spyOn(ugcPrivacyService, 'checkPermission').mockResolvedValueOnce({
        allowed: false,
        reason: 'Owner has disabled shares on this content'
      });

      const req = {
        user: { id: '100' },
        params: { contentType: 'track', contentId: 'track_456' },
        body: { platform: 'twitter' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ShareController.shareContent(req, res);
      expect(res.status).toHaveBeenCalledWith(403);

      spy.mockRestore();
    });
  });

  describe('TagController', () => {
    const TagController = require('../../controllers/TagController');

    test('addTag should reject if allow_tagging is none', async () => {
      const spy = jest.spyOn(ugcPrivacyService, 'checkPermission').mockResolvedValueOnce({
        allowed: false,
        reason: 'Owner has disabled tags on this content'
      });

      const req = {
        user: { id: '100' },
        params: { contentType: 'video', contentId: 'video_789' },
        body: { taggedUserId: '105' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await TagController.addTag(req, res);
      expect(res.status).toHaveBeenCalledWith(403);

      spy.mockRestore();
    });
  });

  describe('SaveController', () => {
    const SaveController = require('../../controllers/SaveController');

    test('saveContent should reject if allow_saving is none', async () => {
      const spy = jest.spyOn(ugcPrivacyService, 'checkPermission').mockResolvedValueOnce({
        allowed: false,
        reason: 'Owner has disabled saves on this content'
      });

      const req = {
        user: { id: '100' },
        params: { contentType: 'blog', contentId: 'blog_101' },
        body: { collectionName: 'Favorites' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await SaveController.saveContent(req, res);
      expect(res.status).toHaveBeenCalledWith(403);

      spy.mockRestore();
    });
  });

  describe('DownloadController', () => {
    const DownloadController = require('../../controllers/DownloadController');

    test('requestDownload should reject if allow_download is none', async () => {
      const spy = jest.spyOn(ugcPrivacyService, 'checkPermission').mockResolvedValueOnce({
        allowed: false,
        reason: 'Owner has disabled downloads on this content'
      });

      const req = {
        user: { id: '100' },
        params: { contentType: 'track', contentId: 'track_999' },
        body: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await DownloadController.requestDownload(req, res);
      expect(res.status).toHaveBeenCalledWith(403);

      spy.mockRestore();
    });
  });

  describe('VisibilityController', () => {
    const VisibilityController = require('../../controllers/VisibilityController');

    test('updateVisibility should reject invalid visibility value', async () => {
      const req = {
        user: { id: '100' },
        params: { contentType: 'post', contentId: 'post_123' },
        body: { visibility: 'invalid_mode' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await VisibilityController.updateVisibility(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('DurationController', () => {
    const DurationController = require('../../controllers/DurationController');

    test('updateDuration should reject invalid duration option', async () => {
      const req = {
        user: { id: '100' },
        params: { contentType: 'post', contentId: 'post_123' },
        body: { durationType: 'invalid_duration' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await DurationController.updateDuration(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

});
