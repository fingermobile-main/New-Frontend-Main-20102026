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
  AdminData,
  EstimateRequest  // Add this import
} from './shared/types.js';  // Changed from ./types.js to ./shared/types.js

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
  estimateRevenue: (payload: EstimateRequest) => Promise<EstimateResponse>; // Updated to return EstimateResponse
  updateBusinessVerification: (payload: unknown) => Promise<void>;
  updatePayoutAccount: (payload: unknown) => Promise<void>;
  updateConfig: (payload: Partial<PlatformConfig>) => Promise<void>;
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
    estimateRevenue: async (payload: EstimateRequest): Promise<EstimateResponse> => {
      try {
        const result: EstimateResponse = await businessSuiteService.estimateRevenue(payload);
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
    }
  };
}