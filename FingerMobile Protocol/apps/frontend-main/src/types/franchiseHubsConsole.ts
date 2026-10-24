/**
 * Franchise & Regional Hubs Management Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface FranchiseHubItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  territory: string;
  merchants: number;
  revenue_share_pct: number;
  tax_compliance_status: string;
  currency: string;
  status: 'active' | 'frozen';
  display_order: number;
  asset_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FranchiseHubsOverview {
  summary: {
    total_items: string;
    active_count: string;
    frozen_count: string;
    total_merchants: string;
    avg_revenue_share_pct: string;
    total_territories: string;
    total_currencies: string;
  };
  categories: Array<{
    category: string;
    count: string;
    merchants: string;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface FranchiseHubSpawn {
  id: number;
  parent_console: string;
  sub_console_name: string;
  slug: string;
  endpoint: string;
  category: string;
  status: string;
  created_at: string;
}

export interface CreateFranchiseHubPayload {
  code: string;
  name: string;
  description?: string;
  category: string;
  territory: string;
  merchants?: number;
  revenue_share_pct?: number;
  tax_compliance_status?: string;
  currency?: string;
  status?: 'active' | 'frozen';
}
