/**
 * Types for Gaming & SuperVi Console
 * FingerMobile Protocol™ Production Control Plane
 * Phase 1: SuperVi Game Engine, Physics, Characters, Powerups, Leaderboards, Daily Challenges, Voice Lines
 */

export type GamingSuperViDomain =
  | 'supervi_core'
  | 'characters_roster'
  | 'powerups_catalog'
  | 'leaderboards_ranks'
  | 'daily_challenges'
  | 'voice_audio_lines';

export interface GamingSuperViItem {
  id: string;
  domain: GamingSuperViDomain;
  name: string;
  code: string;
  category: string;
  status: 'active' | 'frozen';
  display_order: number;
  reward_fic: number | string;
  score_multiplier: number | string;
  duration_seconds: number;
  cooldown_seconds: number;
  character_asset_url?: string | null;
  audio_stem_url?: string | null;
  voice_tag?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface GamingSuperViSummary {
  total_items: string | number;
  active_count: string | number;
  frozen_count: string | number;
  total_fic_rewards: string | number;
  total_characters: string | number;
  total_powerups: string | number;
  total_leaderboards: string | number;
  total_challenges: string | number;
}

export interface GamingSuperViDomainStat {
  domain: string;
  count: string | number;
  domain_fic: string | number;
}

export interface GamingSuperViOverview {
  summary: GamingSuperViSummary;
  domains: GamingSuperViDomainStat[];
  totalSpawns: number;
  timestamp: string;
}

export interface GamingSpawnedConsole {
  id: string;
  console_title: string;
  target_domain: string;
  route: string;
  icon_name: string;
  badge_text: string;
  status: string;
  config?: Record<string, any>;
  created_at?: string;
}

export interface CreateGamingItemPayload {
  domain: GamingSuperViDomain;
  name: string;
  code: string;
  category: string;
  reward_fic?: number;
  score_multiplier?: number;
  duration_seconds?: number;
  cooldown_seconds?: number;
  character_asset_url?: string;
  audio_stem_url?: string;
  voice_tag?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ReorderEntry {
  id: string;
  display_order: number;
}
