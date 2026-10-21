jest.mock('../../db', () => ({
  contentDb: {
    query: jest.fn()
  },
  socialDb: {
    query: jest.fn()
  },
  identityDb: {
    query: jest.fn()
  }
}));

const { identityDb, contentDb, socialDb } = require('../../db');
const liveStreamController = require('../../controllers/LiveStreamController');

describe('Live Stream Controller Suite', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      member: { id: '00000000-0000-0000-0000-000000000001' },
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createLiveStream', () => {
    it('should reject request without title', async () => {
      req.body = { title: '' };
      await liveStreamController.createLiveStream(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should create new live stream when permissions check passes', async () => {
      req.body = { title: 'Gaming Stream', category: 'gaming' };

      // Mock permissions check
      identityDb.query.mockResolvedValueOnce({ rows: [{ role: 'creator', account_status: 'active' }] });
      contentDb.query.mockResolvedValueOnce({ rows: [] }); // active streams check
      contentDb.query.mockResolvedValueOnce({
        rows: [{ id: 1, title: 'Gaming Stream', stream_key: 'sk_live_123', status: 'pending' }]
      });
      socialDb.query.mockResolvedValueOnce({ rowCount: 1 });

      await liveStreamController.createLiveStream(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Live stream created successfully'
        })
      );
    });
  });

  describe('getActiveStreams', () => {
    it('should return list of active live streams', async () => {
      contentDb.query
        .mockResolvedValueOnce({
          rows: [{ id: 1, title: 'Live Music', status: 'live', viewer_count: 15 }]
        })
        .mockResolvedValueOnce({
          rows: [{ total: '1' }]
        });

      await liveStreamController.getActiveStreams(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array)
        })
      );
    });
  });
});

