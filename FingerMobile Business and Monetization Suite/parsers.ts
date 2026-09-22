import { 
  ApplicationPayload, 
  BusinessVerificationPayload, 
  PayoutAccountPayload, 
  PlatformConfigPayload, 
  EstimatePayload 
} from './requests';
import { 
  MonetizationApplication, 
  BusinessVerification, 
  PayoutAccount, 
  PlatformConfig, 
  EstimateRequest 
} from './types';

export const parseApplicationPayload = (payload: ApplicationPayload): MonetizationApplication => {
  return {
    id: '', // Will be generated
    userId: '', // Will be assigned
    businessName: payload.businessName || payload.name, 
    name: payload.name,
    email: payload.email,
    businessDescription: payload.businessDescription,
    website: payload.website,
    monthlyRevenue: payload.monthlyRevenue,
    country: payload.country,
    productInterest: payload.productInterest,
    status: 'pending', // Default status
    submittedAt: new Date(), // Current date
  } as MonetizationApplication;
};

export const parseBusinessVerificationPayload = (payload: BusinessVerificationPayload): BusinessVerification => {
  return {
    id: '', // Will be generated
    userId: '', // Will be assigned
    businessName: payload.businessName,
    registrationNumber: payload.registrationNumber,
    taxId: payload.taxId,
    incorporationDate: new Date(payload.incorporationDate),
    businessAddress: payload.businessAddress,
    supportingDocuments: payload.supportingDocuments,
    verificationStatus: 'pending', // Default status
  } as BusinessVerification;
};

export const parsePayoutAccountPayload = (payload: PayoutAccountPayload): PayoutAccount => {
  return {
    id: '', // Will be generated
    userId: '', // Will be assigned
    accountHolderName: payload.accountHolderName,
    accountNumber: payload.accountNumber,
    routingNumber: payload.routingNumber,
    bankName: payload.bankName,
    bankCountry: payload.bankCountry,
    currency: payload.currency,
    verificationStatus: 'pending', // Default status
    createdAt: new Date(), // Current date
    updatedAt: new Date(), // Current date
  } as PayoutAccount;
};

export const parsePlatformConfigPayload = (payload: PlatformConfigPayload): PlatformConfig => {
  return {
    minimumAge: payload.minimumAge ?? 13,
    minimumPayoutThreshold: payload.minimumPayoutThreshold ?? 100,
    seshatMonthlyFee: payload.seshatMonthlyFee ?? 5,
    seshatYearlyFee: payload.seshatYearlyFee ?? 50,
    monetizationFeePercentage: payload.monetizationFeePercentage ?? 2.9,
    verificationFee: payload.verificationFee ?? 15,
    payoutProcessingTime: payload.payoutProcessingTime ?? 7,
    affiliateCommissionRate: payload.affiliateCommissionRate ?? 0.1,
    enableMonetization: payload.enableMonetization ?? true,
    enableAffiliateProgram: payload.enableAffiliateProgram ?? true,
    contentPolicy: payload.contentPolicy ?? '',
    privacyPolicy: payload.privacyPolicy ?? '',
    termsOfService: payload.termsOfService ?? ''
  } as PlatformConfig;
};

export const parseEstimatePayload = (payload: EstimatePayload): EstimateRequest => {
  return {
    projectedMonthlyUsers: payload.projectedMonthlyUsers,
    engagementRate: payload.engagementRate,
    avgSessionDuration: payload.avgSessionDuration,
    conversionRate: payload.conversionRate,
    averageOrderValue: payload.averageOrderValue,
    contentCategories: payload.contentCategories,
    geographicFocus: payload.geographicFocus
  } as EstimateRequest;
};