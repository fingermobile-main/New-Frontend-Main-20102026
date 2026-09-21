import type {
  EstimateRequest,
  PlatformConfig,
} from '@shared/types'
import type { Product } from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`)
  }

  const payload = (await response.json()) as {
    data: T
  }

  return payload.data
}

export const api = {
  getOverview: () => request('/api/overview'),
  getPrograms: () => request('/api/monetization/programs'),
  getEligibility: () => request('/api/monetization/eligibility'),
  getVerification: () => request('/api/verification/status'),
  getRevenue: () => request('/api/revenue/ledger'),
  getAffiliate: () => request('/api/affiliate/performance'),
  getPolicy: () => request('/api/policy/monetization'),
  getAdmin: () => request('/api/admin/monitoring'),
  submitApplication: (productKey: Product) =>
    request('/api/monetization/applications', {
      method: 'POST',
      body: JSON.stringify({ productKey }),
    }),
  estimateRevenue: (payload: EstimateRequest) =>
    request('/api/monetization/estimate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateBusinessVerification: (payload: {
    legalName: string
    registrationNumber: string
    countryCode: string
  }) =>
    request('/api/verification/business', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updatePayoutAccount: (payload: {
    bankName: string
    accountLast4: string
    currency: string
  }) =>
    request('/api/verification/payout-account', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateConfig: (payload: Partial<PlatformConfig>) =>
    request('/api/admin/config', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
}

// Export individual functions for named imports
export const {
  getOverview,
  getPrograms,
  getEligibility,
  getVerification,
  getRevenue,
  getAffiliate,
  getPolicy,
  getAdmin,
  submitApplication,
  estimateRevenue,
  updateBusinessVerification,
  updatePayoutAccount,
  updateConfig
} = api;