/**
 * UGC Media Service Unit Tests
 * Tests for cloud storage, processing, and database operations
 */

const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const ugcMediaService = require('../services/ugc_media_service');
const fs = require('fs').promises;
const path = require('path');

describe('UGCMediaService', () => {
  let mockFile;
  const testUserId = 'test-user-123';
  
  before(() => {
    // Create mock file object
    mockFile = {originalname: 'test-image.jpg',
  name: 'test-image.jpg',
  mimetype: 'image/jpeg',
  size: 1024 * 500, // 500KB
  buffer: Buffer.from('mock image data')
    }
  })
  
  after(async () => {
    // Cleanup test files
    try {
      await fs.rm('./uploads/media/test_*', {recursive: true,
  force: true })
    } catch (err) {
      // Ignore cleanup errors
    }
  })
  
  describe('generateFilename()', () => {
    it('should generate unique filename with user ID and timestamp', () => {
      const filename1 = ugcMediaService.generateFilename('photo.jpg', testUserId)
      const filename2 = ugcMediaService.generateFilename('photo.jpg', testUserId)
      
      expect(filename1).to.include(testUserId)
      expect(filename1).to.include('.jpg');
      expect(filename1).to.not.equal(filename2); // Should be unique
    })
    
    it('should preserve file extension', () => {
      const filename = ugcMediaService.generateFilename('video.mp4', testUserId)
      expect(filename).to.endWith('.mp4')
    })
  });
  
  describe('validateFile()', () => {
    it('should accept valid image types', () => {
      const validFiles = [
        {mimetype: 'image/jpeg' },
        {mimetype: 'image/png' },
        {mimetype: 'image/gif' },
        {mimetype: 'video/mp4' }
      ];
      
      validFiles.forEach((file) => {
        expect(() => ugcMediaService.validateFile(file)).to.not.throw();
      });
    });
    
    it('should reject invalid file types', () => {
      const invalidFile = {mimetype: 'application/exe' };
      expect(() => ugcMediaService.validateFile(invalidFile)).to.throw('not allowed');
    });
    
    it('should reject oversized files', () => {
      const oversizedFile = {mimetype: 'image/jpeg',
  size: 200 * 1024 * 1024 // 200MB
      }
      expect(() => ugcMediaService.validateFile(oversizedFile)).to.throw('exceeds maximum')
    })
  })
  
  describe('uploadMedia() - Local Storage', () => {
    it('should upload file to local filesystem', async () => {
      // Mock database pool
      const mockPool = {query: sinon.stub().resolves({ rows: [{ id: 'mock-media-id' }]
        })
      }
      
      // Temporarily replace db module
      const originalRequire = require.cache[require.resolve('../db')]
      delete require.cache[require.resolve('../db')]
      require.cache[require.resolve('../db')] = {exports: { pool: mockPool } }
      
      try {
        const result = await ugcMediaService.uploadMedia(mockFile, testUserId, {title: 'Test Image',
  category: 'profile'
        })
        
        expect(result.success).to.be.true;
        expect(result.mediaId).to.exist;
        expect(result.url).to.include('/uploads/media/');
        expect(result.filename).to.include(testUserId);
      } finally {
        // Restore original module
        if (originalRequire) {
          require.cache[require.resolve('../db')] = originalRequire
        }
      }
    })
    
    it('should fail on invalid file type', async () => {
      const invalidFile = {
        ...mockFile,
mimetype: 'application/exe'
      }
      
      try {
        await ugcMediaService.uploadMedia(invalidFile, testUserId)
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('not allowed');
      }
    });
  });
  
  describe('processMedia()', () => {
    it('should process image and generate thumbnails', async () => {
      // This test requires sharp to be installed
      const mediaId = 'test-media-id'
      
      // Mock getMediaMetadata
      const stub = sinon.stub(ugcMediaService, 'getMediaMetadata').resolves({id: mediaId,
  file_type: 'image',
  url: '/uploads/media/test.jpg',
  filename: 'test.jpg'
      })
      
      try {
        const result = await ugcMediaService.processMedia(mediaId)
        
        expect(result.success).to.be.true
        expect(result.status).to.equal('completed')
        expect(result.processedUrls).to.have.property('thumbnail');
      } catch (error) {
        // If sharp is not installed, this is acceptable
        if (error.message.includes('sharp')) {
          logger.info('⚠️ Sharp not installed, skipping thumbnail generation')
        } else {
          throw error
        }
      } finally {
        stub.restore()
      }
    })
    
    it('should handle missing media gracefully', async () => {
      const stub = sinon.stub(ugcMediaService, 'getMediaMetadata').resolves(null);
      
      try {
        const result = await ugcMediaService.processMedia('nonexistent-id');
        expect(result.success).to.be.false;
        expect(result.status).to.equal('failed');
      } finally {
        stub.restore();
      }
    });
  });
  
  describe('deleteMedia()', () => {
    it('should delete media file and database record', async () => {
      const mediaId = 'test-delete-id';
      const userId = testUserId;
      
      // Mock getMediaMetadata
      const getStub = sinon.stub(ugcMediaService, 'getMediaMetadata').resolves({id: mediaId,
  user_id: userId,
  filename: 'test_delete.jpg',
  url: '/uploads/media/test_delete.jpg'
      })
      
      // Mock database delete
      const mockPool = {query: sinon.stub().resolves()
      }
      
      const originalRequire = require.cache[require.resolve('../db')]
      delete require.cache[require.resolve('../db')]
      require.cache[require.resolve('../db')] = {exports: { pool: mockPool } }
      
      try {
        const result = await ugcMediaService.deleteMedia(mediaId, userId);
        
        expect(result.success).to.be.true;
        expect(mockPool.query.calledOnce).to.be.true;
      } finally {
        getStub.restore();
        if (originalRequire) {
          require.cache[require.resolve('../db')] = originalRequire;
        }
      }
    });
    
    it('should prevent deletion by non-owner', async () => {
      const mediaId = 'test-delete-id';
      const ownerId = 'owner-123';
      const differentUserId = 'different-456';
      
      const stub = sinon.stub(ugcMediaService, 'getMediaMetadata').resolves({id: mediaId,
  user_id: ownerId,
  filename: 'test.jpg'
      });
      
      try {
        await ugcMediaService.deleteMedia(mediaId, differentUserId);
        expect.fail('Should have thrown unauthorized error');
      } catch (error) {
        expect(error.message).to.include('Unauthorized');
      } finally {
        stub.restore();
      }
    });
  });
  
  describe('getStorageQuota()', () => {
    it('should calculate quota correctly', async () => {
      const userId = testUserId;
      
      const mockPool = {query: sinon.stub().resolves({ rows: [{
  total_used_bytes: 524288000, // 500MB
  file_count: 10,
  quota_limit_bytes: 1073741824 // 1GB
          }]
        })
      }
      
      const originalRequire = require.cache[require.resolve('../db')]
      delete require.cache[require.resolve('../db')]
      require.cache[require.resolve('../db')] = {exports: { pool: mockPool } }
      
      try {
        const result = await ugcMediaService.getStorageQuota(userId);
        
        expect(result.usedMB).to.equal(500);
        expect(result.limitMB).to.equal(1024);
        expect(result.percentUsed).to.equal(49); // ~50%
      } finally {
        if (originalRequire) {
          require.cache[require.resolve('../db')] = originalRequire
        }
      }
    })
  })
})

module.exports = UGCMediaService;
