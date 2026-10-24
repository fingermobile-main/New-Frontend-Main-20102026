/**
 * Gamification, Quests & Rewards Citadel Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface GamificationRewardsItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  multiplier_cap: number;
  total_participants: number;
  reward_budget_fic: number;
  status: 'active' | 'frozen';
  display_order: number;
  asset_url?: string;
  created_at: string;
  updated_at: string;
}

export interface GamificationRewardsOverview {
  summary: {
    total_items: string;
    active_count: string;
    frozen_count: string;
    total_participants: string;
    total_reward_budget_fic: string;
    peak_multiplier_cap: string;
  };
  categories: Array<{
    category: string;
    count: string;
    total_budget: string;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface GamificationRewardsSpawn {
  id: number;
  parent_console: string;
  sub_console_name: string;
  slug: string;
  endpoint: string;
  category: string;
  status: string;
  created_at: string;
}

export interface CreateGamificationRewardsPayload {
  code: string;
  name: string;
  description?: string;
  category: string;
  multiplier_cap?: number;
  total_participants?: number;
  reward_budget_fic?: number;
  status?: 'active' | 'frozen';
}
