/**
 * LoansQR Micro-Lending & SME Underwriting Console Types
 * FingerMobile Protocol™ Production Control Plane
 * Phase 11: Underwriting Matrix, APR Tiers, Collateral Escrow Vaults & Debt Moratorium Holds
 */

export type LoansQrCategory =
  | 'MERCHANT_INVENTORY'
  | 'SME_WORKING_CAPITAL'
  | 'POS_AGENT_FLOAT'
  | 'INVOICE_FACTORING'
  | 'EQUIPMENT_LEASING'
  | 'AGRIC_CROP_SEASONAL';

export interface LoansQrItem {
  id: number;
  name: string;
  product_code: string;
  category: LoansQrCategory;
  min_amount: number;
  max_amount: number;
  interest_rate_monthly: number;
  tenure_months_min: number;
  tenure_months_max: number;
  processing_fee_percent: number;
  moratorium_days: number;
  risk_score_min: number;
  collateral_required: boolean;
  collateral_ratio_percent: number;
  active_loans_count: number;
  total_disbursed: number;
  repayment_rate_percent: number;
  display_order: number;
  is_active: boolean;
  moratorium_hold_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoansQrOverview {
  total_facilities: number;
  active_facilities: number;
  collateralized_facilities: number;
  moratorium_active_count: number;
  total_active_loans: number;
  cumulative_disbursed: number;
  avg_monthly_rate: number;
  avg_repayment_rate: number;
  active_shards: number;
  active_instances: number;
  underwriting_engine: string;
  collateral_escrow: string;
  moratorium_policy: string;
  system_status: string;
  database_engine: string;
}

export interface LoansQrSpawnedConsole {
  id: number;
  title: string;
  domain: string;
  badge: string;
  description: string;
  active_instances: number;
  status: 'active' | 'syncing' | 'paused';
  created_at: string;
}

export interface CreateLoansQrPayload {
  name: string;
  product_code: string;
  category: LoansQrCategory;
  min_amount: number;
  max_amount: number;
  interest_rate_monthly: number;
  tenure_months_min: number;
  tenure_months_max: number;
  processing_fee_percent: number;
  moratorium_days: number;
  risk_score_min: number;
  collateral_required: boolean;
  collateral_ratio_percent?: number;
}

export interface UpdateLoansQrPayload {
  name?: string;
  category?: LoansQrCategory;
  min_amount?: number;
  max_amount?: number;
  interest_rate_monthly?: number;
  tenure_months_min?: number;
  tenure_months_max?: number;
  processing_fee_percent?: number;
  moratorium_days?: number;
  risk_score_min?: number;
  collateral_required?: boolean;
  collateral_ratio_percent?: number;
  is_active?: boolean;
  moratorium_hold_active?: boolean;
}
