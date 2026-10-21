/**
 * Marketplace Service Unit Tests
 * Tests listing CRUD, wishlist management, filtering, and validation
 */

const { describe, it, beforeEach } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const MarketplaceService = require('../services/MarketplaceService');

describe('MarketplaceService', () => {
  let mockPool;
  let mockClient;
  
  beforeEach(() => {
    mockClient = {query: sinon.stub(),
  release: sinon.stub()
    };
    
    mockPool = {connect: sinon.stub().resolves(mockClient),
  query: sinon.stub()
    };
    
    const originalRequire = require.cache[require.resolve('../db')];
    delete require.cache[require.resolve('../db')];
    require.cache[require.resolve('../db')] = {exports: { pool: mockPool } };
  });
  
  afterEach(() => {
    sinon.restore();
  });
  
  describe('getAllListings()', () => {
    it('should fetch listings with pagination', async () => {
      mockPool.query.onFirstCall().resolves({rows: [
          { id: 'listing-1',
  title: 'Product A',
  price: 49.99 },
          {id: 'listing-2',
  title: 'Product B',
  price: 99.99 }
        ]
      });
      
      mockPool.query.onSecondCall().resolves({rows: [{ count: '2' }]
      });
      
      const result = await MarketplaceService.getAllListings({page: 1,
  limit: 20
      });
      
      expect(result.listings).to.have.length(2);
      expect(result.total).to.equal(2);
      expect(result.page).to.equal(1);
      expect(result.limit).to.equal(20);
    });
    
    it('should filter by category', async () => {
      mockPool.query.onFirstCall().resolves({rows: [] });
      mockPool.query.onSecondCall().resolves({rows: [{ count: '0' }] });
      
      await MarketplaceService.getAllListings({category: 'electronics'
      });
      
      const queryCall = mockPool.query.getCall(0);
      expect(queryCall.args[0]).to.include('category =');
      expect(queryCall.args[1]).to.deep.equal(['electronics']);
    });
    
    it('should filter by type (digital_product/service)', async () => {
      mockPool.query.onFirstCall().resolves({rows: [] });
      mockPool.query.onSecondCall().resolves({rows: [{ count: '0' }] });
      
      await MarketplaceService.getAllListings({type: 'service'
      });
      
      const queryCall = mockPool.query.getCall(0);
      expect(queryCall.args[0]).to.include('type =');
    });
    
    it('should filter by price range', async () => {
      mockPool.query.onFirstCall().resolves({rows: [] });
      mockPool.query.onSecondCall().resolves({rows: [{ count: '0' }] });
      
      await MarketplaceService.getAllListings({minPrice: 10,
  maxPrice: 100
      });
      
      const queryCall = mockPool.query.getCall(0);
      expect(queryCall.args[0]).to.include('price >=');
      expect(queryCall.args[0]).to.include('price <=');
    });
    
    it('should search by title or description', async () => {
      mockPool.query.onFirstCall().resolves({rows: [] });
      mockPool.query.onSecondCall().resolves({rows: [{ count: '0' }] });
      
      await MarketplaceService.getAllListings({search: 'premium course'
      });
      
      const queryCall = mockPool.query.getCall(0);
      expect(queryCall.args[0]).to.include('ILIKE');
      expect(queryCall.args[1][0]).to.include('%premium course%');
    });
    
    it('should filter featured listings only', async () => {
      mockPool.query.onFirstCall().resolves({rows: [] });
      mockPool.query.onSecondCall().resolves({rows: [{ count: '0' }] });
      
      await MarketplaceService.getAllListings({featured: true
      });
      
      const queryCall = mockPool.query.getCall(0);
      expect(queryCall.args[0]).to.include('is_featured = true');
    });
    
    it('should sort by valid fields', async () => {
      mockPool.query.onFirstCall().resolves({rows: [] });
      mockPool.query.onSecondCall().resolves({rows: [{ count: '0' }] });
      
      await MarketplaceService.getAllListings({sortBy: 'price',
  order: 'ASC'
      });
      
      const queryCall = mockPool.query.getCall(0);
      expect(queryCall.args[0]).to.include('ORDER BY ml.price ASC');
    });
    
    it('should reject invalid sort fields', async () => {
      mockPool.query.onFirstCall().resolves({rows: [] });
      mockPool.query.onSecondCall().resolves({rows: [{ count: '0' }] });
      
      await MarketplaceService.getAllListings({sortBy: 'invalid_field'
      });
      
      const queryCall = mockPool.query.getCall(0);
      expect(queryCall.args[0]).to.include('ORDER BY ml.created_at'); // Should default
    })
  })
  
  describe('getListingById()', () => {
    it('should fetch listing with seller info and wishlist status', async () => {
      mockPool.query.onFirstCall().resolves({rows: [{ id: 'listing-123',
  title: 'Test Product',
  seller_name: 'John Doe',
  is_in_wishlist: false
        }]
      })
      
      mockPool.query.onSecondCall().resolves({rows: [] // Recent reviews
      })
      
      mockPool.query.onThirdCall().resolves(); // View count increment
      
      const listing = await MarketplaceService.getListingById('listing-123', 'user-456')
      
      expect(listing.id).to.equal('listing-123')
      expect(listing.is_in_wishlist).to.be.false
      expect(listing.recent_reviews).to.be.an('array')
    });
    
    it('should throw error if listing not found', async () => {
      mockPool.query.resolves({rows: [] });
      
      try {
        await MarketplaceService.getListingById('nonexistent-id');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Listing not found');
      }
    });
    
    it('should increment view count', async () => {
      mockPool.query.onFirstCall().resolves({rows: [{ id: 'listing-123',
  title: 'Test' }]
      });
      
      mockPool.query.onSecondCall().resolves({rows: [] });
      mockPool.query.onThirdCall().resolves();
      
      await MarketplaceService.getListingById('listing-123');
      
      const viewCall = mockPool.query.getCall(2);
      expect(viewCall.args[0]).to.include('view_count = view_count + 1');
    });
  });
  
  describe('createListing()', () => {
    it('should create listing with auto-publish if complete', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      
      // Check slug availability
      mockClient.query.onSecondCall().resolves({rows: [] })
      
      // Insert listing
      mockClient.query.onThirdCall().resolves({rows: [{ id: 'listing-new',
  title: 'New Product',
  slug: 'new-product-1234567890',
  seller_id: 'user-123',
  status: 'draft'
        }]
      })
      
      // Auto-publish update
      mockClient.query.onCall(3).resolves()
      mockClient.query.onCall(4).resolves(); // COMMIT
      
      const result = await MarketplaceService.createListing('user-123', {title: 'New Product',
  description: 'A great product',
  price: 99.99,
  thumbnail_url: 'https://example.com/image.jpg',
  type: 'digital_product'
      })
      
      expect(result.id).to.equal('listing-new')
      expect(result.status).to.equal('active')
      expect(mockClient.query.calledWith('BEGIN')).to.be.true
      expect(mockClient.query.calledWith('COMMIT')).to.be.true;
    });
    
    it('should reject missing title', async () => {
      try {
        await MarketplaceService.createListing('user-123', {description: 'No title',
  price: 50
        });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Title is required');
      }
    });
    
    it('should reject invalid price', async () => {
      try {
        await MarketplaceService.createListing('user-123', {title: 'Free Product',
  description: 'Description',
  price: 0
        });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Valid price is required');
      }
    });
    
    it('should generate unique slug with timestamp', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      mockClient.query.onSecondCall().resolves({rows: [] })
      mockClient.query.onThirdCall().resolves({rows: [{ id: 'listing-new',
  slug: 'my-product-1234567890' }]
      })
      mockClient.query.onCall(3).resolves()
      mockClient.query.onCall(4).resolves(); // COMMIT
      
      await MarketplaceService.createListing('user-123', {title: 'My Product',
  description: 'Desc',
  price: 50
      })
      
      const insertCall = mockClient.query.getCall(2)
      expect(insertCall.args[1][2]).to.match(/my-product-\d+/)
    })
    
    it('should rollback on duplicate slug', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      mockClient.query.onSecondCall().resolves({rows: [{ id: 'existing-listing' }]
      })
      
      try {
        await MarketplaceService.createListing('user-123', {title: 'Existing Title',
  description: 'Desc',
  price: 50
        })
        expect.fail('Should have thrown error')
      } catch (error) {
        expect(error.message).to.equal('Listing with this title already exists')
        expect(mockClient.query.calledWith('ROLLBACK')).to.be.true;
      }
    });
  });
  
  describe('updateListing()', () => {
    it('should allow owner to update listing', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      
      // Check ownership
      mockClient.query.onSecondCall().resolves({rows: [{ id: 'listing-123',
  seller_id: 'user-456',
  status: 'active' }]
      })
      
      // Update listing
      mockClient.query.onThirdCall().resolves({rows: [{ id: 'listing-123',
  title: 'Updated Title',
  price: 79.99
        }]
      })
      
      mockClient.query.onCall(3).resolves(); // COMMIT
      
      const result = await MarketplaceService.updateListing('listing-123', 'user-456', {title: 'Updated Title',
  price: 79.99
      })
      
      expect(result.title).to.equal('Updated Title')
      expect(result.price).to.equal(79.99)
    })
    
    it('should reject non-owner updates', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      
      mockClient.query.onSecondCall().resolves({rows: [{ id: 'listing-123',
  seller_id: 'user-789',
  status: 'active' }]
      })
      
      try {
        await MarketplaceService.updateListing('listing-123', 'user-456', {title: 'Hacked Title'
        })
        expect.fail('Should have thrown error')
      } catch (error) {
        expect(error.message).to.equal('You can only update your own listings')
      }
    });
    
    it('should reject updates to non-existent listing', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      mockClient.query.onSecondCall().resolves({rows: [] })
      
      try {
        await MarketplaceService.updateListing('nonexistent', 'user-456', {title: 'Test'
        })
        expect.fail('Should have thrown error')
      } catch (error) {
        expect(error.message).to.equal('Listing not found')
      }
    });
    
    it('should only update allowed fields', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      mockClient.query.onSecondCall().resolves({rows: [{ id: 'listing-123',
  seller_id: 'user-456',
  status: 'active' }]
      })
      mockClient.query.onThirdCall().resolves({rows: [{ id: 'listing-123' }] })
      mockClient.query.onCall(3).resolves(); // COMMIT
      
      await MarketplaceService.updateListing('listing-123', 'user-456', {title: 'Valid Update',
  invalid_field: 'Should be ignored',
  seller_id: 'Cannot change owner'
      })
      
      const updateCall = mockClient.query.getCall(2)
      expect(updateCall.args[0]).to.not.include('invalid_field')
      expect(updateCall.args[0]).to.not.include('seller_id')
    });
    
    it('should auto-set published_at when activating draft', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      mockClient.query.onSecondCall().resolves({rows: [{ id: 'listing-123',
  seller_id: 'user-456',
  status: 'draft' }]
      })
      mockClient.query.onThirdCall().resolves({rows: [{ id: 'listing-123' }] })
      mockClient.query.onCall(3).resolves(); // COMMIT
      
      await MarketplaceService.updateListing('listing-123', 'user-456', {status: 'active'
      })
      
      const updateCall = mockClient.query.getCall(2)
      expect(updateCall.args[0]).to.include('published_at = NOW()')
    })
  });
  
  describe('deleteListing()', () => {
    it('should allow owner to archive listing', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      
      // Check ownership
      mockClient.query.onSecondCall().resolves({rows: [{ id: 'listing-123',
  seller_id: 'user-456',
  status: 'active' }]
      })
      
      // Check no pending transactions
      mockClient.query.onThirdCall().resolves({rows: [{ count: '0' }]
      })
      
      // Archive listing
      mockClient.query.onCall(3).resolves({rows: [{ id: 'listing-123',
  title: 'Archived',
  status: 'archived' }]
      })
      
      mockClient.query.onCall(4).resolves(); // COMMIT
      
      const result = await MarketplaceService.deleteListing('listing-123', 'user-456')
      
      expect(result.success).to.be.true
      expect(result.message).to.equal('Listing archived successfully')
    })
    
    it('should reject deletion with active transactions', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      
      mockClient.query.onSecondCall().resolves({rows: [{ id: 'listing-123',
  seller_id: 'user-456',
  status: 'active' }]
      })
      
      mockClient.query.onThirdCall().resolves({rows: [{ count: '2' }] // Has pending transactions
      })
      
      try {
        await MarketplaceService.deleteListing('listing-123', 'user-456')
        expect.fail('Should have thrown error')
      } catch (error) {
        expect(error.message).to.include('Cannot delete listing with active transactions')
      }
    });
    
    it('should reject non-owner deletion', async () => {
      mockClient.query.onFirstCall().resolves(); // BEGIN
      
      mockClient.query.onSecondCall().resolves({rows: [{ id: 'listing-123',
  seller_id: 'user-789',
  status: 'active' }]
      })
      
      try {
        await MarketplaceService.deleteListing('listing-123', 'user-456')
        expect.fail('Should have thrown error')
      } catch (error) {
        expect(error.message).to.equal('You can only delete your own listings')
      }
    });
  });
  
  describe('addToWishlist()', () => {
    it('should add active listing to wishlist', async () => {
      // Check listing exists
      mockPool.query.onFirstCall().resolves({rows: [{ id: 'listing-123' }]
      })
      
      // Add to wishlist
      mockPool.query.onSecondCall().resolves()
      
      const result = await MarketplaceService.addToWishlist('user-456', 'listing-123')
      
      expect(result.success).to.be.true
      expect(result.message).to.equal('Added to wishlist')
    });
    
    it('should reject inactive listings', async () => {
      mockPool.query.resolves({rows: [] });
      
      try {
        await MarketplaceService.addToWishlist('user-456', 'listing-123');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Listing not found or inactive');
      }
    });
    
    it('should handle duplicate additions gracefully', async () => {
      mockPool.query.onFirstCall().resolves({rows: [{ id: 'listing-123' }] });
      mockPool.query.onSecondCall().resolves(); // ON CONFLICT DO NOTHING
      
      const result = await MarketplaceService.addToWishlist('user-456', 'listing-123')
      
      expect(result.success).to.be.true
    })
  })
  
  describe('removeFromWishlist()', () => {
    it('should remove item from wishlist', async () => {
      mockPool.query.resolves({rowCount: 1 });
      
      const result = await MarketplaceService.removeFromWishlist('user-456', 'listing-123');
      
      expect(result.success).to.be.true;
      expect(result.message).to.equal('Removed from wishlist');
    });
    
    it('should reject if item not in wishlist', async () => {
      mockPool.query.resolves({rowCount: 0 });
      
      try {
        await MarketplaceService.removeFromWishlist('user-456', 'listing-123');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Item not in wishlist');
      }
    });
  });
  
  describe('getWishlist()', () => {
    it('should fetch user wishlist with pagination', async () => {
      mockPool.query.onFirstCall().resolves({rows: [
          { id: 'listing-1',
  title: 'Wish Item 1' },
          {id: 'listing-2',
  title: 'Wish Item 2' }
        ]
      });
      
      mockPool.query.onSecondCall().resolves({rows: [{ count: '2' }]
      });
      
      const result = await MarketplaceService.getWishlist('user-456', {page: 1,
  limit: 20
      });
      
      expect(result.items).to.have.length(2);
      expect(result.total).to.equal(2);
    });
    
    it('should return empty wishlist for new users', async () => {
      mockPool.query.onFirstCall().resolves({rows: [] });
      mockPool.query.onSecondCall().resolves({rows: [{ count: '0' }] });
      
      const result = await MarketplaceService.getWishlist('new-user');
      
      expect(result.items).to.be.an('array').that.is.empty;
      expect(result.total).to.equal(0);
    });
  });
});

module.exports = MarketplaceService;
