// Mock the controlDb module
jest.mock('../../db/db', () => ({
  controlDb: {
    query: jest.fn(),
  },
}));

// Mock the logger
jest.mock('../../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

const { getRateLimits, updateRateLimit } = require('../../controllers/adminRateLimitController');
const { controlDb } = require('../../db/db');

// Mock the logger
jest.mock('../../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('adminRateLimitController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getRateLimits', () => {
    it('should fetch and return rate limits', async () => {
      const mockLimits = [
        { id: 1, name: 'Global API', max_requests: 100 },
      ];
      controlDb.query.mockResolvedValueOnce({ rows: mockLimits });

      await getRateLimits(mockReq, mockRes);

      expect(controlDb.query).toHaveBeenCalledWith('SELECT * FROM rate_limit_configs ORDER BY created_at DESC');
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, limits: mockLimits });
    });

    it('should return 500 on db error', async () => {
      controlDb.query.mockRejectedValueOnce(new Error('DB Error'));

      await getRateLimits(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Server error fetching rate limits' });
    });
  });

  describe('updateRateLimit', () => {
    it('should create a new rate limit if no id provided', async () => {
      mockReq.body = {
        name: 'New Limit',
        endpoint_pattern: '/api/new',
        max_requests: 50,
        window_ms: 60000,
      };

      const mockCreatedLimit = { id: 2, ...mockReq.body };
      controlDb.query.mockResolvedValueOnce({ rows: [mockCreatedLimit] });

      await updateRateLimit(mockReq, mockRes);

      expect(controlDb.query).toHaveBeenCalledWith(
        'INSERT INTO rate_limit_configs (name, description, endpoint_pattern, max_requests, window_ms, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        ['New Limit', '', '/api/new', 50, 60000, true]
      );
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, limit: mockCreatedLimit });
    });

    it('should update an existing rate limit if id provided', async () => {
      mockReq.body = {
        id: 1,
        name: 'Updated Limit',
        max_requests: 200,
      };

      const mockUpdatedLimit = { id: 1, name: 'Updated Limit', max_requests: 200 };
      controlDb.query.mockResolvedValueOnce({ rowCount: 1, rows: [mockUpdatedLimit] });

      await updateRateLimit(mockReq, mockRes);

      expect(controlDb.query).toHaveBeenCalledWith(
        'UPDATE rate_limit_configs SET name = COALESCE($1, name), description = COALESCE($2, description), endpoint_pattern = COALESCE($3, endpoint_pattern), max_requests = COALESCE($4, max_requests), window_ms = COALESCE($5, window_ms), is_active = COALESCE($6, is_active), updated_at = NOW() WHERE id = $7 RETURNING *',
        ['Updated Limit', undefined, undefined, 200, undefined, undefined, 1]
      );
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, limit: mockUpdatedLimit });
    });

    it('should return 404 if updating non-existent rate limit', async () => {
      mockReq.body = { id: 999, max_requests: 10 };
      controlDb.query.mockResolvedValueOnce({ rowCount: 0 });

      await updateRateLimit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Rate limit configuration not found' });
    });

    it('should return 500 on db error', async () => {
      mockReq.body = { id: 1, max_requests: 10 };
      controlDb.query.mockRejectedValueOnce(new Error('DB Error'));

      await updateRateLimit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Server error updating rate limit' });
    });
  });
});
