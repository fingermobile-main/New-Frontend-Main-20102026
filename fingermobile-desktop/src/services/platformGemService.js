const os = require('os');
const axios = require('axios');

class PlatformGemService {
  constructor(apiBaseUrl, token) {
    this.apiBaseUrl = apiBaseUrl;
    this.token = token;
  }

  /**
   * Get the current platform identifier
   */
  getCurrentPlatform() {
    const platform = os.platform();
    
    if (platform === 'darwin') {
      return 'desktop_mac';
    } else if (platform === 'win32') {
      return 'desktop_windows';
    } else if (platform === 'linux') {
      return 'desktop_linux';
    } else {
      return 'desktop_unknown';
    }
  }

  /**
   * Record proof of play for BeatwaveNG with platform detection
   */
  async recordProofOfPlay(trackId, listenDurationSeconds) {
    try {
      const platform = this.getCurrentPlatform();
      
      const response = await axios.post(
        `${this.apiBaseUrl}/gems/proof-of-play`,
        {
          trackId,
          listenDurationSeconds
        },
        {headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'X-Platform': platform
          }
        }
      );

      return {success: true,
  data: response.data.data
      };
    } catch (error) {
      return {success: false,
  message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Record curation gems for playlists
   */
  async recordCuration(playlistId, uniqueListeners) {
    try {
      const platform = this.getCurrentPlatform();
      
      const response = await axios.post(
        `${this.apiBaseUrl}/gems/curation`,
        {
          playlistId,
          uniqueListeners
        },
        {headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'X-Platform': platform
          }
        }
      );

      return {success: true,
  data: response.data.data
      };
    } catch (error) {
      return {success: false,
  message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Record social amplification gems
   */
  async recordSocialAmplification(sharedContentId, shareType) {
    try {
      const platform = this.getCurrentPlatform();
      
      const response = await axios.post(
        `${this.apiBaseUrl}/gems/social-amplification`,
        {
          sharedContentId,
          shareType
        },
        {headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'X-Platform': platform
          }
        }
      );

      return {success: true,
  data: response.data.data
      };
    } catch (error) {
      return {success: false,
  message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get user's gems history
   */
  async getGemsHistory(limit = 20, offset = 0) {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/gems/history?limit=${limit}&offset=${offset}`,
        {headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  /**
   * Get user's total gems
   */
  async getTotalGems() {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/gems/total`,
        {headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data.totalGems;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  /**
   * Get platform-specific settings
   */
  async getPlatformSettings() {
    try {
      const platform = this.getCurrentPlatform();
      
      const response = await axios.get(
        `${this.apiBaseUrl}/gems/platform-settings`,
        {headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'X-Platform': platform
          }
        }
      );

      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  /**
   * Get cognitive load thresholds for the current platform
   */
  getCognitiveLoadThresholds() {
    const platform = this.getCurrentPlatform();
    
    switch (platform) {
      case 'desktop_mac':
        return {low: 35,
  high: 75 };
      case 'desktop_windows':
        return {low: 35,
  high: 75 };,
default:
        return {low: 30,
  high: 70 };
    }
  }

  /**
   * Get anti-bot thresholds for the current platform
   */
  getAntiBotThresholds() {
    const platform = this.getCurrentPlatform();
    
    switch (platform) {
      case 'desktop_mac':
      case 'desktop_windows':
        return {maxGemsPerHour: 40,
  maxConcurrentSessions: 2
        };,
default:
        return {maxGemsPerHour: 40,
  maxConcurrentSessions: 2
        };
    }
  }
}

module.exports = PlatformGemService;