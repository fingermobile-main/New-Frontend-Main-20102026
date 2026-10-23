import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface MarketingCampaignConsoleItem {
  id: string;
  domain: string;
  name: string;
  code: string;
  category: 'In-Feed Native Ads' | 'Audio Ad Network' | 'Video Ad Network' | 'Discount & Promo Codes' | 'Sponsored Placements' | 'Gaming Sponsorships' | 'Geo-Targeted Campaigns' | 'Affiliate Networks' | 'Retargeting Engines' | 'Ad Auction Systems' | 'Attribution & Analytics' | string;
  status: 'active' | 'frozen';
  display_order: number;
  campaign_channel?: string;
  budget_allocated_fic?: number;
  budget_spent_fic?: number;
  impressions_delivered?: number;
  cpc_bid_fic?: number;
  roi_multiple?: number;
  banner_creative_url?: string;
  voice_tag?: AfricanVoiceLine;
  notes?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface MarketingCampaignConsoleOverview {
  summary: {
    total_items: string | number;
    active_count: string | number;
    frozen_count: string | number;
    total_budget_allocated: string | number;
    total_budget_spent: string | number;
    total_impressions: string | number;
    avg_roi_multiple: string | number;
  };
  categories: Array<{
    category: string;
    count: string | number;
    spent: string | number;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface MarketingCampaignConsoleSpawn {
  id: string;
  console_title: string;
  target_domain: string;
  route: string;
  icon_name: string;
  badge_text: string;
  status: string;
  config: Record<string, any>;
  created_at?: string;
}
