/**
 * Support, SLA & Customer Care Operations Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface SupportCareItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  avg_first_response_min: number;
  resolution_rate_pct: number;
  sla_compliance_pct: number;
  csat_score: number;
  status: 'active' | 'frozen';
  display_order: number;
  asset_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SupportCareOverview {
  summary: {
    total_items: string;
    active_count: string;
    frozen_count: string;
    overall_avg_response_min: string;
    overall_resolution_pct: string;
    overall_sla_compliance_pct: string;
    overall_csat_score: string;
  };
  categories: Array<{
    category: string;
    count: string;
    avg_csat: string;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface SupportCareSpawn {
  id: number;
  parent_console: string;
  sub_console_name: string;
  slug: string;
  endpoint: string;
  category: string;
  status: string;
  created_at: string;
}

export interface CreateSupportCarePayload {
  code: string;
  name: string;
  description?: string;
  category: string;
  avg_first_response_min?: number;
  resolution_rate_pct?: number;
  sla_compliance_pct?: number;
  csat_score?: number;
  status?: 'active' | 'frozen';
}
