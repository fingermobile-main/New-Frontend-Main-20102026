/**
 * Types for Corporate Governance, Compliance, Legal & Privacy Consoles
 * FingerMobile Protocol™ Production Control Plane
 * Phase 2: Board Portfolios, Committee Chambers, DPO/NDPR, AML/KYC, Ethics & Statutory Licensing
 */

export type CorporateGovernanceDomain =
  | 'board_portfolios'
  | 'committee_chambers'
  | 'dpo_privacy'
  | 'compliance_aml'
  | 'whistleblower_ethics'
  | 'statutory_licensing';

export interface CorporateGovernanceItem {
  id: string;
  domain: CorporateGovernanceDomain;
  name: string;
  code: string;
  category: string;
  status: 'active' | 'frozen';
  display_order: number;
  mandate_title?: string | null;
  designated_officer?: string | null;
  clearance_level?: string | null;
  personnel_count: number;
  compliance_score: number | string;
  charter_document_url?: string | null;
  voice_tag?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CorporateGovernanceSummary {
  total_items: string | number;
  active_count: string | number;
  frozen_count: string | number;
  total_personnel: string | number;
  average_compliance_score: string | number;
  total_portfolios: string | number;
  total_committees: string | number;
  total_privacy_audits: string | number;
  total_licenses: string | number;
}

export interface CorporateGovernanceDomainStat {
  domain: string;
  count: string | number;
  domain_personnel: string | number;
  avg_score: string | number;
}

export interface CorporateGovernanceOverview {
  summary: CorporateGovernanceSummary;
  domains: CorporateGovernanceDomainStat[];
  totalSpawns: number;
  timestamp: string;
}

export interface CorporateGovernanceSpawnedConsole {
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

export interface CreateCorporateGovernanceItemPayload {
  domain: CorporateGovernanceDomain;
  name: string;
  code: string;
  category: string;
  mandate_title?: string;
  designated_officer?: string;
  clearance_level?: string;
  personnel_count?: number;
  compliance_score?: number;
  charter_document_url?: string;
  voice_tag?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ReorderEntry {
  id: string;
  display_order: number;
}

