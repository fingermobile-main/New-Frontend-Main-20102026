import { create } from 'zustand'
import type {
  EstimateRequest,
  EstimateResponse,
  OverviewResponse,
  PlatformConfig,
  ProductKey,
} from '@shared/types'
import { api } from '@/services/api'

interface BusinessSuiteState {
  loading: boolean
  error: string | null
  overview: OverviewResponse | null
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
  } | null
  estimate: EstimateResponse | null
  load: () => Promise<void>
  submitApplication: (productKey: ProductKey) => Promise<void>
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
  overview: null,
  programs: [],
  verification: null,
  revenue: null,
  affiliate: null,
  policy: null,
  admin: null,
  estimate: null,
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
        overview,
        programs,
        verification,
        revenue,
        affiliate,
        policy,
        admin,
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
    set({ estimate })
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
