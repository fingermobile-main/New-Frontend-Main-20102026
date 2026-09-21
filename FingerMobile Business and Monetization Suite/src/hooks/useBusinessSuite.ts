import { useEffect, useState } from 'react';
import { 
  BusinessSuiteOverview,
  User,
  SeshatPage,
  MonetizationMetrics,
  PlatformConfig,
  Eligibility,
  Revenue,
  Alert,
  EstimateResponse,
  AffiliateMetrics,
  AdminData
} from '../../shared/types';
import { businessSuiteService } from '../services/business-suite-service'; // Add the missing import

// Add missing type if it's not in shared types
export interface ProgramDefinition {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'active' | 'inactive' | 'pending';
}

export interface UseBusinessSuiteReturn {
  loading: boolean;
  error: string | null;
  data: BusinessSuiteOverview | null;
  estimate: EstimateResponse | null;
  admin: Record<string, unknown>;
  affiliate: AffiliateMetrics | null;
  seshat: unknown | null;
  programs: ProgramDefinition[];
  alerts: Alert[];
  metrics: MonetizationMetrics;
  eligibility: Eligibility;
  revenue: Revenue | null;
  config: PlatformConfig;
  getOverview: () => void;
  submitApplication: (productKey: string) => Promise<void>;
  estimateRevenue: (payload: EstimateRequest) => Promise<void>; // Updated return type
  updateBusinessVerification: (payload: unknown) => Promise<void>;
  updatePayoutAccount: (payload: unknown) => Promise<void>;
  updateConfig: (payload: Partial<PlatformConfig>) => Promise<void>;
  getPrograms: () => Promise<ProgramDefinition[]>;
  getEligibility: () => Promise<Eligibility>;
  getVerification: () => Promise<unknown>;
  getRevenue: () => Promise<Revenue | null>;
  getAffiliate: () => Promise<AffiliateMetrics | null>;
  getPolicy: () => Promise<unknown>;
  getAdmin: () => Promise<AdminData>;
  updateSeshatPage: (payload: unknown) => Promise<SeshatPage>;
  getApplications: () => Promise<unknown[]>;
  createApplication: (payload: unknown) => Promise<unknown>;
  getApplicationById: (id: string) => Promise<unknown>;
  updateApplication: (id: string, payload: unknown) => Promise<unknown>;
  deleteApplication: (id: string) => Promise<void>;
  getBusinessVerifications: () => Promise<unknown[]>;
  createBusinessVerification: (payload: unknown) => Promise<unknown>;
  getBusinessVerificationById: (id: string) => Promise<unknown>;
  updateBusinessVerification: (id: string, payload: unknown) => Promise<unknown>;
  deleteBusinessVerification: (id: string) => Promise<void>;
  getRevenueLedger: () => Promise<unknown[]>;
  createRevenueLedgerEntry: (payload: unknown) => Promise<unknown>;
  getRevenueLedgerEntryById: (id: string) => Promise<unknown>;
  updateRevenueLedgerEntry: (id: string, payload: unknown) => Promise<unknown>;
  deleteRevenueLedgerEntry: (id: string) => Promise<void>;
  getPayoutAccounts: () => Promise<unknown[]>;
  createPayoutAccount: (payload: unknown) => Promise<unknown>;
  getPayoutAccountById: (id: string) => Promise<unknown>;
  updatePayoutAccount: (id: string, payload: unknown) => Promise<unknown>;
  deletePayoutAccount: (id: string) => Promise<void>;
  getPlatformConfigs: () => Promise<PlatformConfig[]>;
  createPlatformConfig: (payload: Omit<PlatformConfig, 'id'>) => Promise<string>;
  getPlatformConfigById: (id: string) => Promise<PlatformConfig>;
  updatePlatformConfig: (id: string, payload: Partial<Omit<PlatformConfig, 'id'>>) => Promise<void>;
  deletePlatformConfig: (id: string) => Promise<void>;
  getAffiliateEvents: () => Promise<unknown[]>;
  createAffiliateEvent: (payload: unknown) => Promise<unknown>;
  getAffiliateEventById: (id: string) => Promise<unknown>;
  updateAffiliateEvent: (id: string, payload: unknown) => Promise<unknown>;
  deleteAffiliateEvent: (id: string) => Promise<void>;
  getWebhookEvents: () => Promise<unknown[]>;
  createWebhookEvent: (payload: unknown) => Promise<unknown>;
  getWebhookEventById: (id: string) => Promise<unknown>;
  updateWebhookEvent: (id: string, payload: unknown) => Promise<unknown>;
  deleteWebhookEvent: (id: string) => Promise<void>;
  getAuditLogs: () => Promise<unknown[]>;
  createAuditLog: (payload: unknown) => Promise<unknown>;
  getAuditLogById: (id: string) => Promise<unknown>;
  updateAuditLog: (id: string, payload: unknown) => Promise<unknown>;
  deleteAuditLog: (id: string) => Promise<void>;
}

// Update the function to properly use the types
export function useBusinessSuite(): UseBusinessSuiteReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BusinessSuiteOverview | null>(null);
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);

  // Initialize data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const overview = await businessSuiteService.getOverview();
        setData(overview);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching business suite data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Return the proper interface implementation
  return {
    loading,
    error,
    data,
    estimate,
    // Extract individual parts from data
    admin: data?.admin || {} as Record<string, unknown>,
    affiliate: data?.affiliate || null,
    seshat: data?.seshat || null,
    programs: data?.programs || [],
    alerts: data?.alerts || [],
    metrics: data?.metrics || {
      followers: 0,
      watchMinutes60d: 0,
      watchMinutes30d: 0,
      postEngagement30d: 0,
      returningViewers30d: 0,
      uniqueViews30d: 0,
      activeVideos: 0,
      consecutiveFollowerDays: 0,
      accountAgeDays: 0,
      isEligibleCountry: false,
      originalContentScore: 0,
      policyViolations: 0,
      giftPurchaseEligible: false,
      verifiedBusiness: false,
      verifiedPayout: false
    },
    eligibility: data?.eligibility || {
      universalStatus: 'ineligible',
      products: []
    },
    revenue: data?.revenue || null,
    config: data?.config || {
      minimumAge: 18,
      minimumPayoutThreshold: 100,
      seshatMonthlyFee: 24.99,
      seshatYearlyFee: 249.99,
      revenueSharePercentage: 0.55,
      giftsCashValue: 0.01,
      supportedCountries: ['US'],
      policyVersion: '2026.07',
      affiliateBonusPercentage: 0.01
    },
    // Methods implementation
    getOverview: async () => {
      try {
        const overview = await businessSuiteService.getOverview();
        setData(overview);
        return overview;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    submitApplication: async (productKey: string) => {
      try {
        await businessSuiteService.submitApplication(productKey);
        // Refresh data after submission
        const overview = await businessSuiteService.getOverview();
        setData(overview);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    estimateRevenue: async (payload: EstimateRequest) => {
      try {
        const result = await businessSuiteService.estimateRevenue(payload);
        setEstimate(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updateBusinessVerification: async (payload: unknown) => {
      try {
        await businessSuiteService.updateBusinessVerification(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updatePayoutAccount: async (payload: unknown) => {
      try {
        await businessSuiteService.updatePayoutAccount(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updateConfig: async (payload: Partial<PlatformConfig>) => {
      try {
        await businessSuiteService.updateConfig(payload);
        // Refresh data after update
        const overview = await businessSuiteService.getOverview();
        setData(overview);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getPrograms: async () => {
      try {
        const programs = await businessSuiteService.getPrograms();
        return Array.isArray(programs) ? programs : [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getEligibility: async () => {
      try {
        return await businessSuiteService.getEligibility();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getVerification: async () => {
      try {
        return await businessSuiteService.getVerification();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getRevenue: async () => {
      try {
        return await businessSuiteService.getRevenue();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getAffiliate: async () => {
      try {
        return await businessSuiteService.getAffiliate();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getPolicy: async () => {
      try {
        return await businessSuiteService.getPolicy();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getAdmin: async () => {
      try {
        return await businessSuiteService.getAdmin();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updateSeshatPage: async (payload: unknown) => {
      try {
        // This method might not exist in the service, need to adapt
        console.warn('updateSeshatPage not implemented in service');
        return {} as SeshatPage;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getApplications: async () => {
      try {
        return await businessSuiteService.getApplications();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    createApplication: async (payload: unknown) => {
      try {
        return await businessSuiteService.createApplication(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getApplicationById: async (id: string) => {
      try {
        return await businessSuiteService.getApplicationById(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updateApplication: async (id: string, payload: unknown) => {
      try {
        return await businessSuiteService.updateApplication(id, payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    deleteApplication: async (id: string) => {
      try {
        return await businessSuiteService.deleteApplication(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getBusinessVerifications: async () => {
      try {
        console.warn('getBusinessVerifications not implemented in service');
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    createBusinessVerification: async (payload: unknown) => {
      try {
        console.warn('createBusinessVerification not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getBusinessVerificationById: async (id: string) => {
      try {
        console.warn('getBusinessVerificationById not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updateBusinessVerification: async (id: string, payload: unknown) => {
      try {
        console.warn('updateBusinessVerification not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    deleteBusinessVerification: async (id: string) => {
      try {
        console.warn('deleteBusinessVerification not implemented in service');
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getRevenueLedger: async () => {
      try {
        console.warn('getRevenueLedger not implemented in service');
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    createRevenueLedgerEntry: async (payload: unknown) => {
      try {
        console.warn('createRevenueLedgerEntry not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getRevenueLedgerEntryById: async (id: string) => {
      try {
        console.warn('getRevenueLedgerEntryById not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updateRevenueLedgerEntry: async (id: string, payload: unknown) => {
      try {
        console.warn('updateRevenueLedgerEntry not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    deleteRevenueLedgerEntry: async (id: string) => {
      try {
        console.warn('deleteRevenueLedgerEntry not implemented in service');
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getPayoutAccounts: async () => {
      try {
        console.warn('getPayoutAccounts not implemented in service');
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    createPayoutAccount: async (payload: unknown) => {
      try {
        console.warn('createPayoutAccount not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getPayoutAccountById: async (id: string) => {
      try {
        console.warn('getPayoutAccountById not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updatePayoutAccount: async (id: string, payload: unknown) => {
      try {
        console.warn('updatePayoutAccount not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    deletePayoutAccount: async (id: string) => {
      try {
        console.warn('deletePayoutAccount not implemented in service');
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getPlatformConfigs: async () => {
      try {
        console.warn('getPlatformConfigs not implemented in service');
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    createPlatformConfig: async (payload: Omit<PlatformConfig, 'id'>) => {
      try {
        console.warn('createPlatformConfig not implemented in service');
        return '';
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getPlatformConfigById: async (id: string) => {
      try {
        console.warn('getPlatformConfigById not implemented in service');
        return {} as PlatformConfig;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updatePlatformConfig: async (id: string, payload: Partial<Omit<PlatformConfig, 'id'>>) => {
      try {
        console.warn('updatePlatformConfig not implemented in service');
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    deletePlatformConfig: async (id: string) => {
      try {
        console.warn('deletePlatformConfig not implemented in service');
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getAffiliateEvents: async () => {
      try {
        console.warn('getAffiliateEvents not implemented in service');
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    createAffiliateEvent: async (payload: unknown) => {
      try {
        console.warn('createAffiliateEvent not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getAffiliateEventById: async (id: string) => {
      try {
        console.warn('getAffiliateEventById not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updateAffiliateEvent: async (id: string, payload: unknown) => {
      try {
        console.warn('updateAffiliateEvent not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    deleteAffiliateEvent: async (id: string) => {
      try {
        console.warn('deleteAffiliateEvent not implemented in service');
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getWebhookEvents: async () => {
      try {
        console.warn('getWebhookEvents not implemented in service');
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    createWebhookEvent: async (payload: unknown) => {
      try {
        console.warn('createWebhookEvent not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getWebhookEventById: async (id: string) => {
      try {
        console.warn('getWebhookEventById not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updateWebhookEvent: async (id: string, payload: unknown) => {
      try {
        console.warn('updateWebhookEvent not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    deleteWebhookEvent: async (id: string) => {
      try {
        console.warn('deleteWebhookEvent not implemented in service');
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getAuditLogs: async () => {
      try {
        console.warn('getAuditLogs not implemented in service');
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    createAuditLog: async (payload: unknown) => {
      try {
        console.warn('createAuditLog not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    getAuditLogById: async (id: string) => {
      try {
        console.warn('getAuditLogById not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    updateAuditLog: async (id: string, payload: unknown) => {
      try {
        console.warn('updateAuditLog not implemented in service');
        return {};
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    deleteAuditLog: async (id: string) => {
      try {
        console.warn('deleteAuditLog not implemented in service');
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    }
  };
}