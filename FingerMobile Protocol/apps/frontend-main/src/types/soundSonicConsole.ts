/**
 * Sound River & Sound Ocean Sonic Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface SoundSonicItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  bitrate_kbps: number;
  sample_rate_khz: number;
  latency_ms: number;
  channels: number;
  status: 'active' | 'frozen';
  display_order: number;
  asset_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SoundSonicOverview {
  summary: {
    total_items: string;
    active_count: string;
    frozen_count: string;
    max_bitrate_kbps: number;
    max_sample_rate_khz: number;
    avg_latency_ms: string;
  };
  categories: Array<{
    category: string;
    count: string;
    avg_bitrate: string;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface SoundSonicSpawn {
  id: number;
  parent_console: string;
  sub_console_name: string;
  slug: string;
  endpoint: string;
  category: string;
  status: string;
  created_at: string;
}

export interface CreateSoundSonicPayload {
  code: string;
  name: string;
  description?: string;
  category: string;
  bitrate_kbps?: number;
  sample_rate_khz?: number;
  latency_ms?: number;
  channels?: number;
  status?: 'active' | 'frozen';
}
