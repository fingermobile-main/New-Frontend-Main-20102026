/**
 * Lumina Digital Collectibles & Cultural Provenance Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface LuminaGalleryItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  total_minted: number;
  floor_price_fic: number;
  royalty_pct: number;
  status: 'active' | 'frozen';
  display_order: number;
  asset_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LuminaGalleryOverview {
  summary: {
    total_items: string;
    active_count: string;
    frozen_count: string;
    total_minted_items: string;
    avg_floor_price_fic: string;
    avg_royalty_pct: string;
    total_categories: string;
  };
  categories: Array<{
    category: string;
    count: string;
    minted: string;
  }>;
  totalSpawns: number;
  engine: string;
  timestamp: string;
}

export interface LuminaGallerySpawn {
  id: number;
  parent_console: string;
  sub_console_name: string;
  slug: string;
  endpoint: string;
  category: string;
  status: string;
  created_at: string;
}

export interface CreateLuminaGalleryPayload {
  code: string;
  name: string;
  description?: string;
  category: string;
  total_minted?: number;
  floor_price_fic?: number;
  royalty_pct?: number;
}
