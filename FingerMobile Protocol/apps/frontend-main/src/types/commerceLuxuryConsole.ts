export type CommerceLuxuryServiceKey = 'marketplace' | 'storefront' | 'flamingo' | 'ownit' | 'fingerlux' | 'tribut';

export interface CommerceLuxuryConsoleItem {
  id: number;
  service_key: CommerceLuxuryServiceKey;
  entity_id: string | null;
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  media_url: string;
  media_type: 'image' | 'video' | '3d_twin' | 'lookbook';
  price: string | number;
  currency: string;
  inventory_count: number;
  sku: string;
  status: 'active' | 'frozen' | 'draft' | 'archived' | 'censored' | 'suspended';
  display_order: number;
  fic_bounty: string | number;
  fic_discount_percent: string | number;
  provenance_hash?: string;
  escrow_protected: boolean;
  tags: string[];
  voice_prompt: string;
  vendor_name: string;
  thumbnail_url?: string;
  images?: string[];
  video_urls?: string[];
  is_comments_paused?: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CommerceLuxuryServiceOverview {
  serviceKey: CommerceLuxuryServiceKey;
  totalItems: number;
  activeItems: number;
  frozenItems: number;
  draftItems: number;
  totalValuation: number;
  totalBountyFic: number;
  totalStock: number;
  healthScore: number;
  status: 'healthy' | 'degraded' | 'critical';
}

export interface CommerceLuxuryOverviewResponse {
  success: boolean;
  timestamp: string;
  totalServices: number;
  services: Record<CommerceLuxuryServiceKey, CommerceLuxuryServiceOverview>;
}

export interface SpawnedCommerceConsole {
  id: number;
  console_name: string;
  slug: string;
  service_key: CommerceLuxuryServiceKey;
  description?: string;
  config?: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}
