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
  affiliate: Record<string, unknown>;
  load: () => Promise<void>;
  submitApplication: (productKey: string) => Promise<void>; // Changed from ApplicationRequest to string
  estimateRevenue: (payload: EstimateRequest) => Promise<void>;
  updateBusinessVerification: (payload: {
    legalName: string;
    registrationNumber: string;
    countryCode: string;
  }) => Promise<void>;
  updatePayoutAccount: (payload: {
    bankName: string;
    accountLast4: string;
    currency: string;
  }) => Promise<void>;
  updateConfig: (payload: Partial<PlatformConfig>) => Promise<void>;
  getPrograms: () => Promise<ProgramDefinition[]>;
}

export const useBusinessSuite = (): UseBusinessSuiteReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BusinessSuiteOverview | null>(null);
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await businessSuiteService.getOverview();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async (productKey: string) => { // Changed parameter type
    try {
      await businessSuiteService.submitApplication(productKey); // Pass string directly
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    }
  };

  const estimateRevenue = async (payload: EstimateRequest) => {
    try {
      const result = await businessSuiteService.estimateRevenue(payload);
      setEstimate(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to estimate revenue');
      throw err;
    }
  };

  const updateBusinessVerification = async (payload: {
    legalName: string;
    registrationNumber: string;
    countryCode: string;
  }) => {
    try {
      await businessSuiteService.updateBusinessVerification(payload);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update verification');
    }
  };

  const updatePayoutAccount = async (payload: {
    bankName: string;
    accountLast4: string;
    currency: string;
  }) => {
    try {
      await businessSuiteService.updatePayoutAccount(payload);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payout account');
    }
  };

  const updateConfig = async (payload: Partial<PlatformConfig>) => {
    try {
      await businessSuiteService.updateConfig(payload);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update config');
    }
  };

  // Added getPrograms function
  const getPrograms = async (): Promise<ProgramDefinition[]> => {
    try {
      const programs = await businessSuiteService.getPrograms();
      return programs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get programs');
      throw err;
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    loading,
    error,
    data,
    estimate,
    admin: data?.admin || {} as Record<string, unknown>,
    affiliate: data?.affiliate ? { ...data.affiliate } as Record<string, unknown> : {} as Record<string, unknown>,
    load,
    submitApplication,
    estimateRevenue,
    updateBusinessVerification,
    updatePayoutAccount,
    updateConfig,
    getPrograms,
  };
};