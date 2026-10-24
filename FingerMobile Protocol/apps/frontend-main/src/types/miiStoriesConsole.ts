/**
 * Mii Ephemeral 48h Stories & Social Microservice Console Types
 * FingerMobile Protocol™ Production Control Plane
 * Phase 10: 48h TTL Lifecycle, 6-Digit PIN Handshakes, Vanishing Purge & Orbit Spawners
 */

export type MiiStoryMediaType = 'video' | 'photo' | 'audio' | 'sticker';
export type MiiStoryTimerType = '24hrs' | '48hrs' | '72hrs' | 'infinite_archive';
export type MiiStoryAudience = 'public' | 'followers' | 'close_friends';
export type MiiModerationStatus = 'active' | 'under_review' | 'banned' | 'archived';

export interface MiiStoryItem {
  id: number;
  author_id: string;
  author_name: string;
  author_avatar?: string | null;
  caption: string;
  media_url: string;
  thumbnail_url?: string | null;
  media_type: MiiStoryMediaType;
  duration_seconds: number;
  timer_type: MiiStoryTimerType;
  audience_type: MiiStoryAudience;
  pin_handshake_required: boolean;
  handshake_pin: string;
  is_censored: boolean;
  moderation_status: MiiModerationStatus;
  views_count: number;
  reactions_count: number;
  display_order: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface MiiStoriesOverview {
  total_stories: number;
  live_stories: number;
  pin_protected_stories: number;
  expired_stories: number;
  total_views: number;
  total_reactions: number;
  active_orbit_spawns: number;
  active_instances: number;
  ttl_policy: string;
  handshake_cipher: string;
  system_status: string;
  database_engine: string;
}

export interface MiiStoriesSpawnedConsole {
  id: number;
  title: string;
  domain: string;
  badge: string;
  description: string;
  active_instances: number;
  status: 'active' | 'syncing' | 'paused';
  created_at: string;
}

export interface CreateMiiStoryPayload {
  author_id: string;
  author_name: string;
  author_avatar?: string;
  caption?: string;
  media_url: string;
  thumbnail_url?: string;
  media_type: MiiStoryMediaType;
  duration_seconds: number;
  timer_type: MiiStoryTimerType;
  audience_type: MiiStoryAudience;
  pin_handshake_required: boolean;
  handshake_pin?: string;
}

export interface UpdateMiiStoryPayload {
  caption?: string;
  media_url?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  timer_type?: MiiStoryTimerType;
  audience_type?: MiiStoryAudience;
  pin_handshake_required?: boolean;
  handshake_pin?: string;
  is_censored?: boolean;
  moderation_status?: MiiModerationStatus;
}
