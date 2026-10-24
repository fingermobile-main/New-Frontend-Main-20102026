/**
 * Platform Domain & Edge Network Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface DomainEdgeItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  qps_capacity: number;
  ssl_grade: string;
  cache_hit_pct: number;
  status: 'active' | 'frozen';
  display_order: number;
  asset_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DomainEdgeOverview {
  summary: {
    total_items: string;
    active_count: string;
    frozen_count: string;
    total_qps_capacity: string;
    avg_cache_hit_pct: string;
    total_categories: string;
  };
  categories: Array<{
    category: string;
    count: string;
    qps: string;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface DomainEdgeSpawn {
  id: number;
  parent_console: string;
  sub_console_name: string;
  slug: string;
  endpoint: string;
  category: string;
  status: string;
  created_at: string;
}

export interface CreateDomainEdgePayload {
  code: string;
  name: string;
  description?: string;
  category: string;
  qps_capacity?: number;
  ssl_grade?: string;
  cache_hit_pct?: number;
  status?: 'active' | 'frozen';
}
