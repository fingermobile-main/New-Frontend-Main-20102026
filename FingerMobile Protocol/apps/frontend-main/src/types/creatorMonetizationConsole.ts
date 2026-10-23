/**
 * Types for Creator Studio, Monetization & Payouts Engine Console
 * FingerMobile Protocol™ Production Control Plane
 * Phase 6: Creator Tiers Matrix, Ad Revenue Splits, Live Gifting Tips, FIC Staking Yield, PPV Events & Micro-Royalties
 */

export type CreatorMonetizationDomain =
  | 'creator_tiers_matrix'
  | 'ad_revenue_splits'
  | 'live_gifting_tips'
  | 'fic_staking_yields'
  | 'ppv_exclusive_events'
  | 'music_video_royalties';

export interface CreatorMonetizationItem {
  id: string;
  domain: CreatorMonetizationDomain;
  name: string;
  code: string;
  category: string;
  status: 'active' | 'frozen';
  display_order: number;
  tier_level?: string | null;
  rev_share_percent: number | string;
  payout_currency: string;
  total_volume_fic: number | string;
  active_creators_count: number;
  contract_manifest_url?: string | null;
  voice_tag?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CreatorMonetizationSummary {
  total_items: string | number;
  active_count: string | number;
  frozen_count: string | number;
  total_volume_fic: string | number;
  total_creators_count: string | number;
  average_rev_share: string | number;
  total_tiers: string | number;
  total_staking_pools: string | number;
  total_gifting_vaults: string | number;
  total_ppv_gates: string | number;
  staking_locked_volume_fic: string | number;
}

export interface CreatorMonetizationDomainStat {
  domain: string;
  count: string | number;
  domain_volume_fic: string | number;
  domain_creators: string | number;
  avg_rev_share: string | number;
}

export interface CreatorMonetizationOverview {
  summary: CreatorMonetizationSummary;
  domains: CreatorMonetizationDomainStat[];
  totalSpawns: number;
  timestamp: string;
}

export interface CreatorMonetizationSpawnedConsole {
  id: string;
  console_title: string;
  target_domain: string;
  route: string;
  icon_name: string;
  badge_text: string;
  status: 'active' | 'frozen';
  config?: Record<string, any>;
  created_at?: string;
}

export interface CreateCreatorMonetizationItemPayload {
  domain: CreatorMonetizationDomain;
  name: string;
  code: string;
  category: string;
  tier_level?: string;
  rev_share_percent?: number;
  payout_currency?: string;
  total_volume_fic?: number;
  active_creators_count?: number;
  contract_manifest_url?: string;
  voice_tag?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ReorderEntry {
  id: string;
  display_order: number;
}
