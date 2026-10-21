import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1';

const videoTranslationService = {
  /**
   * Upload a video for translation
   */
  async uploadVideo(file, targetLanguages) {
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('targetLanguages', JSON.stringify(targetLanguages));

      const response = await axios.post(`${API_BASE_URL}/video-translation/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          // Calculate progress percentage
          const _progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Could be used for UI updates if needed
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error in uploadVideo function:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get translation status
   */
  async getTranslationStatus(processingId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/video-translation/status/${processingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get user's translated videos
   */
  async getUserVideos(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/video-translation/my-videos?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get available target languages
   */
  async getAvailableLanguages() {
    try {
      const response = await axios.get(`${API_BASE_URL}/video-translation/languages`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a translated video
   */
  async deleteVideo(videoId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/video-translation/${videoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get user's storage quota information
   */
  async getQuotaInfo() {
    try {
      const response = await axios.get(`${API_BASE_URL}/video-translation/quota`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default videoTranslationService;
