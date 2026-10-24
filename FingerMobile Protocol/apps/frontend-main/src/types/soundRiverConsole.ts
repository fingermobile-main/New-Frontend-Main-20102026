/**
 * SoundRiver Stream Engine Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface SoundRiverItem {
  id: number;
  code: string;
  station_name: string;
  category: string;
  active_listeners: number;
  peak_listeners: number;
  target_bitrate_kbps: number;
  codec: string;
  current_track_id?: number | null;
  current_track_title: string;
  current_track_artist: string;
  current_track_url?: string | null;
  next_track_title?: string | null;
  crossfade_seconds: number;
  feed_mode: string;
  buffer_health_pct: number;
  status: 'active' | 'frozen' | 'muted';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SoundRiverOverview {
  summary: {
    total_items: string;
    active_count: string;
    frozen_count: string;
    total_active_listeners: string;
    peak_listeners: number;
    avg_bitrate_kbps: string;
    avg_buffer_health_pct: string;
    total_categories: string;
  };
  categories: Array<{
    category: string;
    count: string;
    listeners: string;
  }>;
  totalSpawns: number;
  engine: string;
  timestamp: string;
}

export interface SoundRiverSpawn {
  id: number;
  parent_console: string;
  sub_console_name: string;
  slug: string;
  endpoint: string;
  category: string;
  status: string;
  created_at: string;
}

export interface CreateSoundRiverPayload {
  code: string;
  station_name: string;
  category: string;
  active_listeners?: number;
  peak_listeners?: number;
  target_bitrate_kbps?: number;
  codec?: string;
  current_track_title?: string;
  current_track_artist?: string;
  crossfade_seconds?: number;
  feed_mode?: string;
  buffer_health_pct?: number;
}
