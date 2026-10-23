/**
 * Types for Systems Infrastructure, AI Engines & Dev Console
 * FingerMobile Protocol™ Production Control Plane
 * Phase 3: STERCS Sentient Core, Guardian AI DefCon, NexusGNN, BullMQ Queues, Microservices Mesh & Cloud DB
 */

export type SystemInfraDomain =
  | 'stercs_control_core'
  | 'guardian_ai_defcon'
  | 'nexus_gnn_engine'
  | 'worker_queues_redis'
  | 'microservices_mesh'
  | 'cloud_infra_database';

export interface SystemInfraItem {
  id: string;
  domain: SystemInfraDomain;
  name: string;
  code: string;
  category: string;
  status: 'active' | 'frozen';
  display_order: number;
  cluster_node?: string | null;
  defcon_level: number;
  throughput_tps: number | string;
  latency_ms: number | string;
  health_score: number | string;
  config_manifest_url?: string | null;
  voice_tag?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface SystemInfraSummary {
  total_items: string | number;
  active_count: string | number;
  frozen_count: string | number;
  total_throughput_tps: string | number;
  average_latency_ms: string | number;
  average_health_score: string | number;
  total_core_nodes: string | number;
  total_defcon_modules: string | number;
  total_gnn_pipelines: string | number;
  total_queues: string | number;
  total_mesh_services: string | number;
  total_database_clusters: string | number;
}

export interface SystemInfraDomainStat {
  domain: string;
  count: string | number;
  domain_tps: string | number;
  avg_latency: string | number;
  avg_health: string | number;
}

export interface SystemInfraOverview {
  summary: SystemInfraSummary;
  domains: SystemInfraDomainStat[];
  totalSpawns: number;
  timestamp: string;
}

export interface SystemInfraSpawnedConsole {
  id: string;
  console_title: string;
  target_domain: string;
  route: string;
  icon_name: string;
  badge_text: string;
  status: 'active' | 'frozen';
  config?: Record<string, any>;
  created_at?: string;
}

export interface CreateSystemInfraItemPayload {
  domain: SystemInfraDomain;
  name: string;
  code: string;
  category: string;
  cluster_node?: string;
  defcon_level?: number;
  throughput_tps?: number;
  latency_ms?: number;
  health_score?: number;
  config_manifest_url?: string;
  voice_tag?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ReorderEntry {
  id: string;
  display_order: number;
}
