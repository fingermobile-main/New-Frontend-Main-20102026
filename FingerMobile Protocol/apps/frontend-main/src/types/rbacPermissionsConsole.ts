/**
 * Types for Members, RBAC Permissions & Organization Citadel Console
 * FingerMobile Protocol™ Production Control Plane
 * Phase 8: Sovereign RBAC Matrix, Pages Permission Gates, Merchant Citadel KYC, Dignitaries Council, Session Scopes & Membership Tiers
 */

export type RbacPermissionsDomain =
  | 'sovereign_rbac_matrix'
  | 'pages_permission_gates'
  | 'merchant_organization_kyc'
  | 'council_dignitaries_ledger'
  | 'session_token_scopes'
  | 'membership_loyalty_tiers';

export interface RbacPermissionsItem {
  id: string;
  domain: RbacPermissionsDomain;
  name: string;
  code: string;
  category: string;
  status: 'active' | 'frozen';
  display_order: number;
  role_tier?: string | null;
  permission_level: string;
  assigned_members_count: number;
  route_scope: string;
  credential_cert_url?: string | null;
  voice_tag?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface RbacPermissionsSummary {
  total_items: string | number;
  active_count: string | number;
  frozen_count: string | number;
  total_assigned_members: string | number;
  total_roles: string | number;
  total_route_gates: string | number;
  total_merchant_citadels: string | number;
  total_dignitaries: string | number;
  total_session_rules: string | number;
  total_loyalty_tiers: string | number;
}

export interface RbacPermissionsDomainStat {
  domain: string;
  count: string | number;
  domain_members: string | number;
}

export interface RbacPermissionsOverview {
  summary: RbacPermissionsSummary;
  domains: RbacPermissionsDomainStat[];
  totalSpawns: number;
  timestamp: string;
}

export interface RbacPermissionsSpawnedConsole {
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

export interface CreateRbacPermissionsItemPayload {
  domain: RbacPermissionsDomain;
  name: string;
  code: string;
  category: string;
  role_tier?: string;
  permission_level?: string;
  assigned_members_count?: number;
  route_scope?: string;
  credential_cert_url?: string;
  voice_tag?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ReorderEntry {
  id: string;
  display_order: number;
}
