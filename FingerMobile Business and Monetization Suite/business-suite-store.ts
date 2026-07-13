import { create } from 'zustand'
import type {
  EstimateRequest,
  EstimateResponse,
  OverviewResponse,
  PlatformConfig,
  Product, /* ProductKey, */
} from '@shared/types'
import { api } from './api' // Import from the root-level api.ts file

interface SeshatData {
  activeSubscribers?: number;
  monthlyRevenue?: number;
  conversionRate?: number;
  avgRetention?: number;
  basicTierPrice?: number;
  premiumTierPrice?: number;
  enterpriseTierPrice?: number;
}

interface BusinessSuiteState {
  loading: boolean
  error: string | null
  data: OverviewResponse | null  // Changed from 'overview' to 'data' to match component expectations
  programs: unknown[]
  verification: unknown | null
  revenue: unknown | null
  affiliate: unknown | null
  policy: { version: string; sections: Array<{ title: string; body: string[] }> } | null
  admin: {
    config: PlatformConfig
    auditLogs: unknown[]
    webhooks: unknown[]
    applications: unknown[]
    userCount?: number;
    applicationCount?: number;
    revenueStats?: {
      totalRevenue?: number;
      monthlyRevenue?: number;
      growthRate?: number;
    };
    webhookStatus?: {
      status?: string;
      lastProcessed?: string;
      failureCount?: number;
    };
  } | null
  estimate: EstimateResponse | null
  seshat: SeshatData | null
  load: () => Promise<void>
  submitApplication: (productKey: Product) => Promise<void>
  estimateRevenue: (payload: EstimateRequest) => Promise<void>
  updateBusinessVerification: (payload: {
    legalName: string
    registrationNumber: string
    countryCode: string
  }) => Promise<void>
  updatePayoutAccount: (payload: {
    bankName: string
    accountLast4: string
    currency: string
  }) => Promise<void>
  updateConfig: (payload: Partial<PlatformConfig>) => Promise<void>
}

export const useBusinessSuiteStore = create<BusinessSuiteState>((set, get) => ({
  loading: false,
  error: null,
  data: null,  // Changed from 'overview' to 'data'
  programs: [],
  verification: null,
  revenue: null,
  affiliate: null,
  policy: null,
  admin: null,
  estimate: null,
  seshat: null,
  async load() {
    set({ loading: true, error: null })

    try {
      const [overview, programs, verification, revenue, affiliate, policy, admin] =
        await Promise.all([
          api.getOverview(),
          api.getPrograms(),
          api.getVerification(),
          api.getRevenue(),
          api.getAffiliate(),
          api.getPolicy(),
          api.getAdmin(),
        ])

      set({
        data: overview as OverviewResponse,  // Changed from 'overview' to 'data'
        programs: programs as unknown[],
        verification: verification,
        revenue: revenue,
        affiliate: affiliate,
        policy: policy as { version: string; sections: Array<{ title: string; body: string[] }> } | null,
        admin: admin as {
          config: PlatformConfig
          auditLogs: unknown[]
          webhooks: unknown[]
          applications: unknown[]
          userCount?: number;
          applicationCount?: number;
          revenueStats?: {
            totalRevenue?: number;
            monthlyRevenue?: number;
            growthRate?: number;
          };
          webhookStatus?: {
            status?: string;
            lastProcessed?: string;
            failureCount?: number;
          };
        } | null,
        seshat: (overview as OverviewResponse)?.seshat || null,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load suite data.',
        loading: false,
      })
    }
  },
  async submitApplication(productKey) {
    await api.submitApplication(productKey)
    await get().load()
  },
  async estimateRevenue(payload) {
    const estimate = await api.estimateRevenue(payload)
    set({ estimate: estimate as EstimateResponse })
  },
  async updateBusinessVerification(payload) {
    await api.updateBusinessVerification(payload)
    await get().load()
  },
  async updatePayoutAccount(payload) {
    await api.updatePayoutAccount(payload)
    await get().load()
  },
  async updateConfig(payload) {
    await api.updateConfig(payload)
    await get().load()
  },
}))