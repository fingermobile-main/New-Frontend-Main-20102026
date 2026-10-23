/**
 * Types for Creation, Widgets, Screen Catalog & Subscriptions Console
 * FingerMobile Protocol™ Production Control Plane
 * Phase 4: Screen Catalog Management, Rotational Rails (2h widgets), Subscriptions Matrix, Guardian AI SEO Indexer & Dynamic File Routing
 */

export type CreationCatalogDomain =
  | 'screen_catalog_management'
  | 'rotational_rails_widgets'
  | 'subscriptions_tier_matrix'
  | 'guardian_ai_seo_indexer'
  | 'dynamic_media_file_routing'
  | 'custom_console_builder';

export interface CreationCatalogItem {
  id: string;
  domain: CreationCatalogDomain;
  name: string;
  code: string;
  category: string;
  status: 'active' | 'frozen';
  display_order: number;
  route_path?: string | null;
  rotation_hours: number | string;
  tier_pricing_fic: number | string;
  seo_index_score: number | string;
  media_asset_url?: string | null;
  voice_tag?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CreationCatalogSummary {
  total_items: string | number;
  active_count: string | number;
  frozen_count: string | number;
  total_screens: string | number;
  total_rotational_rails: string | number;
  total_subscription_tiers: string | number;
  average_seo_score: string | number;
  total_tier_pricing_fic: string | number;
}

export interface CreationCatalogDomainStat {
  domain: string;
  count: string | number;
  domain_fic: string | number;
  avg_seo: string | number;
}

export interface CreationCatalogOverview {
  summary: CreationCatalogSummary;
  domains: CreationCatalogDomainStat[];
  totalSpawns: number;
  timestamp: string;
}

export interface CreationCatalogSpawnedConsole {
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

export interface CreateCreationCatalogItemPayload {
  domain: CreationCatalogDomain;
  name: string;
  code: string;
  category: string;
  route_path?: string;
  rotation_hours?: number;
  tier_pricing_fic?: number;
  seo_index_score?: number;
  media_asset_url?: string;
  voice_tag?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ReorderEntry {
  id: string;
  display_order: number;
}
