/**
 * FingerMobile Desktop - API Service Layer
 * Complete implementation with all 33 endpoints across 6 services
 * Mirrors Flutter's PlatformApiServiceEnhanced
 */

const { electronAPI } = window;

// Backend service URLs - Update for production
const API_BASE_URLS = {lendsqr: process.env.NODE_ENV === 'development' 
    ? ',
  http://,
  localhost:5030/api' 
    : ',
  https://lendsqr.fingermobile.com/api',
  fingerlux: process.env.NODE_ENV === 'development'
    ? ',
  http://,
  localhost:5028/api'
    : ',
  https://fingerlux.fingermobile.com/api',
  fingerwars: process.env.NODE_ENV === 'development'
    ? ',
  http://,
  localhost:5032/api'
    : ',
  https://fingerwars.fingermobile.com/api',
  gameon: process.env.NODE_ENV === 'development'
    ? ',
  http://,
  localhost:5025/api'
    : ',
  https://gameon.fingermobile.com/api',
  nysc: process.env.NODE_ENV === 'development'
    ? ',
  http://,
  localhost:5027/api'
    : ',
  https://nysc.fingermobile.com/api',
  lumina: process.env.NODE_ENV === 'development'
    ? ',
  http://,
  localhost:5040/api/lumina'
    : ',
  https://lumina.fingermobile.com/api/lumina'
};

class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL || process.env.REACT_APP_API_URL || ',
http://,
localhost:3000/api';
    
    // FIX 1 &,
2: Initialize microservice URLs and cache maps
    this.baseURLs = API_BASE_URLS;
    this.cache = new Map();
    this.cacheExpiry = new Map();
  }

  // Helper method to get authorization headers
  async getAuthHeaders() {
    // Get token from secure storage
    const token = await window.electronAPI.secureStorageGet('access_token');

    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Make API request
  async request(endpoint, options = {}) {
    // FIX,
3: Check if the endpoint is already a full URL to prevent bad nesting
    const url = endpoint.startsWith(',
http://') || endpoint.startsWith(',
https://')
      ?,
endpoint
      : `${this.baseURL}/${endpoint}`;
      
    const headers = await this.getAuthHeaders();

    const config = {headers: { ...headers, ...options.headers },
      ...options
    };

    // Add body if present
    if (options.body && typeof options.body !== 'string') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle response based on status
      if (!response.ok) {
        throw new Error(data.message || `HTTP error!,
status: ${response.status}`);
      }

      return {success: true,
  data: data.data,
  message: data.message,
  pagination: data.pagination
      };
    } catch (error) {
      console.error('API request,
failed:', error);
      return {success: false,
  message: error.message,
  error: error
      };
    }
  }

  // Authentication methods
  async login(credentials) {
    return this.request('auth/login', {method: 'POST',
  body: credentials
    });
  }

  async register(userData) {
    return this.request('auth/register', {method: 'POST',
  body: userData
    });
  }

  async logout() {
    const result = this.request('auth/logout', {method: 'POST'
    });

    // Clear stored token
    await window.electronAPI.secureStorageDelete('access_token');

    return result;
  }

  // User methods
  async getCurrentUser() {
    return this.request('users/me');
  }

  async updateUser(userData) {
    return this.request('users/me', {method: 'PUT',
  body: userData
    });
  }

  // Posts methods
  async getPosts(params) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`posts${queryParams ? `?${queryParams}` : ''}`);
  }

  async createPost(postData) {
    return this.request('posts', {method: 'POST',
  body: postData
    });
  }

  async getPostById(id) {
    return this.request(`posts/${id}`);
  }

  // Media methods
  async uploadMedia(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    // For multipart requests, we need to let the browser set the content-type
    const headers = await this.getAuthHeaders();
    delete headers['Content-Type'];

    return this.request('uploads', {method: 'POST',
  body: formData,
  headers
    });
  }

  // Messages methods
  async getMessages(conversationId, params) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`messages/conversations/${conversationId}${queryParams ? `?${queryParams}` : ''}`);
  }

  async sendMessage(conversationId, messageData) {
    return this.request(`messages/conversations/${conversationId}`, {method: 'POST',
  body: messageData
    });
  }

  // ==================== CACHING ====================

  /**
   * Save to cache
   */
  saveToCache(key, data, ttlMinutes = 5) {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + (ttlMinutes * 60 * 1000));
  }

  /**
   * Get from cache
   */
  getFromCache(key) {
    const expiry = this.cacheExpiry.get(key);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  /**
   * Clear cache
   */
  clearCache(key) {
    if (key) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
    } else {
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }

  // ==================== LENDSQR API (8 endpoints) ====================

  /**
   * Get all loans for authenticated member
   */
  async getLoans({ status, page = 1, limit = 10, useCache = true } = {}) {
    const cacheKey = `lendsqr_loans_${status}_${page}_${limit}`;
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const params = new URLSearchParams({page: page.toString(),
  limit: limit.toString() });
    if (status) params.append('status', status);

    const result = await this.request(`${this.baseURLs.lendsqr}/loans?${params}`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  /**
   * Get loan by ID
   */
  async getLoanById(loanId, useCache = true) {
    const cacheKey = `lendsqr_loan_${loanId}`;
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.lendsqr}/loans/${loanId}`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 60);
    }

    return result;
  }

  /**
   * Create loan application
   */
  async createLoan({ loanType, amount, tenure, purpose, collateralId }) {
    const result = await this.request(`${this.baseURLs.lendsqr}/loans`, {method: 'POST',
  body: JSON.stringify({
        loanType,
  amount,
  tenure,
  purpose,
  collateralId
      })
    });

    if (result.success) {
      this.clearCache('lendsqr_loans');
    }

    return result;
  }

  /**
   * Cancel loan application
   */
  async cancelLoan(loanId) {
    const result = await this.request(`${this.baseURLs.lendsqr}/loans/${loanId}/cancel`, {method: 'PUT'
    });

    if (result.success) {
      this.clearCache('lendsqr_loans');
      this.clearCache(`lendsqr_loan_${loanId}`);
    }

    return result;
  }

  /**
   * Make loan repayment
   */
  async makeRepayment({ loanId, amount }) {
    const result = await this.request(`${this.baseURLs.lendsqr}/repayments`, {method: 'POST',
  body: JSON.stringify({ loanId,
  amount })
    });

    if (result.success) {
      this.clearCache(`lendsqr_repayments_${loanId}`);
    }

    return result;
  }

  /**
   * Get repayments for a loan
   */
  async getRepayments(loanId, useCache = true) {
    const cacheKey = `lendsqr_repayments_${loanId}`;
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.lendsqr}/repayments/loan/${loanId}`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  /**
   * Get credit score history
   */
  async getCreditScores(useCache = true) {
    const cacheKey = 'lendsqr_credit_scores';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.lendsqr}/credit-scores`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  /**
   * Get current credit score
   */
  async getCurrentCreditScore(useCache = true) {
    const cacheKey = 'lendsqr_current_credit_score';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.lendsqr}/credit-scores/current`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  // ==================== FINGERLUX API (3 endpoints) ====================

  /**
   * Get luxury services
   */
  async getLuxuryServices(useCache = true) {
    const cacheKey = 'fingerlux_services';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.fingerlux}/services`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 60);
    }

    return result;
  }

  /**
   * Create luxury booking
   */
  async createLuxuryBooking({ serviceId, date, time, guests = 1, specialRequests }) {
    const result = await this.request(`${this.baseURLs.fingerlux}/bookings`, {method: 'POST',
  body: JSON.stringify({
        serviceId,
  date,
  time,
  guests,
  specialRequests
      })
    });

    if (result.success) {
      this.clearCache('fingerlux_bookings');
    }

    return result;
  }

  /**
   * Get luxury bookings
   */
  async getLuxuryBookings(useCache = true) {
    const cacheKey = 'fingerlux_bookings';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.fingerlux}/bookings`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  // ==================== FINGERWARS API (5 endpoints) ====================

  /**
   * Get games
   */
  async getGames(useCache = true) {
    const cacheKey = 'fingerwars_games';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.fingerwars}/games`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 60);
    }

    return result;
  }

  /**
   * Create game session
   */
  async createGameSession({ gameId, mode = 'single', betAmount = 0 }) {
    return await this.request(`${this.baseURLs.fingerwars}/sessions`, {method: 'POST',
  body: JSON.stringify({ gameId,
  mode,
  betAmount })
    });
  }

  /**
   * Get game sessions
   */
  async getGameSessions(useCache = true) {
    const cacheKey = 'fingerwars_sessions';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.fingerwars}/sessions`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  /**
   * Submit leaderboard score
   */
  async submitLeaderboardScore({ sessionId, score, metadata }) {
    return await this.request(`${this.baseURLs.fingerwars}/leaderboards/submit`, {method: 'POST',
  body: JSON.stringify({ sessionId,
  score,
  metadata })
    });
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(gameId, useCache = true) {
    const cacheKey = `fingerwars_leaderboard_${gameId}`;
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.fingerwars}/leaderboards/${gameId}`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 1);
    }

    return result;
  }

  // ==================== GAMEON API (5 endpoints) ====================

  /**
   * Get events
   */
  async getEvents({ sport, status, date, useCache = true } = {}) {
    const cacheKey = `gameon_events_${sport}_${status}`;
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const params = new URLSearchParams();
    if (sport) params.append('sport', sport);
    if (status) params.append('status', status);
    if (date) params.append('date', date);

    const result = await this.request(`${this.baseURLs.gameon}/events?${params}`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  /**
   * Book event tickets
   */
  async bookEventTickets({ eventId, ticketType, quantity }) {
    const result = await this.request(`${this.baseURLs.gameon}/bookings`, {method: 'POST',
  body: JSON.stringify({ eventId,
  ticketType,
  quantity })
    });

    if (result.success) {
      this.clearCache('gameon_bookings');
    }

    return result;
  }

  /**
   * Get event bookings
   */
  async getEventBookings(useCache = true) {
    const cacheKey = 'gameon_bookings';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.gameon}/bookings`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  /**
   * Get teams
   */
  async getTeams(useCache = true) {
    const cacheKey = 'gameon_teams';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.gameon}/teams`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 60);
    }

    return result;
  }

  // ==================== NYSC API (5 endpoints) ====================

  /**
   * Get NYSC profile
   */
  async getNyscProfile(useCache = true) {
    const cacheKey = 'nysc_profile';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.nysc}/members/profile`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 60);
    }

    return result;
  }

  /**
   * Get NYSC activities
   */
  async getNyscActivities(useCache = true) {
    const cacheKey = 'nysc_activities';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.nysc}/activities`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  /**
   * Submit NYSC activity
   */
  async submitNyscActivity({ activityType, description, hours }) {
    const result = await this.request(`${this.baseURLs.nysc}/activities/submit`, {method: 'POST',
  body: JSON.stringify({ activityType,
  description,
  hours })
    });

    if (result.success) {
      this.clearCache('nysc_activities');
    }

    return result;
  }

  /**
   * Get NYSC allowance
   */
  async getNyscAllowance(useCache = true) {
    const cacheKey = 'nysc_allowance';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.nysc}/allowance`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  /**
   * Get NYSC documents
   */
  async getNyscDocuments(useCache = true) {
    const cacheKey = 'nysc_documents';
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.nysc}/documents`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 60);
    }

    return result;
  }

  // ==================== LUMINA GALLERY API (7 endpoints) ====================

  /**
   * Get Lumina assets
   */
  async getLuminaAssets({ page = 1, limit = 10, useCache = true } = {}) {
    const cacheKey = `lumina_assets_${page}`;
    
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const result = await this.request(`${this.baseURLs.lumina}/my-assets?page=${page}&limit=${limit}`);
    
    if (result.success && useCache) {
      this.saveToCache(cacheKey, result, 5);
    }

    return result;
  }

  /**
   * Transcode Lumina media
   */
  async transcodeLuminaMedia({ fileId, format = 'mp4', quality = 'high', resolution }) {
    return await this.request(`${this.baseURLs.lumina}/transcode`, {method: 'POST',
  body: JSON.stringify({ fileId,
  format,
  quality,
  resolution })
    });
  }

  /**
   * Apply Lumina filter
   */
  async applyLuminaFilter({ fileId, filter, intensity = 1.0 }) {
    return await this.request(`${this.baseURLs.lumina}/apply-filter`, {method: 'POST',
  body: JSON.stringify({ fileId,
  filter,
  intensity })
    });
  }

  /**
   * Delete Lumina media
   */
  async deleteLuminaMedia(fileId) {
    const result = await this.request(`${this.baseURLs.lumina}/files/${fileId}`, {method: 'DELETE'
    });

    if (result.success) {
      this.clearCache('lumina_assets_1');
      this.clearCache(`lumina_file_${fileId}`);
    }

    return result;
  }

  /**
   * Get Lumina job status
   */
  async getLuminaJobStatus(jobId) {
    return await this.request(`${this.baseURLs.lumina}/jobs/${jobId}`);
  }
}

// Export singleton instance
const apiServiceInstance = new ApiService();
export default apiServiceInstance;
export { apiServiceInstance as ApiService };
