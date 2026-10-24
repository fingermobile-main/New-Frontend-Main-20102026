/**
 * Trends & Swarms Discovery Microservice Console Types
 * FingerMobile Protocol™ Production Control Plane
 * Phase 12: Virality Decay Sliders, Regional Swarms, Keyword Blacklists & GNN Weight Tuning
 */

export type TrendCategory =
  | 'AfroBeats & Music'
  | 'Fashion & Luxury'
  | 'EduTech & NYSC'
  | 'Gaming & Physics'
  | 'Commerce & Deals'
  | 'Tech & Web3';

export type TrendType = 'hashtag' | 'swarm' | 'event' | 'challenge' | 'audio_stem';

export interface TrendSwarmItem {
  id: number;
  topic: string;
  category: TrendCategory;
  trend_type: TrendType;
  virality_decay_rate: number;
  velocity_score: number;
  target_clusters: string[];
  gnm_weight: number;
  post_count: number;
  reach_count: number;
  is_boosted: boolean;
  is_blacklisted: boolean;
  display_order: number;
  status: 'active' | 'clamped' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface TrendsSwarmOverview {
  total_topics: number;
  active_topics: number;
  boosted_topics: number;
  blacklisted_topics: number;
  total_posts: number;
  total_reach: number;
  avg_decay_rate: number;
  avg_velocity: number;
  active_shards: number;
  active_instances: number;
  decay_algorithm: string;
  gnn_cluster_routing: string;
  system_status: string;
  database_engine: string;
}

export interface TrendsSwarmSpawnedConsole {
  id: number;
  title: string;
  domain: string;
  badge: string;
  description: string;
  active_instances: number;
  status: 'active' | 'syncing' | 'paused';
  created_at: string;
}

export interface CreateTrendSwarmPayload {
  topic: string;
  category: TrendCategory;
  trend_type: TrendType;
  virality_decay_rate: number;
  velocity_score: number;
  target_clusters: string[];
  gnm_weight: number;
  is_boosted: boolean;
}

export interface UpdateTrendSwarmPayload {
  topic?: string;
  category?: TrendCategory;
  trend_type?: TrendType;
  virality_decay_rate?: number;
  velocity_score?: number;
  target_clusters?: string[];
  gnm_weight?: number;
  is_boosted?: boolean;
  is_blacklisted?: boolean;
  status?: 'active' | 'clamped' | 'archived';
}
