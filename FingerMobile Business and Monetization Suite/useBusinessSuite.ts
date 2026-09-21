import { BusinessVerification, PayoutAccount, PlatformConfig, EstimateRequest, EstimateResult, SeshatPage, Eligibility, MonetizationMetrics, AdminData, Application } from './types';
import { BusinessSuiteService } from './business-suite-service';

const businessSuiteService = new BusinessSuiteService();

export interface UseBusinessSuiteReturn {
  getOverview: () => Promise<{
    applications: Application[];
    verifications: BusinessVerification[];
    payoutAccounts: PayoutAccount[];
    platformConfig: PlatformConfig;
  }>;
  getSeshat: () => Promise<SeshatPage[]>;
  getPrograms: () => Promise<any[]>;
  getEligibility: () => Promise<Eligibility>;
  estimateRevenue: (request: EstimateRequest) => Promise<EstimateResult>;
  createApplication: (application: Omit<Application, 'id'>) => Promise<Application>;
  getApplicationById: (id: string) => Promise<Application | null>;
  updateApplication: (id: string, application: Partial<Application>) => Promise<Application>;
  deleteApplication: (id: string) => Promise<void>;
  getBusinessVerifications: () => Promise<BusinessVerification[]>;
  createBusinessVerification: (verification: Omit<BusinessVerification, 'id'>) => Promise<BusinessVerification>;
  getBusinessVerificationById: (id: string) => Promise<BusinessVerification | null>;
  updateBusinessVerification: (id: string, verification: Partial<BusinessVerification>) => Promise<BusinessVerification>;
  deleteBusinessVerification: (id: string) => Promise<void>;
  getPayoutAccounts: () => Promise<PayoutAccount[]>;
  createPayoutAccount: (account: Omit<PayoutAccount, 'id'>) => Promise<PayoutAccount>;
  getPayoutAccountById: (id: string) => Promise<PayoutAccount | null>;
  updatePayoutAccount: (id: string, account: Partial<PayoutAccount>) => Promise<PayoutAccount>;
  deletePayoutAccount: (id: string) => Promise<void>;
  getPlatformConfig: () => Promise<PlatformConfig>;
  updatePlatformConfig: (config: Partial<PlatformConfig>) => Promise<PlatformConfig>;
  admin: Record<string, unknown>;
}

export const useBusinessSuite = (): UseBusinessSuiteReturn => {
  return {
    getOverview: businessSuiteService.getOverview.bind(businessSuiteService),
    getSeshat: businessSuiteService.getSeshat.bind(businessSuiteService),
    getPrograms: businessSuiteService.getPrograms.bind(businessSuiteService),
    getEligibility: businessSuiteService.getEligibility.bind(businessSuiteService),
    estimateRevenue: businessSuiteService.estimateRevenue.bind(businessSuiteService),
    createApplication: businessSuiteService.createApplication.bind(businessSuiteService),
    getApplicationById: businessSuiteService.getApplicationById.bind(businessSuiteService),
    updateApplication: businessSuiteService.updateApplication.bind(businessSuiteService),
    deleteApplication: businessSuiteService.deleteApplication.bind(businessSuiteService),
    getBusinessVerifications: businessSuiteService.getBusinessVerifications.bind(businessSuiteService),
    createBusinessVerification: businessSuiteService.createBusinessVerification.bind(businessSuiteService),
    getBusinessVerificationById: businessSuiteService.getBusinessVerificationById.bind(businessSuiteService),
    updateBusinessVerification: businessSuiteService.updateBusinessVerification.bind(businessSuiteService),
    deleteBusinessVerification: businessSuiteService.deleteBusinessVerification.bind(businessSuiteService),
    getPayoutAccounts: businessSuiteService.getPayoutAccounts.bind(businessSuiteService),
    createPayoutAccount: businessSuiteService.createPayoutAccount.bind(businessSuiteService),
    getPayoutAccountById: businessSuiteService.getPayoutAccountById.bind(businessSuiteService),
    updatePayoutAccount: businessSuiteService.updatePayoutAccount.bind(businessSuiteService),
    deletePayoutAccount: businessSuiteService.deletePayoutAccount.bind(businessSuiteService),
    getPlatformConfig: businessSuiteService.getPlatformConfig.bind(businessSuiteService),
    updatePlatformConfig: businessSuiteService.updatePlatformConfig.bind(businessSuiteService),
    admin: {} // Placeholder for admin data
  };
};