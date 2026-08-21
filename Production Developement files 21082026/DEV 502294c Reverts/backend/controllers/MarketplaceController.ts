import { Request, Response } from 'express';
const MarketplaceService = require('../services/MarketplaceService');
const logger = require('../utils/logger');

/**
 * MarketplaceController
 * Handles marketplace listings and transactions
 */

class MarketplaceController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { category, type, minPrice, maxPrice, search, page, limit, sortBy, order, featured } = req.query;
      
      const result = await MarketplaceService.getAllListings({
        category: category as string,
        type: type as string,
        minPrice: minPrice as string,
        maxPrice: maxPrice as string,
        search: search as string,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 20,
        sortBy: sortBy as string,
        order: order as string,
        featured: featured === 'true'
      });
      
      res.json({
        success: true,
        data: result.listings,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      logger.error('MarketplaceController.getAll error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve listings' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      
      const listing = await MarketplaceService.getListingById(id, userId);
      
      res.json({ 
        success: true, 
        data: listing 
      });
    } catch (error) {
      logger.error('MarketplaceController.getById error:', error);
      if (error instanceof Error && error.message === 'Listing not found') {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Failed to retrieve listing' });
      }
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { 
        title, description, type, category, subcategory, tags, price, currency,
        discount_price, inventory_count, thumbnail_url, media_urls, demo_url,
        delivery_method, delivery_instructions, settings
      } = req.body;
      
      // Validation
      if (!title || title.trim().length === 0) {
        res.status(400).json({ success: false, message: 'Title is required' });
        return;
      }
      
      if (!price || parseFloat(price) <= 0) {
        res.status(400).json({ success: false, message: 'Valid price is required' });
        return;
      }
      
      const listing = await MarketplaceService.createListing(userId, {
        title,
        description,
        type,
        category,
        subcategory,
        tags,
        price,
        currency,
        discount_price,
        inventory_count,
        thumbnail_url,
        media_urls,
        demo_url,
        delivery_method,
        delivery_instructions,
        settings
      });
      
      res.status(201).json({ 
        success: true, 
        message: 'Listing created successfully', 
        data: listing 
      });
    } catch (error) {
      logger.error('MarketplaceController.create error:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Failed to create listing' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { id } = req.params;
      const updates = req.body;
      
      const listing = await MarketplaceService.updateListing(id, userId, updates);
      
      res.json({ 
        success: true, 
        message: 'Listing updated successfully', 
        data: listing 
      });
    } catch (error) {
      logger.error('MarketplaceController.update error:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 
                        error instanceof Error && error.message.includes('own listings') ? 403 : 500;
      res.status(statusCode).json({ success: false, message: error instanceof Error ? error.message : 'Failed to update listing' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { id } = req.params;
      
      const result = await MarketplaceService.deleteListing(id, userId);
      
      res.json({ 
        success: true, 
        message: result.message,
        data: result.listing
      });
    } catch (error: unknown) {
      logger.error('MarketplaceController.delete error:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 
                        error instanceof Error && error.message.includes('own listings') ? 403 : 
                        error instanceof Error && error.message.includes('active transactions') ? 409 : 500;
      res.status(statusCode).json({ success: false, message: error instanceof Error ? error.message : 'Failed to delete listing' });
    }
  }

  async addToWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { listingId } = req.params;
      
      const result = await MarketplaceService.addToWishlist(userId, listingId);
      
      res.json({ 
        success: true, 
        message: result.message 
      });
    } catch (error) {
      logger.error('MarketplaceController.addToWishlist error:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({ success: false, message: error instanceof Error ? error.message : 'Failed to add to wishlist' });
    }
  }

  async removeFromWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { listingId } = req.params;
      
      const result = await MarketplaceService.removeFromWishlist(userId, listingId);
      
      res.json({ 
        success: true, 
        message: result.message 
      });
    } catch (error) {
      logger.error('MarketplaceController.removeFromWishlist error:', error);
      const statusCode = error instanceof Error && error.message.includes('not in wishlist') ? 404 : 500;
      res.status(statusCode).json({ success: false, message: error instanceof Error ? error.message : 'Failed to remove from wishlist' });
    }
  }

  async getWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { page, limit } = req.query;
      
      const result = await MarketplaceService.getWishlist(userId, {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 20
      });
      
      res.json({
        success: true,
        data: result.items,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total
        }
      });
    } catch (error) {
      logger.error('MarketplaceController.getWishlist error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve wishlist' });
    }
  }
}

export default new MarketplaceController();
