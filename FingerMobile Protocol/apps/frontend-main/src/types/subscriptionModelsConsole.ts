/**
 * Subscription Models & Monetization Tiers Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface SubscriptionModelItem {
  id: string;
  name: string;
  category: string;
  monthly_fic: number;
  annual_fic: number;
  monthly_ngn: number;
  annual_ngn: number;
  is_free_tier: boolean;
  badge: string;
  description: string;
  features: string[];
  subscriber_count: number;
  target_annual_volume_fic: number;
  sort_order: number;
  status: 'active' | 'frozen';
  created_at: string;
  updated_at: string;
}

export interface SubscriptionModelsOverview {
  summary: {
    total_items: string;
    active_count: string;
    frozen_count: string;
    total_subscribers: string;
    avg_monthly_fic: string;
    target_annual_volume_fic: string;
    total_categories: string;
  };
  categories: Array<{
    category: string;
    count: string;
    subscribers: string;
  }>;
  totalSpawns: number;
  engine: string;
  timestamp: string;
}

export interface SubscriptionModelsSpawn {
  id: number;
  parent_console: string;
  sub_console_name: string;
  slug: string;
  endpoint: string;
  category: string;
  status: string;
  created_at: string;
}

export interface CreateSubscriptionModelPayload {
  id?: string;
  code?: string;
  name: string;
  category: string;
  monthly_fic: number;
  annual_fic?: number;
  monthly_ngn?: number;
  annual_ngn?: number;
  is_free_tier?: boolean;
  badge?: string;
  description?: string;
  features?: string[];
  subscriber_count?: number;
  target_annual_volume_fic?: number;
}
