import { 
  BusinessSuiteOverview, 
  EstimateRequest, 
  EstimateResponse,
  MonetizationApplication,
  BusinessVerification,
  PayoutAccount,
  PlatformConfig,
  OverviewResponse,
  ProgramDefinition,
  EligibilityResponse,
  SeshatPage
} from '../shared/types';
import { db } from '../database.js';
import { getAllProgramDefinitions } from './program-service.js';
import { getPayoutAccount, createPayoutAccount, updatePayoutAccount, getAllPayoutAccounts } from './payout-service.js';
import { VerificationService } from './verification-service.js';
import { getAffiliateData } from './affiliate-service.js';
import { getConfig, updateConfig } from './config-service.js';

function mapRowToApplication(row: Record<string, unknown>): MonetizationApplication {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    businessName: row.business_name as string,
    website: row.website as string,
    businessDescription: row.business_description as string,
    monthlyRevenue: row.monthly_revenue as number | undefined,
    country: row.country as string,
    productInterest: row.product_interest_json ? JSON.parse(row.product_interest_json as string) : [],
    status: row.status as 'pending' | 'approved' | 'rejected' | 'under_review',
    submittedAt: new Date(row.submitted_at as string),
    reviewedAt: row.reviewed_at ? new Date(row.reviewed_at as string) : undefined,
    reviewerNotes: row.reviewer_notes as string | undefined
  };
}

// Business Suite Service Class
export class BusinessSuiteService {
  async getApplications(): Promise<MonetizationApplication[]> {
    const rows = db.prepare('SELECT * FROM monetization_applications').all() as Record<string, unknown>[];
    return rows.map(mapRowToApplication);
  }

  async submitApplication(application: Omit<MonetizationApplication, 'id'>): Promise<MonetizationApplication> {
    const id = `app-${Date.now()}`;
    db.prepare(`
      INSERT INTO monetization_applications (
        id, user_id, business_name, website, business_description, 
        monthly_revenue, country, product_interest_json, status, submitted_at, reviewed_at, reviewer_notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, application.userId, application.businessName, application.website, application.businessDescription,
      application.monthlyRevenue || null, application.country, JSON.stringify(application.productInterest || []),
      application.status, application.submittedAt.toISOString(), application.reviewedAt ? application.reviewedAt.toISOString() : null, application.reviewerNotes || null
    );
    
    return this.getApplication(id) as Promise<MonetizationApplication>;
  }

  async getApplication(id: string): Promise<MonetizationApplication | null> {
    const row = db.prepare('SELECT * FROM monetization_applications WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    if (!row) return null;
    return mapRowToApplication(row);
  }

  async updateApplication(id: string, application: Partial<MonetizationApplication>): Promise<MonetizationApplication> {
    const current = await this.getApplication(id);
    if (!current) throw new Error('Application not found');
    
    db.prepare(`
      UPDATE monetization_applications 
      SET status = ?, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(application.status || current.status, id);
    
    return this.getApplication(id) as Promise<MonetizationApplication>;
  }

  async deleteApplication(id: string): Promise<void> {
    db.prepare('DELETE FROM monetization_applications WHERE id = ?').run(id);
  }

  async getVerifications(): Promise<BusinessVerification[]> {
    const rows = await VerificationService.getAll();
    return rows as unknown as BusinessVerification[]; // Assuming mapped properly
  }

  async submitVerification(verification: Omit<BusinessVerification, 'id'>): Promise<BusinessVerification> {
    return VerificationService.create(verification as unknown as any) as unknown as BusinessVerification;
  }

  async getVerification(id: string): Promise<BusinessVerification | null> {
    return VerificationService.getStatus(id) as unknown as BusinessVerification;
  }

  async updateVerification(id: string, verification: Partial<BusinessVerification>): Promise<BusinessVerification> {
    return VerificationService.update(id, verification as unknown as Partial<BusinessVerification>) as unknown as BusinessVerification;
  }

  async deleteVerification(id: string): Promise<void> {
    return VerificationService.delete(id);
  }

  async getPayoutAccounts(): Promise<PayoutAccount[]> {
    return getAllPayoutAccounts();
  }

  async createPayoutAccount(account: Omit<PayoutAccount, 'id'>): Promise<PayoutAccount> {
    return createPayoutAccount(account as unknown as Omit<PayoutAccount, 'id' | 'createdAt' | 'updatedAt'>);
  }

  async getPayoutAccount(id: string): Promise<PayoutAccount | null> {
    return getPayoutAccount(id);
  }

  async updatePayoutAccount(id: string, account: Partial<PayoutAccount>): Promise<PayoutAccount> {
    const updated = await updatePayoutAccount(id, account);
    if (!updated) throw new Error('Account not found');
    return updated;
  }

  async deletePayoutAccount(id: string): Promise<void> {
    db.prepare('DELETE FROM payout_accounts WHERE id = ?').run(id);
  }

  async getOverview(): Promise<OverviewResponse> {
    return {} as OverviewResponse;
  }

  async getSeshat(): Promise<SeshatPage[]> {
    return [];
  }

  async getPrograms(): Promise<ProgramDefinition[]> {
    return getAllProgramDefinitions();
  }

  async getEligibility(): Promise<EligibilityResponse> {
    return {} as EligibilityResponse;
  }

  async createApplication(application: Omit<MonetizationApplication, 'id'>): Promise<MonetizationApplication> {
    return this.submitApplication(application);
  }

  async getApplicationById(id: string): Promise<MonetizationApplication | null> {
    return this.getApplication(id);
  }

  async getBusinessVerifications(): Promise<BusinessVerification[]> {
    return this.getVerifications();
  }

  async getBusinessVerification(id: string): Promise<BusinessVerification | null> {
    return this.getVerification(id);
  }

  async createBusinessVerification(verification: Omit<BusinessVerification, 'id'>): Promise<BusinessVerification> {
    return this.submitVerification(verification);
  }

  async updateBusinessVerification(id: string, verification: Partial<BusinessVerification>): Promise<BusinessVerification> {
    return this.updateVerification(id, verification);
  }

  async deleteBusinessVerification(id: string): Promise<void> {
    return this.deleteVerification(id);
  }

  async getPayoutAccountByUserId(userId: string): Promise<PayoutAccount[]> {
    const rows = db.prepare('SELECT * FROM payout_accounts WHERE user_id = ?').all(userId) as Record<string, unknown>[];
    // Re-use logic from payout-service but implemented locally to avoid circular dependencies if any
    return rows.map(row => ({
      id: row.id as string,
      userId: row.user_id as string,
      accountHolderName: row.account_holder_name as string,
      accountNumber: row.account_number as string,
      routingNumber: row.routing_number as string,
      bankName: row.bank_name as string,
      bankCountry: row.bank_country as string,
      currency: row.currency as string,
      verificationStatus: row.verification_status as 'pending' | 'verified' | 'rejected',
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string)
    }));
  }

  async getPayoutAccountById(id: string): Promise<PayoutAccount | null> {
    return this.getPayoutAccount(id);
  }

  async updatePayoutAccountById(id: string, account: Partial<PayoutAccount>): Promise<PayoutAccount> {
    return this.updatePayoutAccount(id, account);
  }

  async deletePayoutAccountById(id: string): Promise<void> {
    return this.deletePayoutAccount(id);
  }

  async getPlatformConfig(): Promise<PlatformConfig> {
    return getConfig();
  }

  async updatePlatformConfig(config: Partial<PlatformConfig>): Promise<PlatformConfig> {
    return updateConfig(config);
  }

  async estimateRevenue(payload: EstimateRequest): Promise<EstimateResponse> {
    return getEstimate(payload);
  }

  async getAffiliateEvents(): Promise<unknown[]> {
    return db.prepare('SELECT * FROM affiliate_events').all();
  }

  async getAffiliateMetrics(): Promise<unknown> {
    return getAffiliateData();
  }

  async getRevenueLedgerEntries(): Promise<unknown[]> {
    return [];
  }

  async getConfig(): Promise<PlatformConfig> {
    return getConfig();
  }

  async updateConfig(config: Partial<PlatformConfig>): Promise<PlatformConfig> {
    return updateConfig(config);
  }
}

export const getBusinessSuiteOverview = async (userId: string): Promise<BusinessSuiteOverview> => {
  try {
    const service = new BusinessSuiteService();
    const config = await service.getPlatformConfig();
    const applications = await db.prepare('SELECT * FROM monetization_applications WHERE user_id = ?').all(userId) as Record<string, unknown>[];
    const verifications = await VerificationService.getStatus(userId);
    const payoutAccounts = await service.getPayoutAccountByUserId(userId);

    return {
      applications: applications.map(mapRowToApplication),
      verifications: verifications ? [verifications as unknown as BusinessVerification] : [],
      payoutAccounts: payoutAccounts,
      platformConfig: config
    };
  } catch (error) {
    console.error('Error fetching business suite overview:', error);
    throw error;
  }
};

export const getEstimate = async (request: EstimateRequest): Promise<EstimateResponse> => {
  try {
    const { productKey, projectedVolume, projectedMonthlyUsers } = request as unknown as Record<string, number | string>;
    
    const volume = Number(projectedVolume || projectedMonthlyUsers || 1000);
    const baseRate = productKey === 'enterprise' ? 0.5 : productKey === 'premium' ? 0.4 : 0.3;
    const totalEarnings = volume * baseRate * 0.1;

    return {
      estimate: {
        potentialRevenueRange: {
          min: totalEarnings * 0.8,
          max: totalEarnings * 1.2,
          currency: 'USD'
        },
        keyDrivers: ['User engagement', 'Content quality', 'Market demand'],
        riskFactors: ['Competition', 'Market volatility'],
        recommendations: ['Improve content strategy', 'Expand audience reach'],
        confidenceLevel: 'medium'
      },
      totalEarnings,
      totalAdCost: totalEarnings * 0.6,
      creatorRevenueShare: totalEarnings * 0.4,
      cpcRevenue: totalEarnings * 0.05,
      ctr: 2.5,
      averageOrderValue: 50,
      roi: 3.5,
      clickToViewRatio: 0.05,
      salesConversionRate: 0.02,
      viewToPurchaseRate: 0.01,
      averageViewDuration: 120,
      retentionRate: 0.7,
      monthlyRevenue: totalEarnings / 12,
      annualRevenue: totalEarnings,
      estimatedCpm: 4.5,
      revenueSharePercentage: 45
    } as unknown as EstimateResponse;
  } catch (error) {
    console.error('Error calculating estimate:', error);
    throw error;
  }
};

export default {
  getBusinessSuiteOverview,
  getEstimate,
  BusinessSuiteService
};