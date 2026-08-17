import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Content Operations Service
 * Handles content upload and management operations
 */
export const contentOperationsService = {
  /**
   * Upload content with file
   */
  uploadContent: async (file: File, metadata?: any) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/content-operations/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  /**
   * Bulk update content
   */
  bulkUpdate: async (updates: any[]) => {
    const response = await axios.post(`${API_BASE_URL}/api/content-operations/bulk-update`, { updates });
    return response.data;
  }
};
