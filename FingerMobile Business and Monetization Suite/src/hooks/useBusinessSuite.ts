import { 
  MonetizationApplication as Application,
  BusinessVerification, 
  PayoutAccount,
  PlatformConfig,
  EstimateRequest,
  EstimateResponse,
  SeshatPage,
  Eligibility
} from '../../shared/types';

import { businessSuiteService } from '../services/business-suite-service';

export interface UseBusinessSuiteReturn {
  getOverview: () => Promise<{
    applications: Application[];
    verifications: BusinessVerification[];
    payoutAccounts: PayoutAccount[];
    platformConfig: PlatformConfig;
  }>;
  getSeshat: () => Promise<SeshatPage[]>;
  getPrograms: () => Promise<unknown[]>;
  getEligibility: () => Promise<Eligibility>;
  estimateRevenue: (request: EstimateRequest) => Promise<EstimateResponse>;
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
    getOverview: businessSuiteService.getOverview,
    getSeshat: () => Promise.resolve([]),
    getPrograms: businessSuiteService.getPrograms,
    getEligibility: () => Promise.resolve({
      universalStatus: 'eligible',
      products: {},
      metrics: {
        userBase: 0,
        engagementRate: 0,
        contentVolume: 0,
        geographicDistribution: {},
        deviceBreakdown: {},
        revenuePotential: 0,
        riskFactors: []
      },
      alerts: []
    }),
    estimateRevenue: businessSuiteService.estimateRevenue,
    createApplication: () => Promise.resolve({} as Application),
    getApplicationById: () => Promise.resolve(null),
    updateApplication: () => Promise.resolve({} as Application),
    deleteApplication: () => Promise.resolve(),
    getBusinessVerifications: () => Promise.resolve([]),
    createBusinessVerification: () => Promise.resolve({} as BusinessVerification),
    getBusinessVerificationById: () => Promise.resolve(null),
    updateBusinessVerification: businessSuiteService.updateBusinessVerification,
    deleteBusinessVerification: () => Promise.resolve(),
    getPayoutAccounts: () => Promise.resolve([]),
    createPayoutAccount: () => Promise.resolve({} as PayoutAccount),
    getPayoutAccountById: () => Promise.resolve(null),
    updatePayoutAccount: businessSuiteService.updatePayoutAccount,
    deletePayoutAccount: () => Promise.resolve(),
    getPlatformConfig: () => Promise.resolve({} as PlatformConfig),
    updatePlatformConfig: businessSuiteService.updateConfig,
    admin: {} // Placeholder for admin data
  };
};