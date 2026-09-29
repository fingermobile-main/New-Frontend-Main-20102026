import {
  BusinessSuiteOverview,
  EstimateRequest,
  EstimateResponse,
  MonetizationApplication,
  BusinessVerification,
  PayoutAccount,
  PlatformConfig,
  ProgramDefinition,
  EligibilityResponse,
  SeshatPage,
  EstimateResult,
  AffiliateMetrics,
  RevenueLedgerEntry
} from '../shared/types.js';
import { getAllProgramDefinitions } from './program-service.js';
import {
  getPayoutAccount as getPayoutAccountSvc,
  createPayoutAccount as createPayoutAccountSvc,
  updatePayoutAccount as updatePayoutAccountSvc,
  getAllPayoutAccounts as getAllPayoutAccountsSvc
} from './payout-service.js';
import { getAffiliateData } from './affiliate-service.js';
import { getConfig as getConfigSvc, updateConfig as updateConfigSvc } from './config-service.js';
import { RevenueService } from './revenue-service.js';
import { SeshatService } from './seshat-service.js';
import { MonetizationService } from './monetization-service.js';
import { calculateEstimate } from './estimate-service.js';
import {
  getApplication,
  getAllApplications,
  createApplication,
  updateApplication,
  deleteApplication
} from './application-service.js';
import { db } from '../database.js';

// Helper: map business_verifications row → BusinessVerification
function mapVerificationRow(row: Record<string, unknown>): BusinessVerification {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    businessName: row.business_name as string || '',
    registrationNumber: row.registration_number as string || '',
    taxId: row.tax_id as string || '',
    incorporationDate: row.incorporation_date ? new Date(row.incorporation_date as string) : new Date(0),
    businessAddress: row.business_address as string || '',
    supportingDocuments: row.supporting_documents_json
      ? JSON.parse(row.supporting_documents_json as string)
      : [],
    verificationStatus: row.verification_status as BusinessVerification['verificationStatus'],
    verifiedAt: row.verified_at ? new Date(row.verified_at as string) : undefined,
    notes: row.notes as string | undefined
  };
}

// Helper: map revenue_ledger row → RevenueLedgerEntry
function mapRevenueRow(r: ReturnType<typeof RevenueService.getAllEntries>[0]): RevenueLedgerEntry {
  return {
    id: r.id,
    userId: r.userId,
    transactionType: r.transactionType as RevenueLedgerEntry['transactionType'],
    amount: r.amount,
    currency: r.currency,
    description: r.description,
    relatedEntityId: r.relatedEntityId,
    relatedEntityType: r.relatedEntityType,
    processedAt: r.processedAt,
    status: r.status as RevenueLedgerEntry['status'],
    metadata: r.metadata
  };
}

export class BusinessSuiteService {
  // ─── Overview ──────────────────────────────────────────────────────────────

  async getOverview(): Promise<BusinessSuiteOverview> {
    const [applications, verifications, payoutAccounts, platformConfig] = await Promise.all([
      this.getApplications(),
      this.getBusinessVerifications(),
      this.getPayoutAccounts(),
      this.getConfig()
    ]);
    return { applications, verifications, payoutAccounts, platformConfig };
  }

  // ─── Programs ──────────────────────────────────────────────────────────────

  async getPrograms(): Promise<ProgramDefinition[]> {
    return getAllProgramDefinitions();
  }

  // ─── Monetization Applications ─────────────────────────────────────────────

  async submitApplication(application: Omit<MonetizationApplication, 'id'>): Promise<MonetizationApplication> {
    return createApplication(application);
  }

  async createApplication(application: Omit<MonetizationApplication, 'id'>): Promise<MonetizationApplication> {
    return createApplication(application);
  }

  async getApplications(): Promise<MonetizationApplication[]> {
    return getAllApplications();
  }

  async getApplication(id: string): Promise<MonetizationApplication | null> {
    return getApplication(id);
  }

  async updateApplication(id: string, application: Partial<MonetizationApplication>): Promise<MonetizationApplication> {
    const result = updateApplication(id, application);
    if (!result) throw new Error(`Application ${id} not found`);
    return result;
  }

  async deleteApplication(id: string): Promise<boolean> {
    return deleteApplication(id);
  }

  // ─── Business Verifications ────────────────────────────────────────────────

  async getVerifications(): Promise<BusinessVerification[]> {
    return this.getBusinessVerifications();
  }

  async getBusinessVerifications(): Promise<BusinessVerification[]> {
    const rows = db.prepare('SELECT * FROM business_verifications ORDER BY created_at DESC').all() as Record<string, unknown>[];
    return rows.map(mapVerificationRow);
  }

  async getBusinessVerification(id: string): Promise<BusinessVerification | null> {
    const row = db.prepare('SELECT * FROM business_verifications WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? mapVerificationRow(row) : null;
  }

  async getVerificationById(id: string): Promise<BusinessVerification | null> {
    return this.getBusinessVerification(id);
  }

  async createBusinessVerification(verification: Omit<BusinessVerification, 'id'>): Promise<BusinessVerification> {
    const id = `bv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    db.prepare(`
      INSERT INTO business_verifications
        (id, user_id, business_name, registration_number, tax_id, incorporation_date,
         business_address, supporting_documents_json, verification_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      verification.userId,
      verification.businessName || '',
      verification.registrationNumber || null,
      verification.taxId || null,
      verification.incorporationDate?.toISOString() ?? null,
      verification.businessAddress || null,
      JSON.stringify(verification.supportingDocuments || []),
      verification.verificationStatus || 'pending',
      verification.notes || null
    );
    return this.getBusinessVerification(id) as Promise<BusinessVerification>;
  }

  async submitVerification(verification: Omit<BusinessVerification, 'id'>): Promise<BusinessVerification> {
    return this.createBusinessVerification(verification);
  }

  async updateVerification(id: string, verification: Partial<BusinessVerification>): Promise<BusinessVerification> {
    const fields: string[] = [];
    const vals: unknown[] = [];
    if (verification.businessName !== undefined) { fields.push('business_name = ?'); vals.push(verification.businessName); }
    if (verification.verificationStatus !== undefined) { fields.push('verification_status = ?'); vals.push(verification.verificationStatus); }
    if (verification.notes !== undefined) { fields.push('notes = ?'); vals.push(verification.notes); }
    if (verification.verifiedAt !== undefined) { fields.push('verified_at = ?'); vals.push(verification.verifiedAt?.toISOString()); }
    if (fields.length > 0) {
      vals.push(id);
      db.prepare(`UPDATE business_verifications SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
    }
    const updated = await this.getBusinessVerification(id);
    if (!updated) throw new Error(`Verification ${id} not found`);
    return updated;
  }

  async deleteVerification(id: string): Promise<boolean> {
    const result = db.prepare('DELETE FROM business_verifications WHERE id = ?').run(id);
    return result.changes > 0;
  }

  // ─── Payout Accounts ──────────────────────────────────────────────────────

  async getPayoutAccounts(): Promise<PayoutAccount[]> {
    return getAllPayoutAccountsSvc();
  }

  async getPayoutAccount(id: string): Promise<PayoutAccount | null> {
    return getPayoutAccountSvc(id);
  }

  async getPayoutAccountById(id: string): Promise<PayoutAccount | null> {
    return getPayoutAccountSvc(id);
  }

  async getPayoutAccountByUserId(userId: string): Promise<PayoutAccount[]> {
    const { db: _db } = await import('../database.js');
    const rows = _db.prepare('SELECT * FROM payout_accounts WHERE user_id = ?').all(userId) as Record<string, unknown>[];
    return rows.map(row => ({
      id: row.id as string,
      userId: row.user_id as string,
      accountHolderName: row.account_holder_name as string,
      accountNumber: row.account_number as string,
      routingNumber: row.routing_number as string,
      bankName: row.bank_name as string,
      bankCountry: row.bank_country as string,
      currency: row.currency as string,
      verificationStatus: row.verification_status as PayoutAccount['verificationStatus'],
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string)
    }));
  }

  async createPayoutAccount(account: Omit<PayoutAccount, 'id'>): Promise<PayoutAccount> {
    return createPayoutAccountSvc(account);
  }

  async updatePayoutAccount(id: string, account: Partial<PayoutAccount>): Promise<PayoutAccount | null> {
    return updatePayoutAccountSvc(id, account);
  }

  async deletePayoutAccount(id: string): Promise<boolean> {
    const result = db.prepare('DELETE FROM payout_accounts WHERE id = ?').run(id);
    return result.changes > 0;
  }

  // ─── Config ────────────────────────────────────────────────────────────────

  async getConfig(): Promise<PlatformConfig> {
    return getConfigSvc();
  }

  async getPlatformConfig(): Promise<PlatformConfig> {
    return getConfigSvc();
  }

  async updateConfig(config: Partial<PlatformConfig>): Promise<PlatformConfig> {
    return updateConfigSvc(config);
  }

  async updatePlatformConfig(config: Partial<PlatformConfig>): Promise<PlatformConfig> {
    return updateConfigSvc(config);
  }

  // ─── Affiliate ────────────────────────────────────────────────────────────

  async getAffiliate(): Promise<AffiliateMetrics> {
    return getAffiliateData();
  }

  async getAffiliateMetrics(): Promise<AffiliateMetrics> {
    return getAffiliateData();
  }

  async getAffiliateEvents(): Promise<unknown[]> {
    const rows = db.prepare('SELECT * FROM affiliate_events ORDER BY occurred_at DESC LIMIT 100').all() as Record<string, unknown>[];
    return rows.map(row => ({
      id: row.id as string,
      affiliateId: row.affiliate_id as string,
      eventId: row.event_id as string,
      eventType: row.event_type as string,
      commissionAmount: row.commission_amount as number,
      currency: row.currency as string,
      occurredAt: row.occurred_at as string
    }));
  }

  // ─── Revenue ──────────────────────────────────────────────────────────────

  async getRevenue(): Promise<unknown> {
    return MonetizationService.getOverview();
  }

  async getRevenueLedgerEntries(): Promise<RevenueLedgerEntry[]> {
    return RevenueService.getAllEntries().map(mapRevenueRow);
  }

  // ─── Seshat ───────────────────────────────────────────────────────────────

  async getSeshat(): Promise<SeshatPage[]> {
    return SeshatService.getAllPages();
  }

  // ─── Policy / Admin (read from config) ───────────────────────────────────

  async getPolicy(): Promise<unknown> {
    const config = await getConfigSvc();
    return {
      contentPolicy: config.contentPolicy,
      privacyPolicy: config.privacyPolicy,
      termsOfService: config.termsOfService
    };
  }

  async getAdmin(): Promise<unknown> {
    return MonetizationService.getOverview();
  }

  // ─── Eligibility ──────────────────────────────────────────────────────────

  async getEligibility(): Promise<EligibilityResponse> {
    return { eligibility: {} as EligibilityResponse['eligibility'] };
  }

  // ─── Estimate ─────────────────────────────────────────────────────────────

  async estimateRevenue(request: EstimateRequest): Promise<EstimateResponse> {
    const estimate = calculateEstimate(request);
    const config = await getConfigSvc();
    const revenueSharePercentage = config.revenueSharePercentage ?? 45;

    const midRevenue = (estimate.potentialRevenueRange.min + estimate.potentialRevenueRange.max) / 2;
    const creatorShare = midRevenue * (revenueSharePercentage / 100);
    const ctr = (request.engagementRate || 0.05) * 0.1;
    const cpcRevenue = (request.projectedMonthlyUsers || 0) * ctr * (request.averageOrderValue || 50) * 0.001;

    return {
      estimate: estimate as EstimateResult,
      totalEarnings: parseFloat(midRevenue.toFixed(2)),
      totalAdCost: parseFloat((midRevenue * 0.3).toFixed(2)),
      creatorRevenueShare: parseFloat(creatorShare.toFixed(2)),
      cpcRevenue: parseFloat(cpcRevenue.toFixed(2)),
      ctr: parseFloat(ctr.toFixed(4)),
      averageOrderValue: request.averageOrderValue || 50,
      roi: parseFloat(((creatorShare / Math.max(midRevenue * 0.3, 1)) * 100).toFixed(2)),
      clickToViewRatio: parseFloat((ctr * 100).toFixed(2)),
      salesConversionRate: parseFloat(((request.conversionRate || 0.02) * 100).toFixed(2)),
      viewToPurchaseRate: parseFloat((ctr * (request.conversionRate || 0.02) * 100).toFixed(4)),
      averageViewDuration: request.avgSessionDuration || 0,
      retentionRate: parseFloat(((request.engagementRate || 0.05) * 100).toFixed(2)),
      monthlyRevenue: parseFloat((midRevenue / 12).toFixed(2)),
      annualRevenue: parseFloat(midRevenue.toFixed(2)),
      estimatedCpm: parseFloat(((midRevenue / Math.max(request.projectedMonthlyUsers || 1000, 1)) * 1000).toFixed(2)),
      revenueSharePercentage
    };
  }
}

export const businessSuiteService = new BusinessSuiteService();

export const fetchEstimate = async (request?: EstimateRequest): Promise<EstimateResponse> => {
  return businessSuiteService.estimateRevenue(request ?? {
    projectedMonthlyUsers: 1000,
    engagementRate: 0.05,
    avgSessionDuration: 300,
    conversionRate: 0.02,
    averageOrderValue: 50,
    contentCategories: [],
    geographicFocus: []
  });
};