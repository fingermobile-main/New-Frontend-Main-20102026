/**
 * Types for Content Moderation, Trust, Safety & Ethics Console
 * FingerMobile Protocol™ Production Control Plane
 * Phase 7: Heuristic AI Flagging, Quarantine Strike Ledger, Minor/Child Shield, Appeals Tribunal, Copyright Content ID & Forensic Audits
 */

export type ContentModerationDomain =
  | 'heuristic_flagging_queue'
  | 'quarantine_strike_ledger'
  | 'minor_child_persona_shield'
  | 'appeals_tribunal_review'
  | 'copyright_content_id'
  | 'safety_audit_forensics';

export interface ContentModerationItem {
  id: string;
  domain: ContentModerationDomain;
  name: string;
  code: string;
  category: string;
  status: 'active' | 'frozen';
  display_order: number;
  risk_score: number | string;
  strike_level: 'CLEAN' | 'STRIKE-1' | 'STRIKE-2' | 'APPEAL-ACTIVE' | 'DISPUTED' | 'CLAIMED' | 'QUARANTINE';
  action_policy: string;
  total_cases_processed: number;
  quarantined_items_count: number;
  evidence_manifest_url?: string | null;
  voice_tag?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ContentModerationSummary {
  total_items: string | number;
  active_count: string | number;
  frozen_count: string | number;
  total_cases_processed: string | number;
  total_quarantined: string | number;
  average_risk_score: string | number;
  total_strike_rules: string | number;
  total_child_shields: string | number;
  total_tribunal_chambers: string | number;
  total_copyright_engines: string | number;
  active_penalty_holds: string | number;
}

export interface ContentModerationDomainStat {
  domain: string;
  count: string | number;
  domain_cases: string | number;
  domain_quarantined: string | number;
  avg_risk: string | number;
}

export interface ContentModerationOverview {
  summary: ContentModerationSummary;
  domains: ContentModerationDomainStat[];
  totalSpawns: number;
  timestamp: string;
}

export interface ContentModerationSpawnedConsole {
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

export interface CreateContentModerationItemPayload {
  domain: ContentModerationDomain;
  name: string;
  code: string;
  category: string;
  risk_score?: number;
  strike_level?: 'CLEAN' | 'STRIKE-1' | 'STRIKE-2' | 'APPEAL-ACTIVE' | 'DISPUTED' | 'CLAIMED' | 'QUARANTINE';
  action_policy?: string;
  total_cases_processed?: number;
  quarantined_items_count?: number;
  evidence_manifest_url?: string;
  voice_tag?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ReorderEntry {
  id: string;
  display_order: number;
}
