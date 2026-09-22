import { create } from 'zustand'
import type {
  EstimateRequest,
  EstimateResponse,
  OverviewResponse,
  PlatformConfig,
  Eligibility,
  EstimateResult
} from './shared/types'

interface SeshatData {
  activeSubscribers?: number;
  monthlyRevenue?: number;
  conversionRate?: number;
  avgRetention?: number;
  basicTierPrice?: number;
  premiumTierPrice?: number;
  enterpriseTierPrice?: number;
}

// Extend OverviewResponse with additional properties needed by the UI
interface ExtendedOverviewResponse extends OverviewResponse {
  admin?: unknown; // Admin data for admin pages
  affiliate?: unknown[]; // Affiliate data
  revenue?: unknown[]; // Revenue data
  policy?: string; // Policy data
  seshat?: unknown[]; // Seshat data
  monetization?: unknown[]; // Monetization data
  eligibility?: Eligibility; // Eligibility data
  estimate?: EstimateResult; // Estimate data
  config?: PlatformConfig; // Config alias for backward compatibility
}

export interface BusinessSuiteState {
  overview: ExtendedOverviewResponse | null;
  seshatData: SeshatData | null;
  loading: boolean;
  error: string | null;
  fetchOverview: () => Promise<void>;
  submitApplication: (application: unknown) => Promise<void>;
  estimateRevenue: (request: EstimateRequest) => Promise<EstimateResponse>;
  updateConfig: (config: Partial<PlatformConfig>) => Promise<void>;
}

// Mock implementation of the store
export const useBusinessSuiteStore = create<BusinessSuiteState>((set) => ({
  overview: null,
  seshatData: null,
  loading: false,
  error: null,

  fetchOverview: async () => {
    set({ loading: true, error: null });
    try {
      // Mock API responses
      const mockOverview: ExtendedOverviewResponse = {
        applications: [],
        verifications: [],
        payoutAccounts: [],
        platformConfig: {
          id: 'config-1',
          minimumAge: 18,
          minimumPayoutThreshold: 100,
          seshatMonthlyFee: 10,
          seshatYearlyFee: 100,
          monetizationFeePercentage: 5,
          verificationFee: 5,
          payoutProcessingTime: 7,
          affiliateCommissionRate: 10,
          enableMonetization: true,
          enableAffiliateProgram: true,
          contentPolicy: 'Default content policy',
          privacyPolicy: 'Default privacy policy',
          termsOfService: 'Default terms of service',
          createdAt: new Date(),
          updatedAt: new Date(),
          revenueSharePercentage: 45
        },
        admin: undefined,
        affiliate: [],
        revenue: [],
        policy: 'Default policy',
        seshat: [],
        monetization: [],
        eligibility: {
          universalStatus: 'conditional',
          products: {
            basic: { eligible: true, status: 'eligible', reasons: [] },
            premium: { eligible: false, status: 'conditional', reasons: ['More followers needed'] },
            enterprise: { eligible: false, status: 'conditional', reasons: ['More followers needed', 'Higher engagement required'] }
          },
          metrics: {
            userBase: 1000,
            engagementRate: 0.05,
            contentVolume: 100,
            geographicDistribution: { US: 0.5, EU: 0.3, Other: 0.2 },
            deviceBreakdown: { mobile: 0.8, desktop: 0.2 },
            revenuePotential: 10000,
            riskFactors: [],
            followers: 500,
            watchMinutes30d: 1000,
            accountAgeDays: 30,
            policyViolations: 0,
            postEngagement30d: 2.5,
            originalContentScore: 85
          },
          alerts: []
        },
        estimate: {
          potentialRevenueRange: {
            min: 5000,
            max: 15000,
            currency: 'USD'
          },
          keyDrivers: ['User engagement', 'Content quality'],
          riskFactors: ['Competition'],
          recommendations: ['Improve content strategy'],
          confidenceLevel: 'medium'
        }
      };
      
      set({ overview: mockOverview, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  submitApplication: async (application: unknown) => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      console.log('Submitting application:', application);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  estimateRevenue: async (request: EstimateRequest): Promise<EstimateResponse> => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      const revenue = request.projectedMonthlyUsers ? request.projectedMonthlyUsers * 0.15 : 1000;
      const response: EstimateResponse = {
        estimate: {
          potentialRevenueRange: {
            min: revenue * 0.8,
            max: revenue * 1.2,
            currency: 'USD'
          },
          keyDrivers: ['User engagement', 'Content quality'],
          riskFactors: ['Competition'],
          recommendations: ['Improve content strategy'],
          confidenceLevel: 'medium'
        },
        totalEarnings: revenue,
        totalAdCost: revenue * 0.6,
        creatorRevenueShare: revenue * 0.4,
        cpcRevenue: revenue * 0.005,
        ctr: 2.5,
        averageOrderValue: 50,
        roi: 3.5,
        clickToViewRatio: 0.05,
        salesConversionRate: 0.02,
        viewToPurchaseRate: 0.01,
        averageViewDuration: 120,
        retentionRate: 0.7,
        monthlyRevenue: revenue / 12,
        annualRevenue: revenue,
        estimatedCpm: 4.5,
        revenueSharePercentage: 45
      };
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateConfig: async (config: Partial<PlatformConfig>) => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      console.log('Updating config:', config);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));