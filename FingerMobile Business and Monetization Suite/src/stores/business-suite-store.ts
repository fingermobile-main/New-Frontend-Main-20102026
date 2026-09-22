import { create } from 'zustand';
import { 
  MonetizationApplication,
  BusinessVerification,
  PayoutAccount,
  PlatformConfig,
  BusinessSuiteOverview,
  ProgramDefinition,
  EligibilityResponse,
  SeshatPage,
  AffiliateMetrics,
  EstimateResponse,
  CreateApplicationRequest,
  EstimateRequest
} from '../../shared/types';
import { BusinessSuiteService } from '../services/business-suite-service';

// Initialize service instance
const businessSuiteService = new BusinessSuiteService();

interface BusinessSuiteState {
  overview: BusinessSuiteOverview | null;
  seshatPages: SeshatPage[] | null;
  programs: ProgramDefinition[] | null;
  eligibility: EligibilityResponse | null;
  estimate: EstimateResponse | null;
  applications: MonetizationApplication[] | null;
  verifications: BusinessVerification[] | null;
  payoutAccounts: PayoutAccount[] | null;
  config: PlatformConfig | null;
  affiliateMetrics: AffiliateMetrics | null;
  loading: boolean;
  error: string | null;
}

interface BusinessSuiteActions {
  fetchOverview: () => Promise<void>;
  fetchSeshatPages: () => Promise<void>;
  fetchPrograms: () => Promise<void>;
  fetchEligibility: (userId: string) => Promise<void>;
  fetchApplications: (userId: string) => Promise<void>;
  fetchVerifications: (userId: string) => Promise<void>;
  fetchPayoutAccounts: (userId: string) => Promise<void>;
  fetchConfig: () => Promise<void>;
  fetchAffiliateMetrics: (userId: string) => Promise<void>;
  submitApplication: (application: CreateApplicationRequest) => Promise<void>;  // Changed type
  updateVerification: (verification: Partial<BusinessVerification>) => Promise<void>;
  updatePayoutAccount: (payoutAccount: Partial<PayoutAccount>) => Promise<void>;
  updateConfig: (config: Partial<PlatformConfig>) => Promise<void>;
  estimateRevenue: (payload: EstimateRequest) => Promise<EstimateResponse>;
}

type BusinessSuiteStore = BusinessSuiteState & BusinessSuiteActions;

export const useBusinessSuiteStore = create<BusinessSuiteStore>((set) => ({
  overview: null,
  seshatPages: null,
  programs: null,
  eligibility: null,
  estimate: null,
  applications: null,
  verifications: null,
  payoutAccounts: null,
  config: null,
  affiliateMetrics: null,
  loading: false,
  error: null,

  fetchOverview: async () => {
    set({ loading: true, error: null });
    try {
      // Mock implementation - in a real app, this would call an API
      const mockOverview: BusinessSuiteOverview = {
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
        admin: {
          id: 'admin-1',
          overview: {
            totalUsers: 1000,
            activeUsers: 800,
            totalPosts: 5000,
            totalComments: 10000,
            totalRevenue: 50000,
            subscriptions: {
              active: 100,
              pending: 10,
              expired: 5
            }
          },
          recentActivity: [],
          systemStats: {
            uptime: 99.9,
            memoryUsage: 45,
            cpuUsage: 30,
            diskUsage: 60
          },
          performanceMetrics: []
        },
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

  fetchSeshatPages: async () => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      const mockSeshat: SeshatPage[] = [];
      set({ seshatPages: mockSeshat, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchPrograms: async () => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      const mockPrograms: ProgramDefinition[] = [];
      set({ programs: mockPrograms, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchEligibility: async (_userId: string) => {
    void _userId;
    set({ loading: true, error: null });
    try {
      // Mock implementation
      const mockEligibility: EligibilityResponse = {
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
        }
      };
      set({ eligibility: mockEligibility, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchEstimate: async (request: EstimateRequest) => {
    set({ loading: true, error: null });
    try {
      // Mock implementation - similar to the service function
      const { projectedMonthlyUsers = 1000 } = request;
      const revenue = projectedMonthlyUsers * 0.15; // Simplified calculation
      
      const mockEstimate: EstimateResponse = {
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
      
      set({ estimate: mockEstimate, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchApplications: async () => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      const mockApplications: MonetizationApplication[] = [];
      set({ applications: mockApplications, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchVerifications: async () => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      const mockVerifications: BusinessVerification[] = [];
      set({ verifications: mockVerifications, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchPayoutAccounts: async () => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      const mockPayoutAccounts: PayoutAccount[] = [];
      set({ payoutAccounts: mockPayoutAccounts, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchConfig: async () => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      const mockConfig: PlatformConfig = { 
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
      };
      set({ config: mockConfig, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchAffiliateMetrics: async (_userId: string) => {
    void _userId;
    set({ loading: true, error: null });
    try {
      // Mock implementation
      const mockAffiliateMetrics: AffiliateMetrics = {
        totalReferrals: 10,
        totalCommission: 150,
        conversionRate: 0.05,
        averageCommissionPerReferral: 15,
        topPerformingReferrals: ['user1', 'user2', 'user3'],
        monthlyTrends: [
          { month: 'Jan 2023', referrals: 5, commission: 75 },
          { month: 'Feb 2023', referrals: 7, commission: 105 },
          { month: 'Mar 2023', referrals: 12, commission: 180 }
        ]
      };
      set({ affiliateMetrics: mockAffiliateMetrics, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  submitApplication: async (application: CreateApplicationRequest) => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      console.log('Submitting application:', application);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateVerification: async (verification: Partial<BusinessVerification>) => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      console.log('Updating verification:', verification);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updatePayoutAccount: async (payoutAccount: Partial<PayoutAccount>) => {
    set({ loading: true, error: null });
    try {
      // Mock implementation
      console.log('Updating payout account:', payoutAccount);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
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
  },

  estimateRevenue: async (payload: EstimateRequest) => {
    set({ loading: true, error: null });
    try {
      const result = await businessSuiteService.estimateRevenue(payload);
      set({ estimate: result, loading: false });
      return result;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  }
}));