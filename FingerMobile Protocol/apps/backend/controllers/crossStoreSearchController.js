'use strict';

const crossStoreSearchService = require('../services/crossStoreSearchService');

class CrossStoreSearchController {
  async searchStores(req, res) {
    try {
      const { q, query, store, limit } = req.query;
      const searchQuery = q || query || '';
      const data = await crossStoreSearchService.searchAcrossStores({
        query: searchQuery,
        storeFilter: store,
        limit: limit ? parseInt(limit) : 20,
      });

      return res.status(200).json({
        success: true,
        ...data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Error searching across store catalogs',
      });
    }
  }
}

module.exports = new CrossStoreSearchController();
