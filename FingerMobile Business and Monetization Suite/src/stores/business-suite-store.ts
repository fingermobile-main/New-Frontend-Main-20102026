import { create } from 'zustand';
import { 
  BusinessSuiteOverview as BusinessSuiteOverviewType,
  Eligibility, 
  EstimateRequest, 
  EstimateResponse,
  AffiliateMetrics,
  Revenue as RevenueType,
  User,
  SeshatPage,
  MonetizationMetrics,
  PlatformConfig,
  AdminData,
  ApplicationRequest
} from '../../shared/types'; // Updated import path

interface BusinessSuiteState {
  overview: BusinessSuiteOverviewType | null;
  eligibility: Eligibility | null;
  estimate: EstimateResponse | null;
  affiliate: AffiliateMetrics | null;
  revenue: RevenueType | null;
  user: User | null;
  seshatPage: SeshatPage | null;
  monetizationMetrics: MonetizationMetrics | null;
  platformConfig: PlatformConfig | null;
  adminData: AdminData | null;
  applicationRequest: ApplicationRequest | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchOverview: (userId: string) => Promise<void>;
  fetchEligibility: (userId: string) => Promise<void>;
  calculateEstimate: (request: EstimateRequest) => Promise<void>;
  fetchAffiliate: (userId: string) => Promise<void>;
  fetchRevenue: (userId: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  updateSeshatPage: (pageData: Partial<SeshatPage>) => void;
  updateMonetizationMetrics: (metrics: Partial<MonetizationMetrics>) => void;
  updatePlatformConfig: (config: Partial<PlatformConfig>) => void;
  updateAdminData: (data: Partial<AdminData>) => void;
  submitApplication: (request: ApplicationRequest) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useBusinessSuiteStore = create<BusinessSuiteState>((set, _get) => ({ // Using underscore for unused parameter
  overview: null,
  eligibility: null,
  estimate: null,
  affiliate: null,
  revenue: null,
  user: null,
  seshatPage: null,
  monetizationMetrics: null,
  platformConfig: null,
  adminData: null,
  applicationRequest: null,
  loading: false,
  error: null,

  fetchOverview: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call - using the correct shared interface
      const response: BusinessSuiteOverviewType = {
        user: {
          id: userId,
          fullName: 'Test User',
          email: 'user@example.com',
          role: 'user',
          age: 28,
          countryCode: 'US',
          accountAgeDays: 120,
          createdAt: new Date().toISOString()
        },
        seshatPage: null,
        metrics: {
          followers: 1250,
          watchMinutes60d: 25000,
          watchMinutes30d: 15000,
          postEngagement30d: 4.5,
          returningViewers30d: 320,
          uniqueViews30d: 12500,
          activeVideos: 25,
          consecutiveFollowerDays: 15,
          accountAgeDays: 120,
          age: 28,
          isEligibleCountry: true,
          originalContentScore: 85,
          policyViolations: 0,
          giftPurchaseEligible: true,
          verifiedBusiness: true,
          verifiedPayout: true
        },
        config: {
          id: 'config-1',
          minimumAge: 18,
          minimumPayoutThreshold: 10,
          seshatMonthlyFee: 5,
          seshatYearlyFee: 50,
          revenueSharePercentage: 50,
          giftsCashValue: 0.1,
          supportedCountries: ['US', 'CA', 'GB'],
          policyVersion: '1.0',
          affiliateBonusPercentage: 5,
          basicEligibility: {
            minFollowers: 100,
            minWatchMinutes30d: 500,
            minAccountAgeDays: 30
          },
          premiumEligibility: {
            minFollowers: 1000,
            minWatchMinutes30d: 5000,
            minAccountAgeDays: 90,
            minEngagementRate: 3
          },
          enterpriseEligibility: {
            minFollowers: 10000,
            minWatchMinutes30d: 50000,
            minAccountAgeDays: 180,
            minEngagementRate: 5,
            minContentScore: 80
          }
        },
        eligibility: {
          universalStatus: 'eligible',
          products: []
        },
        revenue: null,
        alerts: [],
        estimate: null,
        admin: {
          config: {
            id: 'config-1',
            minimumAge: 18,
            minimumPayoutThreshold: 10,
            seshatMonthlyFee: 5,
            seshatYearlyFee: 50,
            revenueSharePercentage: 50,
            giftsCashValue: 0.1,
            supportedCountries: ['US', 'CA', 'GB'],
            policyVersion: '1.0',
            affiliateBonusPercentage: 5,
            basicEligibility: {
              minFollowers: 100,
              minWatchMinutes30d: 500,
              minAccountAgeDays: 30
            },
            premiumEligibility: {
              minFollowers: 1000,
              minWatchMinutes30d: 5000,
              minAccountAgeDays: 90,
              minEngagementRate: 3
            },
            enterpriseEligibility: {
              minFollowers: 10000,
              minWatchMinutes30d: 50000,
              minAccountAgeDays: 180,
              minEngagementRate: 5,
              minContentScore: 80
            }
          },
          auditLogs: [],
          webhooks: [],
          applications: [],
          userCount: 0,
          applicationCount: 0,
          revenueStats: {
            totalRevenue: 0,
            monthlyRevenue: 0
          },
          webhookStatus: {
            lastProcessed: '',
            status: ''
          }
        },
        affiliate: null,
        seshat: null,
        programs: []
      };
      set({ overview: response, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchEligibility: async (userId: string) => { // Now using the parameter
    set({ loading: true, error: null });
    try {
      // Simulate API call
      const response: Eligibility = {
        universalStatus: 'eligible',
        products: [
          {
            product: 'basic',
            status: 'eligible',
            passedRules: ['followers', 'watch_minutes', 'account_age'],
            failedRules: [],
            nextActions: []
          },
          {
            product: 'premium',
            status: 'eligible',
            passedRules: ['followers', 'watch_minutes', 'account_age', 'engagement_rate'],
            failedRules: [],
            nextActions: []
          },
          {
            product: 'enterprise',
            status: 'ineligible',
            passedRules: ['followers', 'watch_minutes'],
            failedRules: ['account_age', 'engagement_rate'],
            nextActions: ['Wait for account to mature', 'Improve engagement']
          }
        ]
      };
      set({ eligibility: response, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  calculateEstimate: async (request: EstimateRequest) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      const response: EstimateResponse = {
        totalEarnings: request.projectedVolume * 0.15,
        totalAdCost: request.projectedVolume * 0.15 * 0.6,
        creatorRevenueShare: request.projectedVolume * 0.15 * 0.4,
        cpcRevenue: request.projectedVolume * 0.005,
        ctr: 2.5,
        averageOrderValue: 45.99,
        roi: 3.2,
        clickToViewRatio: 0.08,
        salesConversionRate: 0.025,
        viewToPurchaseRate: 0.015,
        averageViewDuration: 180,
        retentionRate: 0.65,
        monthlyRevenue: (request.projectedVolume * 0.15) / 12,
        annualRevenue: request.projectedVolume * 0.15,
        estimatedCpm: 4.2,
        revenueSharePercentage: 45
      };
      set({ estimate: response, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchAffiliate: async (userId: string) => { // Now using the parameter
    set({ loading: true, error: null });
    try {
      // Simulate API call
      const response: AffiliateMetrics = {
        totalEarnings: 850.25,
        activeReferrals: 24,
        conversionRate: 3.2,
        commissionRate: 0.15,
        referralCode: 'FINGERMOBILE2023',
        activity: [
          { date: '2023-06-01', referral: 'ref123', action: 'signup', commission: 10, status: 'pending' },
          { date: '2023-06-05', referral: 'ref456', action: 'purchase', commission: 125.50, status: 'completed' }
        ]
      };
      set({ affiliate: response, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchRevenue: async (userId: string) => { // Now using the parameter
    set({ loading: true, error: null });
    try {
      // Simulate API call - using the correct shared interface
      const response: RevenueType = {
        id: 1,
        userId: userId,
        availableBalance: 1250.75,
        pendingPayouts: 0,
        monthRevenue: 1250.75,
        thresholdRemaining: 0,
        todayEarnings: 10.25,
        thisWeekEarnings: 85.30,
        thisMonthEarnings: 1250.75,
        allTimeEarnings: 5250.25,
        adsRevenue: 750.25,
        giftsRevenue: 350.50,
        subscriptionRevenue: 150.00,
        paymentHistory: [],
        createdAt: new Date().toISOString()
      };
      set({ revenue: response, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateUser: (userData) => {
    set((state) => ({ user: { ...state.user!, ...userData } }));
  },

  updateSeshatPage: (pageData) => {
    set((state) => ({ seshatPage: { ...state.seshatPage!, ...pageData } }));
  },

  updateMonetizationMetrics: (metrics) => {
    set((state) => ({ monetizationMetrics: { ...state.monetizationMetrics!, ...metrics } }));
  },

  updatePlatformConfig: (config) => {
    set((state) => ({ platformConfig: { ...state.platformConfig!, ...config } }));
  },

  updateAdminData: (data) => {
    set((state) => ({ adminData: { ...state.adminData!, ...data } }));
  },

  submitApplication: async (request: ApplicationRequest) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      set({ applicationRequest: request, loading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));

export default useBusinessSuiteStore;