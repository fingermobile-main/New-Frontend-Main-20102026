import { 
  BusinessVerification,
  PayoutAccount,
  PlatformConfig,
  EstimateRequest,
  SeshatPage,
  ContentMetrics,
  AffiliateEvent,
  RevenueLedgerEntry,
  MonetizationApplication
} from './types';

// Payload types for incoming requests
export interface ApplicationPayload {
  id?: string;
  userId?: string;
  businessName?: string;
  name: string;
  email: string;
  businessDescription: string;
  website?: string;
  monthlyRevenue?: number;
  country: string;
  productInterest: string[];
  status?: string;
  submittedAt?: Date;
}

export interface BusinessVerificationPayload {
  id?: string;
  businessName: string;
  registrationNumber: string;
  taxId: string;
  incorporationDate: string;
  businessAddress: string;
  supportingDocuments: string[];
  status?: string;
  verifiedAt?: Date | null;
}

export interface PayoutAccountPayload {
  id?: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  bankCountry: string;
  currency: string;
  isVerified?: boolean;
}

export interface PlatformConfigPayload {
  minimumAge?: number;
  minimumPayoutThreshold?: number;
  seshatMonthlyFee?: number;
  seshatYearlyFee?: number;
  monetizationFeePercentage?: number;
  verificationFee?: number;
  payoutProcessingTime?: number;
  affiliateCommissionRate?: number;
  enableMonetization?: boolean;
  enableAffiliateProgram?: boolean;
  contentPolicy?: string;
  privacyPolicy?: string;
  termsOfService?: string;
}

export interface EstimatePayload {
  projectedMonthlyUsers: number;
  engagementRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  averageOrderValue: number;
  contentCategories: string[];
  geographicFocus: string[];
}

// Export the types as well using export type for isolatedModules
export type {
  BusinessVerification,
  PayoutAccount,
  PlatformConfig,
  EstimateRequest,
  SeshatPage,
  ContentMetrics,
  AffiliateEvent,
  RevenueLedgerEntry,
  MonetizationApplication
};