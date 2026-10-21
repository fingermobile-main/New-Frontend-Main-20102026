import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  get: <T>(endpoint: string): Promise<T> => {
    return api.get<T>(endpoint).then((res) => res.data);
  },

  post: <T>(endpoint: string, data?: any): Promise<T> => {
    return api.post<T>(endpoint, data).then((res) => res.data);
  },

  put: <T>(endpoint: string, data?: any): Promise<T> => {
    return api.put<T>(endpoint, data).then((res) => res.data);
  },

  delete: <T>(endpoint: string): Promise<T> => {
    return api.delete<T>(endpoint).then((res) => res.data);
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};

export default ApiService;