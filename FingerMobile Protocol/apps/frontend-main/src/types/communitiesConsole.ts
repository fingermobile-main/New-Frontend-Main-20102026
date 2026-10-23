// ============================================================================
// Communities Consoles Types: Complete Autonomous Micromanagement Suite
// ============================================================================

export type CommunityServiceKey =
  | 'forum'
  | 'mii'
  | 'fingershorts'
  | 'groups'
  | 'gems'
  | 'blogs'
  | 'hallmarks'
  | 'discover'
  | 'discovery'
  | 'tribute'
  | 'trends';

export type CommunityItemStatus =
  | 'active'
  | 'frozen'
  | 'draft'
  | 'archived'
  | 'suspended';

export interface CommunityConsoleItem {
  id: number;
  service_key: CommunityServiceKey;
  entity_id?: string | null;
  title: string;
  slug: string;
  category: string;
  description: string;
  media_url: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  status: CommunityItemStatus;
  display_order: number;
  fic_bounty: number | string;
  tags: string[];
  voice_prompt?: string;
  author_name?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CommunityServiceOverview {
  serviceKey: CommunityServiceKey;
  totalItems: number;
  activeItems: number;
  frozenItems: number;
  draftItems: number;
  totalBountyFic: number;
  healthScore: number;
  status: 'healthy' | 'degraded';
}

export interface SpawnedConsole {
  id: number;
  console_id: string;
  name: string;
  service_key: string;
  route: string;
  description: string;
  icon?: string;
  status: string;
  health_score: number;
  created_at?: string;
}
