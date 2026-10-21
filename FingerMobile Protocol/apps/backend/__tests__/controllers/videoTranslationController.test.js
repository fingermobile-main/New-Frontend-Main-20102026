const mockUploadVideo = jest.fn();
const mockGetTranslationStatus = jest.fn();
const mockGetUserVideos = jest.fn();
const mockGetAvailableLanguages = jest.fn();
const mockDeleteVideo = jest.fn();
const mockGetUserQuota = jest.fn();

jest.mock('../../services/videoTranslationService', () => ({
  uploadVideo: (...args) => mockUploadVideo(...args),
  getTranslationStatus: (...args) => mockGetTranslationStatus(...args),
  getUserVideos: (...args) => mockGetUserVideos(...args),
  getAvailableLanguages: (...args) => mockGetAvailableLanguages(...args),
  deleteVideo: (...args) => mockDeleteVideo(...args),
  getUserQuota: (...args) => mockGetUserQuota(...args)
}));

const videoTranslationController = require('../../controllers/videoTranslationController');

describe('Video Translation Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { id: '00000000-0000-0000-0000-000000000001' },
      body: {},
      params: {},
      query: {},
      file: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('uploadVideo', () => {
    it('should reject when no file is uploaded', async () => {
      await videoTranslationController.uploadVideo(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'No video file provided' })
      );
    });

    it('should handle video upload when file and target languages are provided', async () => {
      req.file = { originalname: 'sample.mp4', path: 'uploads/sample.mp4', mimetype: 'video/mp4' };
      req.body = { targetLanguages: '["es", "fr"]' };

      mockUploadVideo.mockResolvedValueOnce({
        success: true,
        processingId: 'proc_123',
        message: 'Video upload initiated'
      });

      await videoTranslationController.uploadVideo(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, processingId: 'proc_123' })
      );
    });
  });

  describe('getTranslationStatus', () => {
    it('should return translation status for a valid processing ID', async () => {
      req.params = { processingId: 'proc_123' };
      mockGetTranslationStatus.mockResolvedValueOnce({
        success: true,
        status: 'completed',
        progress: 100
      });

      await videoTranslationController.getTranslationStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'completed' })
      );
    });
  });

  describe('getAvailableLanguages', () => {
    it('should return list of available dubbing languages', async () => {
      mockGetAvailableLanguages.mockResolvedValueOnce({
        success: true,
        languages: [{ code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' }]
      });

      await videoTranslationController.getAvailableLanguages(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });
  });
});
