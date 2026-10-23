/**
 * Types for Security, DefCon Threats & Hardware Enclaves Console
 * FingerMobile Protocol™ Production Control Plane
 * Phase 5: Camus Hardware Enclaves, Threat Heuristics, DDoS Throttles, Cryptographic Vaults, ZK Privacy & DefCon Isolation
 */

export type SecurityDefConDomain =
  | 'camus_hardware_enclave'
  | 'threat_heuristics_ddos'
  | 'cryptographic_key_vaults'
  | 'zk_privacy_audits'
  | 'zero_trust_access'
  | 'incident_containment';

export interface SecurityDefConItem {
  id: string;
  domain: SecurityDefConDomain;
  name: string;
  code: string;
  category: string;
  status: 'active' | 'frozen';
  display_order: number;
  enclave_zone?: string | null;
  threat_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'DEFCON-1';
  packets_per_sec: number | string;
  blocked_events: number;
  security_rating: number | string;
  enclave_cert_url?: string | null;
  voice_tag?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface SecurityDefConSummary {
  total_items: string | number;
  active_count: string | number;
  frozen_count: string | number;
  total_blocked_events: string | number;
  total_packets_per_sec: string | number;
  average_security_rating: string | number;
  total_enclaves: string | number;
  total_vaults: string | number;
  total_zk_provers: string | number;
  total_ddos_shields: string | number;
  critical_threat_nodes: string | number;
}

export interface SecurityDefConDomainStat {
  domain: string;
  count: string | number;
  domain_blocked: string | number;
  avg_rating: string | number;
}

export interface SecurityDefConOverview {
  summary: SecurityDefConSummary;
  domains: SecurityDefConDomainStat[];
  totalSpawns: number;
  timestamp: string;
}

export interface SecurityDefConSpawnedConsole {
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

export interface CreateSecurityDefConItemPayload {
  domain: SecurityDefConDomain;
  name: string;
  code: string;
  category: string;
  enclave_zone?: string;
  threat_severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'DEFCON-1';
  packets_per_sec?: number;
  blocked_events?: number;
  security_rating?: number;
  enclave_cert_url?: string;
  voice_tag?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ReorderEntry {
  id: string;
  display_order: number;
}
