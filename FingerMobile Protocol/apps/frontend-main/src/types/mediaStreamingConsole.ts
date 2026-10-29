export type MediaStreamingServiceKey = 'beatwaveng' | 'dancia4tv' | 'videobox';

export interface MediaStreamingConsoleItem {
  id: number;
  service_key: MediaStreamingServiceKey;
  entity_id: string | null;
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  media_url: string;
  media_type: 'audio' | 'video' | 'stream' | 'stem';
  thumbnail_url: string;
  duration_seconds: number;
  bpm: number;
  musical_key: string;
  stream_latency_mode: 'ultra_low' | 'standard' | 'dvr';
  resolution: string;
  status: 'active' | 'frozen' | 'draft' | 'archived' | 'censored' | 'suspended';
  display_order: number;
  fic_bounty: string | number;
  license_fee_fic: string | number;
  tags: string[];
  voice_prompt: string;
  creator_name: string;
  views: string | number;
  likes: string | number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MediaStreamingServiceOverview {
  serviceKey: MediaStreamingServiceKey;
  totalItems: number;
  activeItems: number;
  frozenItems: number;
  draftItems: number;
  totalBountyFic: number;
  totalLicenseFic: number;
  avgBpm: number;
  totalViews: number;
  totalLikes: number;
  healthScore: number;
  status: 'healthy' | 'degraded' | 'critical';
}

export interface MediaStreamingOverviewResponse {
  success: boolean;
  timestamp: string;
  totalServices: number;
  services: Record<MediaStreamingServiceKey, MediaStreamingServiceOverview>;
}

export interface SpawnedMediaConsole {
  id: number;
  console_name: string;
  slug: string;
  service_key: MediaStreamingServiceKey;
  description?: string;
  config?: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}
