import { 
  Application,
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
  name: string;
  email: string;
  businessDescription: string;
  website?: string;
  monthlyRevenue?: number;
  country: string;
  productInterest: string[];
}

export interface BusinessVerificationPayload {
  businessName: string;
  registrationNumber: string;
  taxId: string;
  incorporationDate: string;
  businessAddress: string;
  supportingDocuments: string[];
}

export interface PayoutAccountPayload {
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  bankCountry: string;
  currency: string;
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

// Export the types as well
export {
  Application,
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