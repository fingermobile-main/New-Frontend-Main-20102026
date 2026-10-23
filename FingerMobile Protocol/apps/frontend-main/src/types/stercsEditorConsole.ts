import { AfricanVoiceLine } from '../utils/SuperViAudioEngine';

export interface StercsEditorConsoleItem {
  id: string;
  domain: string;
  name: string;
  code: string;
  category: 'Transitions' | 'Audio & SFX' | 'Overlays & Motion' | 'VFX & Shaders' | 'Core Architecture' | string;
  status: 'active' | 'frozen';
  display_order: number;
  dsl_script?: string;
  target_resolution?: string;
  render_engine?: string;
  fps_rate?: number;
  latency_budget_ms?: number;
  asset_url?: string;
  voice_tag?: AfricanVoiceLine;
  notes?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface StercsEditorConsoleOverview {
  summary: {
    total_items: string | number;
    active_count: string | number;
    frozen_count: string | number;
    total_transitions: string | number;
    total_audio_sfx: string | number;
    total_overlays: string | number;
    total_vfx_shaders: string | number;
    avg_fps: string | number;
    avg_latency_budget: string | number;
  };
  categories: Array<{
    category: string;
    count: string | number;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface StercsEditorConsoleSpawn {
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
