import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface MemberRetentionConsoleItem {
  id: string;
  domain: string;
  name: string;
  code: string;
  category: 'Onboarding Cohorts' | 'Engagement Loops' | 'Loyalty Milestones' | 'Reactivation Engines' | 'VIP Concierge' | 'Gamification Streaks' | 'Community Champions' | 'Predictive AI' | 'Commerce Retention' | 'Viral Growth' | 'Subscription Defense' | 'Sovereign Prestige' | string;
  status: 'active' | 'frozen';
  display_order: number;
  cohort_target?: string;
  churn_risk_score?: number;
  retention_rate_pct?: number;
  active_cohort_size?: number;
  reward_bonus_fic?: number;
  campaign_asset_url?: string;
  voice_tag?: AfricanVoiceLine;
  notes?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface MemberRetentionConsoleOverview {
  summary: {
    total_items: string | number;
    active_count: string | number;
    frozen_count: string | number;
    total_active_cohorts: string | number;
    avg_retention_rate: string | number;
    avg_churn_risk: string | number;
    total_reward_pool_fic: string | number;
  };
  categories: Array<{
    category: string;
    count: string | number;
    cohort_total: string | number;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface MemberRetentionConsoleSpawn {
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
