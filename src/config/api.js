// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Create axios instance with defaults
const axios = require('axios');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses consistently
apiClient.interceptors.response.use(
  (response) => {
    // Return response data in a consistent format
    return {success: response.data.success,
  message: response.data.message,
  data: response.data.data,
  pagination: response.data.pagination,
  timestamp: response.data.timestamp
    };
  },
  (error) => {
    // Handle errors consistently
    const errorResponse = {success: false,
  message: error.response?.data?.message || 'An error occurred',
  errors: error.response?.data?.errors || null,
  timestamp: new Date().toISOString()
    };
    
    return Promise.reject(errorResponse);
  }
);

// API endpoints
const api = {
  // Authentication,
auth: {login: (credentials) => apiClient.post('/auth/login',
  credentials),
  register: (userData) => apiClient.post('/auth/register',
  userData),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: () => apiClient.post('/auth/refresh'),
  verifyToken: (token) => apiClient.post('/auth/verify', { token })
  },

  // User management,
users: {getCurrentUser: () => apiClient.get('/users/me'),
  updateUser: (userData) => apiClient.put('/users/me',
  userData),
  changePassword: (passwordData) => apiClient.post('/users/change-password',
  passwordData)
  },

  // Members,
members: {getAll: (params) => apiClient.get('/members', { params }),
getById: (id) => apiClient.get(`/members/${id}`),
create: (memberData) => apiClient.post('/members', memberData),
update: (id, memberData) => apiClient.put(`/members/${id}`, memberData),
delete: (id) => apiClient.delete(`/members/${id}`)
  },

  // Items,
items: {getAll: (params) => apiClient.get('/items', { params }),
getById: (id) => apiClient.get(`/items/${id}`),
create: (itemData) => apiClient.post('/items', itemData),
update: (id, itemData) => apiClient.put(`/items/${id}`, itemData),
delete: (id) => apiClient.delete(`/items/${id}`)
  },

  // Common operations,
healthCheck: () => apiClient.get('/health')
};

export default apiClient;
export { api, API_BASE_URL, DEFAULT_TIMEOUT };