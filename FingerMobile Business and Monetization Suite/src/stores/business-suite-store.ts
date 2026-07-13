import { create } from 'zustand'
import type {
  BusinessSuiteOverview,
  EstimateRequest,
  EstimateResponse,
  PlatformConfig,
} from '@shared/types';
import { businessSuiteService } from '../services/business-suite-service'

interface BusinessSuiteState {
  loading: boolean
  error: string | null
  data: BusinessSuiteOverview | null
  estimate: EstimateResponse | null
  load: () => Promise<void>
  submitApplication: (productKey: string) => Promise<void>  // Changed from Product to string
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
  data: null,
  estimate: null,
  async load() {
    set({ loading: true, error: null })

    try {
      const data = await businessSuiteService.getOverview()
      set({ data, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load suite data.',
        loading: false,
      })
    }
  },
  async submitApplication(productKey) {  // Accept string instead of Product
    await businessSuiteService.submitApplication(productKey)  // Pass string directly
    await get().load()
  },
  async estimateRevenue(payload) {
    const estimate = await businessSuiteService.estimateRevenue(payload)
    set({ estimate })
  },
  async updateBusinessVerification(payload) {
    await businessSuiteService.updateBusinessVerification(payload)
    await get().load()
  },
  async updatePayoutAccount(payload) {
    await businessSuiteService.updatePayoutAccount(payload)
    await get().load()
  },
  async updateConfig(payload) {
    await businessSuiteService.updateConfig(payload)
    await get().load()
  },
}))