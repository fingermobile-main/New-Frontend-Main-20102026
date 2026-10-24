/**
 * SoundOcean Sovereign Library Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface SoundOceanItem {
  id: number;
  code: string;
  title: string;
  artist: string;
  genre: string;
  category: string;
  bpm: number;
  key_signature: string;
  bit_depth: number;
  sample_rate_khz: number;
  audio_format: string;
  audio_url: string;
  stem_vault_file?: string;
  stem_channels: string[];
  file_size_mb: number;
  uploader_id: string;
  uploader_name: string;
  license_type: string;
  fic_price: number;
  royalty_split_pct: number;
  play_count: number;
  download_count: number;
  curation_status: 'approved' | 'pending' | 'quarantined' | 'archived';
  status: 'active' | 'frozen';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SoundOceanOverview {
  summary: {
    total_items: string;
    active_count: string;
    frozen_count: string;
    total_plays: string;
    total_downloads: string;
    total_storage_mb: string;
    avg_royalty_split_pct: string;
    total_categories: string;
  };
  categories: Array<{
    category: string;
    count: string;
    plays: string;
  }>;
  totalSpawns: number;
  engine: string;
  timestamp: string;
}

export interface SoundOceanSpawn {
  id: number;
  parent_console: string;
  sub_console_name: string;
  slug: string;
  endpoint: string;
  category: string;
  status: string;
  created_at: string;
}

export interface CreateSoundOceanPayload {
  code: string;
  title: string;
  artist: string;
  genre: string;
  category: string;
  bpm?: number;
  key_signature?: string;
  bit_depth?: number;
  sample_rate_khz?: number;
  audio_format?: string;
  audio_url?: string;
  stem_vault_file?: string;
  stem_channels?: string[];
  file_size_mb?: number;
  uploader_name?: string;
  license_type?: string;
  fic_price?: number;
  royalty_split_pct?: number;
}
