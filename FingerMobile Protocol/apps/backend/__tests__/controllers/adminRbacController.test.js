// Mock the identityDb module
jest.mock('../../db/db', () => ({
  identityDb: {
    query: jest.fn(),
  },
}));

// Mock the logger to avoid console noise during tests
jest.mock('../../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

const { getRoles, assignRole, getPermissions } = require('../../controllers/adminRbacController');
const { identityDb } = require('../../db/db');

// Mock the logger to avoid console noise during tests
jest.mock('../../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('adminRbacController', () => {
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

  describe('getRoles', () => {
    it('should fetch and return roles', async () => {
      const mockRoles = [
        { id: '1', name: 'admin', level: 100 },
        { id: '2', name: 'user', level: 10 },
      ];
      identityDb.query.mockResolvedValueOnce({ rows: mockRoles });

      await getRoles(mockReq, mockRes);

      expect(identityDb.query).toHaveBeenCalledWith('SELECT * FROM roles ORDER BY level DESC');
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, roles: mockRoles });
    });

    it('should return 500 on db error', async () => {
      identityDb.query.mockRejectedValueOnce(new Error('DB Error'));

      await getRoles(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Server error fetching roles' });
    });
  });

  describe('getPermissions', () => {
    it('should fetch and return permissions', async () => {
      const mockPerms = [
        { id: '1', name: 'manage:users' },
      ];
      identityDb.query.mockResolvedValueOnce({ rows: mockPerms });

      await getPermissions(mockReq, mockRes);

      expect(identityDb.query).toHaveBeenCalledWith('SELECT * FROM permissions ORDER BY resource_type, action');
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, permissions: mockPerms });
    });

    it('should return 500 on db error', async () => {
      identityDb.query.mockRejectedValueOnce(new Error('DB Error'));

      await getPermissions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Server error fetching permissions' });
    });
  });

  describe('assignRole', () => {
    it('should return 400 if userId or role is missing', async () => {
      mockReq.body = { userId: 1 }; // missing role

      await assignRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'UserId and role are required' });
    });

    it('should return 404 if user not found', async () => {
      mockReq.body = { userId: 999, role: 'admin' };
      // update user query
      identityDb.query.mockResolvedValueOnce({ rowCount: 0 });

      await assignRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'User not found' });
    });

    it('should assign role and update assignments if role exists', async () => {
      mockReq.body = { userId: 1, role: 'admin' };
      
      const mockUpdatedUser = { id: 1, username: 'testuser', role: 'admin' };
      // 1. update users
      identityDb.query.mockResolvedValueOnce({ rowCount: 1, rows: [mockUpdatedUser] });
      // 2. check if role exists
      identityDb.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'role-uuid' }] });
      // 3. insert mapping
      identityDb.query.mockResolvedValueOnce({ rowCount: 1 });

      await assignRole(mockReq, mockRes);

      // Verify the queries were called in order with right params
      expect(identityDb.query).toHaveBeenNthCalledWith(
        1,
        'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role',
        ['admin', 1]
      );
      expect(identityDb.query).toHaveBeenNthCalledWith(
        2,
        'SELECT id FROM roles WHERE name = $1',
        ['admin']
      );
      expect(identityDb.query).toHaveBeenNthCalledWith(
        3,
        'INSERT INTO member_role_assignments (member_id, role_id) VALUES ($1, $2) ON CONFLICT (member_id, role_id) DO NOTHING',
        [1, 'role-uuid']
      );

      expect(mockRes.json).toHaveBeenCalledWith({ success: true, user: mockUpdatedUser });
    });
  });
});
