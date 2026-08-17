import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Auth Enhancements Service
 * Handles MFA, session management, and token operations
 */
export const authEnhancementsService = {
  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth-enhancements/refresh-token`, {
      refreshToken
    });
    return response.data;
  },

  /**
   * Logout from all devices
   */
  logoutAllDevices: async () => {
    const response = await axios.post(`${API_BASE_URL}/api/auth-enhancements/logout-all-devices`);
    return response.data;
  },

  /**
   * Get active sessions for current user
   */
  getSessions: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/auth-enhancements/sessions`);
    return response.data;
  },

  /**
   * Delete a specific session
   */
  deleteSession: async (sessionId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/api/auth-enhancements/session/${sessionId}`);
    return response.data;
  },

  /**
   * Enable MFA - returns QR code and secret
   */
  enableMFA: async () => {
    const response = await axios.post(`${API_BASE_URL}/api/auth-enhancements/mfa/enable`);
    return response.data;
  },

  /**
   * Verify MFA token and complete setup
   */
  verifyMFA: async (token: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth-enhancements/mfa/verify`, { token });
    return response.data;
  }
};
