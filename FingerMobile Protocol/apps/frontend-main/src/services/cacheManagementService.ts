import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Cache Management Service
 * Handles cache statistics and clearing operations
 */
export const cacheManagementService = {
  /**
   * Get cache statistics
   */
  getCacheStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/cache-management/stats`);
    return response.data;
  },

  /**
   * Clear all caches
   */
  clearCache: async () => {
    const response = await axios.post(`${API_BASE_URL}/api/cache-management/clear`);
    return response.data;
  }
};
