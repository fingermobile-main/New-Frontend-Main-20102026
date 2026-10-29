'use strict';

/**
 * FingerMobile Protocol™ - Visual Search Commerce Controller
 * Handles image upload & visual catalog retrieval across Marketplace, OwnIt, Flamingo, Storefront, and FingerLux
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

const fs = require('fs');
const path = require('path');
const visualSearchService = require('../services/VisualSearchCommerceService');
const logger = require('../utils/logger');

class VisualSearchController {
  async searchByImage(req, res) {
    try {
      const file = req.file;
      const imageUrl = req.body.imageUrl || req.body.image_url || req.query.imageUrl || req.query.image_url;

      if (!file && !imageUrl) {
        return res.status(400).json({
          success: false,
          error: 'An image file or image URL is required for visual commerce search.'
        });
      }

      // Resolve file path or buffer
      let imageInput = null;
      let finalImageUrl = imageUrl;

      if (file) {
        imageInput = file.path;
        finalImageUrl = `/uploads/images/${file.filename}`;
      } else {
        imageInput = imageUrl;
      }

      const store = req.body.store || req.query.store || 'all';
      const q = req.body.q || req.body.query || req.query.q || req.query.query || '';
      const category = req.body.category || req.query.category || 'all';
      const minPrice = req.body.minPrice || req.body.min_price || req.query.minPrice || req.query.min_price || 0;
      const maxPrice = req.body.maxPrice || req.body.max_price || req.query.maxPrice || req.query.max_price || null;
      const inStock = req.body.inStock === 'true' || req.body.inStock === true || req.query.inStock === 'true';
      const sortBy = req.body.sortBy || req.query.sortBy || 'similarity';
      const limit = parseInt(req.body.limit || req.query.limit || 24, 10);
      const offset = parseInt(req.body.offset || req.query.offset || 0, 10);

      const searchResults = await visualSearchService.searchByImage({
        imageInput,
        imageUrl: finalImageUrl,
        store,
        q,
        category,
        minPrice,
        maxPrice,
        inStock,
        sortBy,
        limit,
        offset
      });

      return res.status(200).json({
        success: true,
        message: 'Visual commerce search completed successfully.',
        ...searchResults
      });
    } catch (error) {
      logger.error('VisualSearchController.searchByImage error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process visual commerce search.',
        details: error.message
      });
    }
  }

  async getVisualSearchRecommendations(req, res) {
    try {
      const store = req.query.store || 'all';
      const data = await visualSearchService.searchByImage({
        imageInput: null,
        imageUrl: '/assets/branding/sample-search.png',
        store,
        limit: 12
      });

      return res.status(200).json({
        success: true,
        recommendations: data.results,
        stores_summary: data.stores_summary
      });
    } catch (error) {
      logger.error('VisualSearchController.getRecommendations error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch visual search recommendations.'
      });
    }
  }
}

module.exports = new VisualSearchController();

