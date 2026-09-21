import type { EstimateRequest, SeshatPage, PlatformConfig } from './types.js'

// Define the types that were missing
export type { EstimateRequest, SeshatPage, PlatformConfig };

// Export a basic Product type to satisfy the import
export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  status: string;
  features: string[];
};

// New interfaces for request types
interface ApplicationPayload {
  productKey: string;
}

interface EstimatePayload {
  productKey: string;
  region: string;
  projectedVolume: number;
}

interface SeshatPayload {
  name: string;
  description?: string;
  visibility: 'public' | 'private' | 'unlisted';
  billingPlan?: string;  // Add billingPlan property
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
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
  submitApplication: (productKey: string) =>
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

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value.trim() : fallback

const asNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function parseSeshatPayload(body: unknown): SeshatPayload {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid seshat payload');
  }

  const { name, description, visibility, billingPlan } = body as Record<string, unknown>;
  
  if (!name || typeof name !== 'string') {
    throw new Error('Missing or invalid name');
  }

  if (visibility && !['public', 'private', 'unlisted'].includes(visibility as string)) {
    throw new Error('Invalid visibility value');
  }

  return { 
    name, 
    description: typeof description === 'string' ? description : undefined,
    visibility: (visibility as 'public' | 'private' | 'unlisted') || 'public',
    billingPlan: typeof billingPlan === 'string' ? billingPlan : undefined
  };
}

export function parseApplicationPayload(body: unknown): ApplicationPayload {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid application payload');
  }

  const { productKey } = body as Record<string, unknown>;
  
  if (!productKey || typeof productKey !== 'string') {
    throw new Error('Missing or invalid productKey');
  }

  return { productKey };
}

export function parseBusinessVerificationPayload(body: unknown) {
  const payload = body as Record<string, unknown>

  return {
    legalName: asString(payload?.legalName, 'Unknown Business'),
    registrationNumber: asString(payload?.registrationNumber, 'PENDING'),
    countryCode: asString(payload?.countryCode, 'US'),
  }
}

export function parsePayoutPayload(body: unknown) {
  const payload = body as Record<string, unknown>

  return {
    bankName: asString(payload?.bankName, 'FingerMobile Treasury'),
    accountLast4: asString(payload?.accountLast4, '0000').slice(-4),
    currency: asString(payload?.currency, 'USD'),
  }
}

export function parseEstimatePayload(body: unknown): EstimatePayload {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid estimate payload');
  }

  const { productKey, region, projectedVolume } = body as Record<string, unknown>;
  
  if (!productKey || typeof productKey !== 'string') {
    throw new Error('Missing or invalid productKey');
  }

  if (!region || typeof region !== 'string') {
    throw new Error('Missing or invalid region');
  }

  if (typeof projectedVolume !== 'number' || projectedVolume < 0) {
    throw new Error('Missing or invalid projectedVolume');
  }

  return { productKey, region, projectedVolume };
}

export function parseConfigPayload(body: unknown): Partial<PlatformConfig> {
  const payload = body as Record<string, unknown>

  return {
    minimumAge: asNumber(payload?.minimumAge, 22),
    minimumPayoutThreshold: asNumber(payload?.minimumPayoutThreshold, 100),
    seshatMonthlyFee: asNumber(payload?.seshatMonthlyFee, 24.99),
    seshatYearlyFee: asNumber(payload?.seshatYearlyFee, 249.99),
    revenueSharePercentage: asNumber(payload?.revenueSharePercentage, 0.55),
    giftsCashValue: asNumber(payload?.giftsCashValue, 0.01),
    supportedCountries: Array.isArray(payload?.supportedCountries)
      ? payload.supportedCountries.map((value) => asString(value)).filter(Boolean)
      : ['US', 'GB', 'CA'],
    policyVersion: asString(payload?.policyVersion, '2026.07'),
    affiliateBonusPercentage: asNumber(payload?.affiliateBonusPercentage, 0.01),
  }
}