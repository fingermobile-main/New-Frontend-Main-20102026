/**
 * Types for Unified Financials & Treasury Console
 * FingerMobile Protocol™ Production Control Plane
 * Option C: Master wallet escrows, protocol fee minting, automated SuperVi tournament prize pools
 */

export type FinancialTreasuryDomain =
  | 'escrows'
  | 'fee_minting'
  | 'prize_pools'
  | 'vat_tax'
  | 'payout_rails'
  | 'sovereign_audits';

export interface FinancialTreasuryItem {
  id: string;
  domain: FinancialTreasuryDomain;
  name: string;
  code: string;
  category: string;
  status: 'active' | 'frozen';
  display_order: number;
  balance_fic: number | string;
  balance_fiat: number | string;
  currency: string;
  fee_percent: number | string;
  recipient_address?: string | null;
  multisig_threshold?: string | null;
  supervi_tournament_id?: string | null;
  proof_attachment_url?: string | null;
  voice_tag?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialTreasurySummary {
  total_items: string | number;
  active_count: string | number;
  frozen_count: string | number;
  total_fic_held: string | number;
  total_fiat_reserve: string | number;
  escrow_fic: string | number;
  prize_pool_fic: string | number;
  fee_minted_fic: string | number;
  tax_holding_fiat: string | number;
}

export interface FinancialTreasuryDomainStat {
  domain: string;
  count: string | number;
  domain_fic: string | number;
  domain_fiat: string | number;
}

export interface FinancialTreasuryOverview {
  summary: FinancialTreasurySummary;
  domains: FinancialTreasuryDomainStat[];
  totalSpawns: number;
  timestamp: string;
}

export interface FinancialSpawnedConsole {
  id: string;
  console_title: string;
  target_domain: string;
  route: string;
  icon_name: string;
  badge_text: string;
  status: string;
  config?: Record<string, any>;
  created_at?: string;
}

export interface CreateFinancialItemPayload {
  domain: FinancialTreasuryDomain;
  name: string;
  code: string;
  category: string;
  balance_fic?: number;
  balance_fiat?: number;
  currency?: string;
  fee_percent?: number;
  recipient_address?: string;
  multisig_threshold?: string;
  supervi_tournament_id?: string;
  proof_attachment_url?: string;
  voice_tag?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ReorderEntry {
  id: string;
  display_order: number;
}
