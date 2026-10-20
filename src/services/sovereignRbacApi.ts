/**
 * Sovereign RBAC & Consoles API Service
 * FingerMobile Protocol Frontend
 */

import api from './api';

export interface StaffRole {
  id: string;
  slug: string;
  department: string;
  name: string;
  description: string;
  clearance_level: number;
  is_active: boolean;
}

export interface StaffAssignment {
  id: string;
  user_id: string;
  role_id: string;
  role_name: string;
  department: string;
  clearance_level: number;
  username: string;
  email: string;
  display_name: string;
  assigned_by: string;
  notes?: string;
  created_at: string;
}

export interface BadgeTierPrivilege {
  id: string;
  tier_name: string;
  badge_level: number;
  min_fic_balance: number;
  min_reputation: number;
  fee_discount_pct: number;
  can_access_private_vaults: boolean;
  can_access_early_drops: boolean;
  priority_curation: boolean;
  perks: string[];
  badge_color: string;
}

export interface DistinguishedRank {
  id: string;
  rank_name: string;
  rank_slug: string;
  description: string;
  voting_weight: number;
  can_access_council_chamber: boolean;
  can_submit_governance_proposals: boolean;
  direct_founder_advisory: boolean;
  honorary_perks: string[];
  badge_accent: string;
}

export interface DistinguishedDignitary {
  id: string;
  user_id: string;
  rank_id: string;
  rank_name: string;
  voting_weight: number;
  badge_accent: string;
  username: string;
  email: string;
  display_name: string;
  citation?: string;
  appointed_by: string;
  appointed_at: string;
}

export interface ModeratorScope {
  id: string;
  user_id: string;
  username: string;
  email: string;
  display_name: string;
  mod_tier: string;
  assigned_category: string;
  can_timeout_users: boolean;
  can_ban_users: boolean;
  can_pin_topics: boolean;
  can_resolve_disputes: boolean;
  appointed_by: string;
  created_at: string;
}

export interface PageDirectoryEntry {
  id: string;
  path: string;
  title: string;
  category: string;
  min_role_tier: 'PUBLIC' | 'MEMBER' | 'BADGE_TIER' | 'MODERATOR' | 'BACKOFFICE' | 'CFO' | 'SUPERADMIN';
  is_public_member_facing: boolean;
  is_backoffice_only: boolean;
  is_moderator_only: boolean;
  is_distinguished_only: boolean;
  is_executive_only: boolean;
  is_maintenance_locked: boolean;
  has_confidential_telemetry: boolean;
  confidential_fields: string[];
  description?: string;
}

export interface RbacOverviewStats {
  totalUsers: number;
  activeStaff: number;
  badgeTiers: number;
  distinguishedMembers: number;
  activeModerators: number;
  registeredPages: number;
}

export interface UserPermissionSummary {
  id: string;
  username: string;
  email: string;
  display_name: string;
  role: string;
  is_active: boolean;
  reputation_score: number;
  gem_balance: number;
  executiveTier: 'PRIMARY_SUPER_ADMIN' | 'SECONDARY_ADMIN_CFO' | 'PLATFORM_MEMBER';
  isExecutive: boolean;
  staff_roles: Array<{ roleId: string; roleName: string; department: string; clearance: number }>;
  distinguished_ranks: Array<{ rankId: string; rankName: string; votingWeight: number }>;
  moderator_scopes: Array<{ modTier: string; category: string; canBan: boolean }>;
}

export interface CreatorProfile {
  id: string;
  user_id: string;
  country_code: string;
  tier: string;
  status: string;
  is_geo_suspect: boolean;
  created_at: string;
  username?: string;
  display_name?: string;
  email?: string;
  reputation_score?: number;
  gem_balance?: number;
}

export interface OrganizationProfile {
  id: string;
  name: string;
  type: string;
  country: string;
  state: string;
  city: string;
  website: string;
  accreditation_status: string;
  is_verified: boolean;
  metadata: {
    registration_no?: string;
    tax_id?: string;
    tier?: string;
    ads_credit_allocated?: number;
    sla_tier?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export const sovereignRbacApi = {
  // Overview
  getOverview: async (): Promise<RbacOverviewStats> => {
    const res = await api.get('/api/rbac-consoles/overview');
    return res.data.stats;
  },

  // Users Matrix
  getUsersMatrix: async (search?: string, limit = 50, offset = 0): Promise<UserPermissionSummary[]> => {
    const res = await api.get('/api/rbac-consoles/users-matrix', {
      params: { search, limit, offset }
    });
    return res.data.users || [];
  },

  updateUserRole: async (userId: string, role: string): Promise<any> => {
    const res = await api.post('/api/rbac-consoles/users/update-role', { userId, role });
    return res.data;
  },

  // Staff
  getStaffDirectory: async (): Promise<{ roles: StaffRole[]; assignments: StaffAssignment[] }> => {
    const res = await api.get('/api/rbac-consoles/staff');
    return { roles: res.data.roles || [], assignments: res.data.assignments || [] };
  },

  assignStaff: async (userId: string, roleId: string, notes?: string): Promise<any> => {
    const res = await api.post('/api/rbac-consoles/staff/assign', { userId, roleId, notes });
    return res.data;
  },

  removeStaff: async (id: string): Promise<any> => {
    const res = await api.delete(`/api/rbac-consoles/staff/assign/${id}`);
    return res.data;
  },

  // Badges
  getBadgeTiers: async (): Promise<BadgeTierPrivilege[]> => {
    const res = await api.get('/api/rbac-consoles/badges');
    return res.data.tiers || [];
  },

  updateBadgeTier: async (id: string, payload: Partial<BadgeTierPrivilege>): Promise<any> => {
    const res = await api.put(`/api/rbac-consoles/badges/${id}`, payload);
    return res.data;
  },

  // Distinguished
  getDistinguished: async (): Promise<{ ranks: DistinguishedRank[]; dignitaries: DistinguishedDignitary[] }> => {
    const res = await api.get('/api/rbac-consoles/distinguished');
    return { ranks: res.data.ranks || [], dignitaries: res.data.dignitaries || [] };
  },

  appointDistinguished: async (userId: string, rankId: string, citation?: string): Promise<any> => {
    const res = await api.post('/api/rbac-consoles/distinguished/appoint', { userId, rankId, citation });
    return res.data;
  },

  revokeDistinguished: async (id: string): Promise<any> => {
    const res = await api.delete(`/api/rbac-consoles/distinguished/appoint/${id}`);
    return res.data;
  },

  // Moderators
  getModerators: async (): Promise<ModeratorScope[]> => {
    const res = await api.get('/api/rbac-consoles/moderators');
    return res.data.moderators || [];
  },

  assignModerator: async (payload: {
    userId: string;
    modTier: string;
    assignedCategory?: string;
    canTimeout?: boolean;
    canBan?: boolean;
    canPin?: boolean;
    canDispute?: boolean;
  }): Promise<any> => {
    const res = await api.post('/api/rbac-consoles/moderators/assign', payload);
    return res.data;
  },

  revokeModerator: async (id: string): Promise<any> => {
    const res = await api.delete(`/api/rbac-consoles/moderators/assign/${id}`);
    return res.data;
  },

  // Pages Directory
  getPages: async (category?: string, minTier?: string, search?: string): Promise<PageDirectoryEntry[]> => {
    const res = await api.get('/api/rbac-consoles/pages', {
      params: { category, minTier, search }
    });
    return res.data.pages || [];
  },

  registerPage: async (page: Partial<PageDirectoryEntry>): Promise<any> => {
    const res = await api.post('/api/rbac-consoles/pages/register', page);
    return res.data;
  },

  updatePage: async (id: string, page: Partial<PageDirectoryEntry>): Promise<any> => {
    const res = await api.put(`/api/rbac-consoles/pages/${id}`, page);
    return res.data;
  },

  // Creators Hive
  getCreatorsDirectory: async (): Promise<{ creators: CreatorProfile[]; stats: { total: number; active: number; tiers: any[] } }> => {
    const res = await api.get('/api/rbac-consoles/creators');
    return {
      creators: res.data.creators || [],
      stats: res.data.stats || { total: 0, active: 0, tiers: [] }
    };
  },

  updateCreatorProfile: async (id: string, payload: { tier?: string; status?: string }): Promise<any> => {
    const res = await api.put(`/api/rbac-consoles/creators/${id}`, payload);
    return res.data;
  },

  // Business Organizations Hive
  getBusinessDirectory: async (): Promise<{ businesses: OrganizationProfile[]; stats: { total: number; verified: number } }> => {
    const res = await api.get('/api/rbac-consoles/business');
    return {
      businesses: res.data.businesses || [],
      stats: res.data.stats || { total: 0, verified: 0 }
    };
  },

  updateBusinessAccreditation: async (id: string, payload: { accreditation_status?: string; is_verified?: boolean; metadata?: any }): Promise<any> => {
    const res = await api.put(`/api/rbac-consoles/business/${id}`, payload);
    return res.data;
  }
};

export default sovereignRbacApi;
