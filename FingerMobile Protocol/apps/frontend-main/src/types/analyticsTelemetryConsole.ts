import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface AnalyticsTelemetryConsoleItem {
  id: string;
  domain: string;
  name: string;
  code: string;
  category: 'Traffic & Throughput' | 'Latency Budgets' | 'Database Health' | 'User Engagement' | 'Commerce Funnels' | 'Reliability & Faults' | 'Media Performance' | 'Caching & State' | 'Financial Rails' | 'Alerting Engine' | 'Data Retention' | string;
  status: 'active' | 'frozen';
  display_order: number;
  metric_scope?: string;
  sampling_rate_hz?: number;
  p99_latency_ms?: number;
  qps_throughput?: number;
  retention_days?: number;
  telemetry_feed_url?: string;
  voice_tag?: AfricanVoiceLine;
  notes?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface AnalyticsTelemetryConsoleOverview {
  summary: {
    total_items: string | number;
    active_count: string | number;
    frozen_count: string | number;
    total_qps: string | number;
    avg_p99_latency: string | number;
    avg_sampling_hz: string | number;
    total_traffic_nodes: string | number;
    total_latency_nodes: string | number;
    total_db_nodes: string | number;
  };
  categories: Array<{
    category: string;
    count: string | number;
    category_qps: string | number;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface AnalyticsTelemetryConsoleSpawn {
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
