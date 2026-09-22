import apiClient from './api';
import {
  MonetizationApplication as Application,
  BusinessVerification,
  PayoutAccount,
  PlatformConfig,
  EstimateRequest,
  EstimateResponse
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
  submitApplication: async (application: Omit<Application, 'id'>) => {
    const res = await apiClient.post('/business-suite/applications', application);
    return res.data;
  },
  estimateRevenue: async (request: EstimateRequest): Promise<EstimateResponse> => {
    const res = await apiClient.post('/business-suite/estimate', request);
    return res.data;
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

export default businessSuiteService;