import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Video Translation Service
 * Handles video upload and translation operations
 */
export const videoTranslationService = {
  /**
   * Upload video for translation
   */
  uploadVideo: async (file: File, targetLanguage: string) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('targetLanguage', targetLanguage);

    const response = await axios.post(
      `${API_BASE_URL}/api/video-translation/upload`,
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
   * Get translation status for a job
   */
  getTranslationStatus: async (jobId: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/video-translation/status/${jobId}`);
    return response.data;
  },

  /**
   * Get user's uploaded videos
   */
  getUserVideos: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/video-translation/videos`);
    return response.data;
  },

  /**
   * Get available translation languages
   */
  getAvailableLanguages: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/video-translation/languages`);
    return response.data;
  },

  /**
   * Delete a video
   */
  deleteVideo: async (videoId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/api/video-translation/video/${videoId}`);
    return response.data;
  },

  /**
   * Get quota information
   */
  getQuotaInfo: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/video-translation/quota`);
    return response.data;
  }
};
