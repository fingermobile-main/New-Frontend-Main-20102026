/**
 * Community Service Unit Tests
 * Tests community creation, membership management, updates, and deletion
 */

const { describe, it, beforeEach } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const CommunityService = require('../../services/CommunityService');

describe('CommunityService', () => {
  let mockPool;
  let mockClient;
  
  beforeEach(() => {
    // Create mock client with transaction support
    mockClient = {
      query: sinon.stub(),
      release: sinon.stub()
    }
    
    // Create mock pool
    mockPool = {
      connect: sinon.stub().resolves(mockClient),
      query: sinon.stub()
    }
    
    // Replace db module
    const originalRequire = require.cache[require.resolve('../../db')]
    delete require.cache[require.resolve('../../db')]
    require.cache[require.resolve('../../db')] = {
      exports: {
        pool: mockPool
      }
    }
  })
  
  afterEach(() => {
    sinon.restore();
  });

  describe('createCommunity()', () => {
    it('should create a new community with valid data', async () => {
      const communityData = {
        name: 'Test Community',
        description: 'A test community',
        creatorId: 123,
        privacy: 'public'
      };

      mockPool.query.resolves({ 
        rows: [{ id: 1, ...communityData }] 
      });

      const result = await CommunityService.createCommunity(communityData);

      expect(result).to.deep.equal({ id: 1, ...communityData });
      expect(mockPool.query.calledOnce).to.be.true;
    });

    it('should handle duplicate community names', async () => {
      const communityData = {
        name: 'Duplicate Community',
        description: 'A test community',
        creatorId: 123,
        privacy: 'public'
      };

      mockPool.query.rejects(new Error('duplicate key value violates unique constraint'));

      try {
        await CommunityService.createCommunity(communityData);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.include('duplicate key value');
      }
    });
  });

  describe('joinCommunity()', () => {
    it('should add user to community successfully', async () => {
      const joinData = {
        userId: 456,
        communityId: 1
      };

      mockPool.query.resolves({ rowCount: 1 });

      const result = await CommunityService.joinCommunity(joinData);

      expect(result).to.be.true;
      expect(mockPool.query.calledOnce).to.be.true;
    });

    it('should handle user already in community', async () => {
      const joinData = {
        userId: 456,
        communityId: 1
      };

      mockPool.query.rejects(new Error('User already in community'));

      try {
        await CommunityService.joinCommunity(joinData);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.include('already in community');
      }
    });
  });

  describe('getCommunityMembers()', () => {
    it('should return community members with pagination', async () => {
      const mockMembers = [
        { id: 456, name: 'User 1', role: 'member' },
        { id: 789, name: 'User 2', role: 'moderator' }
      ];

      mockPool.query.resolves({ rows: mockMembers });

      const result = await CommunityService.getCommunityMembers(1, 1, 10);

      expect(result).to.deep.equal(mockMembers);
      expect(mockPool.query.calledOnce).to.be.true;
    });

    it('should handle empty community', async () => {
      mockPool.query.resolves({ rows: [] });

      const result = await CommunityService.getCommunityMembers(999, 1, 10);

      expect(result).to.deep.equal([]);
    });
  });

  describe('updateCommunity()', () => {
    it('should update community details for owner', async () => {
      const updateData = {
        id: 1,
        name: 'Updated Community',
        description: 'Updated description',
        privacy: 'private'
      };

      mockPool.query.resolves({ rows: [updateData] });

      const result = await CommunityService.updateCommunity(updateData);

      expect(result).to.deep.equal(updateData);
    });

    it('should handle unauthorized update attempts', async () => {
      const updateData = {
        id: 1,
        name: 'Updated Community',
        description: 'Updated description',
        privacy: 'private'
      };

      mockPool.query.rejects(new Error('Not authorized to update this community'));

      try {
        await CommunityService.updateCommunity(updateData);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.include('Not authorized');
      }
    });
  });

  describe('deleteCommunity()', () => {
    it('should delete community for owner', async () => {
      mockPool.query.resolves({ rowCount: 1 });

      const result = await CommunityService.deleteCommunity(1, 123);

      expect(result).to.be.true;
    });

    it('should handle unauthorized delete attempts', async () => {
      mockPool.query.resolves({ rowCount: 0 });

      const result = await CommunityService.deleteCommunity(1, 999);

      expect(result).to.be.false;
    });
  });
});

module.exports = CommunityService;
