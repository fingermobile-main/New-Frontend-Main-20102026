import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Overview
export const getOverview = () => apiClient.get('/business-suite/overview').then(res => res.data);

// Programs
export const getPrograms = () => apiClient.get('/business-suite/programs').then(res => res.data);

// Verification
export const getVerification = () => apiClient.get('/business-suite/verification').then(res => res.data);

// Revenue
export const getRevenue = () => apiClient.get('/business-suite/revenue').then(res => res.data);

// Affiliate
export const getAffiliate = () => apiClient.get('/business-suite/affiliate').then(res => res.data);

// Policy
export const getPolicy = () => apiClient.get('/business-suite/policy').then(res => res.data);

// Admin
export const getAdmin = () => apiClient.get('/business-suite/admin').then(res => res.data);

// Applications
export const submitApplication = (productKey: string) => 
  apiClient.post('/business-suite/applications', { productKey }).then(res => res.data);

// Estimates
export const estimateRevenue = (payload: unknown) => 
  apiClient.post('/business-suite/estimate', payload).then(res => res.data);

// Business verification updates
export const updateBusinessVerification = (payload: { legalName: string; registrationNumber: string; countryCode: string }) => 
  apiClient.put('/business-suite/verification', payload).then(res => res.data);

// Payout account updates
export const updatePayoutAccount = (payload: { bankName: string; accountLast4: string; currency: string }) => 
  apiClient.put('/business-suite/payout-account', payload).then(res => res.data);

// Config updates
export const updateConfig = (payload: Partial<import('@shared/types').PlatformConfig>) => 
  apiClient.put('/business-suite/config', payload).then(res => res.data);

export const businessSuiteService = {
  getOverview,
  getPrograms,
  getVerification,
  getRevenue,
  getAffiliate,
  getPolicy,
  getAdmin,
  submitApplication,
  estimateRevenue,
  updateBusinessVerification,
  updatePayoutAccount,
  updateConfig,
};

export default businessSuiteService;
