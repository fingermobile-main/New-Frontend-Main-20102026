import { PlatformConfig, ConfigUpdate } from '../shared/types';
import { db } from '../database.js';

const DEFAULT_CONFIG_ID = 'config-1';

const defaultPlatformConfig: PlatformConfig = {
  id: DEFAULT_CONFIG_ID,
  minimumAge: 18,
  minimumPayoutThreshold: 100,
  seshatMonthlyFee: 10,
  seshatYearlyFee: 100,
  monetizationFeePercentage: 5,
  verificationFee: 5,
  payoutProcessingTime: 7,
  affiliateCommissionRate: 10,
  enableMonetization: true,
  enableAffiliateProgram: true,
  contentPolicy: 'Default content policy',
  privacyPolicy: 'Default privacy policy',
  termsOfService: 'Default terms of service',
  createdAt: new Date(),
  updatedAt: new Date(),
  revenueSharePercentage: 45,
};

// Map DB row to PlatformConfig
function mapRowToConfig(row: Record<string, unknown>): PlatformConfig {
  return {
    id: row.id as string,
    minimumAge: row.minimum_age as number,
    minimumPayoutThreshold: row.minimum_payout_threshold as number,
    seshatMonthlyFee: row.seshat_monthly_fee as number,
    seshatYearlyFee: row.seshat_yearly_fee as number,
    monetizationFeePercentage: row.monetization_fee_percentage as number,
    verificationFee: row.verification_fee as number,
    payoutProcessingTime: row.payout_processing_time as number,
    affiliateCommissionRate: row.affiliate_commission_rate as number,
    enableMonetization: Boolean(row.enable_monetization),
    enableAffiliateProgram: Boolean(row.enable_affiliate_program),
    contentPolicy: row.content_policy as string || '',
    privacyPolicy: row.privacy_policy as string || '',
    termsOfService: row.terms_of_service as string || '',
    minimumUserBase: row.minimum_user_base as number | undefined,
    revenueSharePercentage: row.revenue_share_percentage as number | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    basicEligibility: row.basic_eligibility_json ? JSON.parse(row.basic_eligibility_json as string) : undefined,
    premiumEligibility: row.premium_eligibility_json ? JSON.parse(row.premium_eligibility_json as string) : undefined,
    enterpriseEligibility: row.enterprise_eligibility_json ? JSON.parse(row.enterprise_eligibility_json as string) : undefined,
  };
}

export const getConfig = async (): Promise<PlatformConfig> => {
  const row = db.prepare('SELECT * FROM platform_config WHERE id = ?').get(DEFAULT_CONFIG_ID) as Record<string, unknown> | undefined;
  
  if (!row) {
    // Insert default if not exists
    db.prepare(`
      INSERT INTO platform_config (id) VALUES (?)
    `).run(DEFAULT_CONFIG_ID);
    return defaultPlatformConfig;
  }
  
  return mapRowToConfig(row);
};

export const updateConfig = async (configUpdate: ConfigUpdate): Promise<PlatformConfig> => {
  // First ensure a config exists
  await getConfig();
  
  const updates: string[] = [];
  const values: unknown[] = [];
  
  // Dynamically build the update query
  Object.entries(configUpdate).forEach(([key, value]) => {
    // Convert camelCase to snake_case for the column name
    const column = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    updates.push(`${column} = ?`);
    values.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
  });
  
  if (updates.length > 0) {
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(DEFAULT_CONFIG_ID);
    
    db.prepare(`
      UPDATE platform_config 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `).run(...values);
  }
  
  return getConfig();
};

export default {
  getConfig,
  updateConfig
};