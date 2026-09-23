import apiClient from './api';
import { 
  EstimateRequest, 
  EstimateResponse, 
  MonetizationApplication,
  BusinessVerification, 
  PayoutAccount, 
  PlatformConfig,
  EstimateResult
} from '../../shared/types';

export const businessSuiteService = {
  getOverview: async () => {
    const res = await apiClient.get('/business-suite/overview');
    return res.data;
  },
  getPrograms: async () => {
    const res = await apiClient.get('/business-suite/programs');
    return res.data;
  },
  getVerification: async () => {
    const res = await apiClient.get('/business-suite/verification');
    return res.data;
  },
  getRevenue: async () => {
    const res = await apiClient.get('/business-suite/revenue');
    return res.data;
  },
  getAffiliate: async () => {
    const res = await apiClient.get('/business-suite/affiliate');
    return res.data;
  },
  getPolicy: async () => {
    const res = await apiClient.get('/business-suite/policy');
    return res.data;
  },
  getAdmin: async () => {
    const res = await apiClient.get('/business-suite/admin');
    return res.data;
  },
  submitApplication: async (application: Omit<MonetizationApplication, 'id'>) => {
    const res = await apiClient.post('/business-suite/applications', application);
    return res.data;
  },
  estimateRevenue: async (request: EstimateRequest): Promise<EstimateResponse> => {
    const res = await apiClient.post('/business-suite/estimate', request);
    return res.data as EstimateResponse;
  },
  updateBusinessVerification: async (id: string, verification: Partial<BusinessVerification>) => {
    const res = await apiClient.patch(`/business-suite/verifications/${id}`, verification);
    return res.data;
  },
  updatePayoutAccount: async (id: string, account: Partial<PayoutAccount>) => {
    const res = await apiClient.patch(`/business-suite/payout-accounts/${id}`, account);
    return res.data;
  },
  updateConfig: async (config: Partial<PlatformConfig>) => {
    const res = await apiClient.patch('/business-suite/config', config);
    return res.data;
  }
};

// Standalone functions (if needed separately)
export const submitApplicationStandalone = async (application: Omit<MonetizationApplication, 'id'>) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Use apiClient instead of apiCall to maintain consistency
    const res = await apiClient.post('/applications', application);
    return res.data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

export const fetchEstimate = async (request: EstimateRequest): Promise<EstimateResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const res = await apiClient.post('/estimate', request);
    
    // Explicitly cast the response data to EstimateResponse type
    return res.data as EstimateResponse;
  } catch (error) {
    console.error('Error fetching estimate:', error);
    // Return a default value in case of error to satisfy the return type
    const defaultEstimate: EstimateResponse = {
      estimate: {
        potentialRevenueRange: {
          min: 0,
          max: 0,
          currency: 'USD'
        },
        keyDrivers: [],
        riskFactors: [],
        recommendations: [],
        confidenceLevel: 'low'
      } as EstimateResult
    };
    return defaultEstimate;
  }
};