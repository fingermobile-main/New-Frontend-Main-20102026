/**
 * FingerMobile Protocol Platform - API Client
 * Frontend API integration layer for mobile-optimized pages
 * Version: 1.0
 */

// ===== API Configuration =====
const API_CONFIG = {
  baseURL: 'http://localhost:3002',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// ===== API Client Class =====
class FingerMobileAPI {
  constructor(config = API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.headers = config.headers;
    this.sessionToken = FM.Storage.get('session_token');
  }

  // ===== HTTP Methods =====
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: {
        ...this.headers,
        ...options.headers
      },
      ...options
    };

    // Add session token if available
    if (this.sessionToken) {
      config.headers['Authorization'] = `Bearer ${this.sessionToken}`;
    }

    // Add body if present
    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle errors
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: response.statusText,
          status: response.status
        }));
        throw new APIError(error.message || 'Request failed', response.status, error);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408);
      }
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  async put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ===== Authentication API =====
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.success && response.session_token) {
      this.sessionToken = response.session_token;
      FM.Storage.set('session_token', response.session_token);
      FM.Storage.set('member_id', response.member_id);
    }
    return response;
  }

  async register(memberData) {
    return this.post('/auth/register', memberData);
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } finally {
      this.sessionToken = null;
      FM.Storage.remove('session_token');
      FM.Storage.remove('member_id');
    }
  }

  async validateSession() {
    return this.get('/auth/validate');
  }

  // ===== Members API =====
  async getMemberProfile(memberId = null) {
    const id = memberId || FM.Storage.get('member_id');
    return this.get(`/members/${id}/profile`);
  }

  async updateMemberProfile(profileData) {
    return this.put(`/members/${FM.Storage.get('member_id')}/profile`, profileData);
  }

  async searchMembers(query, options = {}) {
    return this.get('/members/search', { q: query, ...options });
  }

  async getMemberStats(memberId = null) {
    const id = memberId || FM.Storage.get('member_id');
    return this.get(`/members/${id}/stats`);
  }

  // ===== Wallet API =====
  async getWalletBalance() {
    return this.get('/wallet/balance');
  }

  async getWalletHistory(options = {}) {
    return this.get('/wallet/history', options);
  }

  async transferFIC(toMemberId, amount, description = '') {
    return this.post('/wallet/transfer', {
      to_member_id: toMemberId,
      amount,
      description
    });
  }

  async getWalletStats() {
    return this.get('/wallet/stats');
  }

  // ===== Messages API =====
  async getConversations() {
    return this.get('/messages/conversations');
  }

  async getConversationMessages(partnerId, options = {}) {
    return this.get(`/messages/conversations/${partnerId}`, options);
  }

  async sendMessage(toMemberId, content, messageType = 'text') {
    return this.post('/messages/send', {
      to_member_id: toMemberId,
      content,
      message_type: messageType
    });
  }

  async markMessagesRead(fromMemberId) {
    return this.post(`/messages/${fromMemberId}/read`);
  }

  async getUnreadCount() {
    return this.get('/messages/unread-count');
  }

  // ===== Community API =====
  async getForumThreads(options = {}) {
    return this.get('/forum/threads', options);
  }

  async getForumThread(threadId) {
    return this.get(`/forum/threads/${threadId}`);
  }

  async createForumThread(title, content, categoryId = null) {
    return this.post('/forum/threads', { title, content, category_id: categoryId });
  }

  async getForumPosts(threadId, options = {}) {
    return this.get(`/forum/threads/${threadId}/posts`, options);
  }

  async createForumPost(threadId, content) {
    return this.post(`/forum/threads/${threadId}/posts`, { content });
  }

  // ===== Marketplace API =====
  async getMarketplaceItems(options = {}) {
    return this.get('/marketplace/items', options);
  }

  async getMarketplaceItem(itemId) {
    return this.get(`/marketplace/items/${itemId}`);
  }

  async createMarketplaceListing(listingData) {
    return this.post('/marketplace/items', listingData);
  }

  async purchaseItem(itemId, quantity = 1) {
    return this.post(`/marketplace/items/${itemId}/purchase`, { quantity });
  }

  // ===== Portfolio API =====
  async getPortfolioAssets() {
    return this.get('/portfolio/assets');
  }

  async getPortfolioPerformance() {
    return this.get('/portfolio/performance');
  }

  // ===== Groups API =====
  async getGroups(options = {}) {
    return this.get('/groups', options);
  }

  async getGroup(groupId) {
    return this.get(`/groups/${groupId}`);
  }

  async joinGroup(groupId) {
    return this.post(`/groups/${groupId}/join`);
  }

  async leaveGroup(groupId) {
    return this.post(`/groups/${groupId}/leave`);
  }

  // ===== Platform Stats API =====
  async getPlatformStats() {
    return this.get('/platform/stats');
  }

  // ===== File Upload API =====
  async uploadFile(file, type = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/files/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type for FormData
    });
  }

  // ===== Utility Methods =====
  setSessionToken(token) {
    this.sessionToken = token;
    FM.Storage.set('session_token', token);
  }

  clearSession() {
    this.sessionToken = null;
    FM.Storage.remove('session_token');
    FM.Storage.remove('member_id');
  }

  isAuthenticated() {
    return !!this.sessionToken;
  }
}

// ===== API Error Class =====
class APIError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

// ===== API Response Helpers =====
const APIResponse = {
  success(data, message = 'Success') {
    return { success: true, data, message };
  },

  error(message, status = 400, details = null) {
    return { success: false, error: message, status, details };
  },

  paginated(data, page, limit, total) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    };
  }
};

// ===== Initialize API Client =====
const API = new FingerMobileAPI();

// ===== Export for use in pages =====
window.API = API;
window.APIError = APIError;
window.APIResponse = APIResponse;

// ===== Usage Examples =====
/*
// Login
try {
  const response = await API.login('user@example.com', 'password');
  console.log('Logged in:', response);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Get wallet balance
try {
  const wallet = await API.getWalletBalance();
  console.log('Balance:', wallet.balance);
} catch (error) {
  console.error('Failed to get balance:', error.message);
}

// Send message
try {
  const message = await API.sendMessage(memberId, 'Hello!');
  console.log('Message sent:', message);
} catch (error) {
  console.error('Failed to send:', error.message);
}

// Get conversations
try {
  const conversations = await API.getConversations();
  console.log('Conversations:', conversations);
} catch (error) {
  console.error('Failed to get conversations:', error.message);
}
*/
