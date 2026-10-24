/**
 * Email, Push & Communications Delivery Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface EmailCommsItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  throughput_sec: number;
  delivery_rate_pct: number;
  bounce_rate_pct: number;
  status: 'active' | 'frozen';
  display_order: number;
  asset_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailCommsOverview {
  summary: {
    total_items: string;
    active_count: string;
    frozen_count: string;
    total_throughput_sec: string;
    avg_delivery_rate_pct: string;
    avg_bounce_rate_pct: string;
  };
  categories: Array<{
    category: string;
    count: string;
    capacity_sec: string;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface EmailCommsSpawn {
  id: number;
  parent_console: string;
  sub_console_name: string;
  slug: string;
  endpoint: string;
  category: string;
  status: string;
  created_at: string;
}

export interface CreateEmailCommsPayload {
  code: string;
  name: string;
  description?: string;
  category: string;
  throughput_sec?: number;
  delivery_rate_pct?: number;
  bounce_rate_pct?: number;
  status?: 'active' | 'frozen';
}
