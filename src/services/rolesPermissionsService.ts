/**
 * FingerMobile Protocol™ - Roles & Permissions API Service
 * Handles Collaborator seats, invitations, role definitions, and site member access.
 */

import {
  Collaborator,
  CollaboratorSeatPlan,
  RoleDetail,
  Permission,
  MemberRole,
  MemberPage,
  SiteMemberAccessOverview,
  ModeratorAssignment,
  ModeratorTierLevel,
  ModScopeType,
  ModeratorTierDefaults,
  hasPermission,
} from '../types/roles-permissions';

const API_BASE = '/api/v1';
const MODS_STORAGE_KEY = 'fingermobile_moderator_assignments_v1';

export const DEFAULT_MEMBER_PAGES: MemberPage[] = [
  {
    id: 'page_dancia',
    title: 'Dancia-4Tv Broadcast Cinema',
    path: '/dancia4tv',
    isRestricted: true,
    description: '4K Ultra-HD broadcast cinema, Dolby Atmos streams, and live sound clash arenas.',
    allowedRoleIds: ['role_cinema_pass', 'role_admin_co_owner', 'role_franchise_operator'],
    requiredSubscriptionTier: 'Cinema Pass & TVoD Clashes',
    gatedCategory: 'Media & Entertainment',
    monthlyFIC: 10,
  },
  {
    id: 'page_beatwave',
    title: 'BeatwaveNG Hi-Fi SoundRiver',
    path: '/beatwaveng',
    isRestricted: true,
    description: '24-bit 192kHz lossless audio, master multitrack stem downloads, AI playlists.',
    allowedRoleIds: ['role_flac_master', 'role_admin_co_owner', 'role_franchise_operator'],
    requiredSubscriptionTier: 'Master FLAC Hi-Fi Pass',
    gatedCategory: 'Media & Audio',
    monthlyFIC: 8,
  },
  {
    id: 'page_fingerlux',
    title: 'FingerLux VIP Hospitality & Fleet',
    path: '/fingerlux',
    isRestricted: true,
    description: 'Armored chauffeur airport escorts, private villa & superyacht bookings.',
    allowedRoleIds: ['role_fleet_concierge', 'role_admin_co_owner'],
    requiredSubscriptionTier: 'Presidential Fleet Concierge',
    gatedCategory: 'Luxury & Lifestyle',
    monthlyFIC: 50,
  },
  {
    id: 'page_flamingo',
    title: 'Flamingo 18+ Private Vault',
    path: '/flamingo',
    isRestricted: true,
    description: 'Zero-knowledge keycards, 1-on-1 private chambers, zero bank statement tracing.',
    allowedRoleIds: ['role_flamingo_keyholder', 'role_admin_co_owner'],
    requiredSubscriptionTier: 'Private Chamber Access',
    gatedCategory: 'Privileged Adult',
    monthlyFIC: 15,
  },
  {
    id: 'page_stercs',
    title: 'Stercs Studio & Media Editor',
    path: '/stercs',
    isRestricted: true,
    description: 'Cloud GPU 4K render farm, AI voice denoiser, scene replacer, presets.',
    allowedRoleIds: ['role_stercs_render', 'role_admin_co_owner', 'role_franchise_operator'],
    requiredSubscriptionTier: '4K AI Render Farm Suite',
    gatedCategory: 'Creative Tools',
    monthlyFIC: 18,
  },
  {
    id: 'page_guardian',
    title: 'Guardian AI Cyber Protection',
    path: '/guardian-protection',
    isRestricted: true,
    description: 'Live-motion face recognition, anti-deepfake scan, high-value vault lock.',
    allowedRoleIds: ['role_guardian_shield', 'role_admin_co_owner'],
    requiredSubscriptionTier: 'Enterprise Biometric Shield',
    gatedCategory: 'Security & Identity',
    monthlyFIC: 35,
  },
  {
    id: 'page_loansqr',
    title: 'LoanSqr SME Micro-Finance',
    path: '/loansqr',
    isRestricted: true,
    description: 'Credit scoring up to ₦5M, 0.8% float rate, 24h disbursement to vault.',
    allowedRoleIds: ['role_loansqr_float', 'role_admin_co_owner'],
    requiredSubscriptionTier: 'SME Commercial Float',
    gatedCategory: 'Fintech & Lending',
    monthlyFIC: 40,
  },
  {
    id: 'page_franchise',
    title: 'Franchise Sovereign Operator',
    path: '/franchise',
    isRestricted: true,
    description: 'Regional territory exclusivity, 30% net platform royalty share, sub-admin.',
    allowedRoleIds: ['role_franchise_operator', 'role_admin_co_owner'],
    requiredSubscriptionTier: 'Territorial License Node',
    gatedCategory: 'Franchise & Nodes',
    monthlyFIC: 250,
  },
  {
    id: 'page_lushpressies',
    title: 'Lush-Pressies Gifting & Romance',
    path: '/lushpressies',
    isRestricted: true,
    description: '3D plushie vault, ghost dating mode, radiant emerald boxes, creator tips.',
    allowedRoleIds: ['role_lush_vip', 'role_admin_co_owner'],
    requiredSubscriptionTier: 'VIP Matchmaker & Gifting',
    gatedCategory: 'Luxury & Romance',
    monthlyFIC: 12,
  },
  {
    id: 'page_ownit',
    title: 'OwnIt Haute Horology & Escrow',
    path: '/ownit',
    isRestricted: true,
    description: 'Horology passports, VIP auctions, appraiser concierge, vault custody.',
    allowedRoleIds: ['role_ownit_provenance', 'role_admin_co_owner'],
    requiredSubscriptionTier: 'Haute Provenance Pass',
    gatedCategory: 'Luxury & Commerce',
    monthlyFIC: 25,
  },
];

export const DEFAULT_MEMBER_ROLES: MemberRole[] = [
  {
    id: 'role_explorer_free',
    name: 'Sovereign Explorer (Free Tier)',
    description: 'Standard community social access, P2P encrypted messaging, 10GB vault quota.',
    assignedMembersCount: 14250,
    accessiblePagesCount: 12,
    accessiblePageIds: ['page_forum', 'page_gems', 'page_groups'],
    createdAt: '2026-01-01T00:00:00Z',
    subscriptionPlanId: 'sub_platform_free',
    subscriptionPlanName: 'Sovereign Explorer',
    monthlyFIC: 0,
    monthlyNaira: 0,
  },
  {
    id: 'role_cinema_pass',
    name: 'Dancia Cinema Pass VIP',
    description: '4K Ultra-HD broadcast cinema streams and TVoD sound clashes.',
    assignedMembersCount: 3820,
    accessiblePagesCount: 1,
    accessiblePageIds: ['page_dancia'],
    createdAt: '2026-02-15T00:00:00Z',
    subscriptionPlanId: 'sub_media_dancia',
    subscriptionPlanName: 'Cinema Pass & TVoD Clashes',
    monthlyFIC: 10,
    monthlyNaira: 1000,
  },
  {
    id: 'role_flac_master',
    name: 'Beatwave Hi-Fi Master',
    description: '24-bit 192kHz lossless audio and master stem downloads.',
    assignedMembersCount: 2940,
    accessiblePagesCount: 1,
    accessiblePageIds: ['page_beatwave'],
    createdAt: '2026-02-18T00:00:00Z',
    subscriptionPlanId: 'sub_media_beatwave',
    subscriptionPlanName: 'Master FLAC Hi-Fi Pass',
    monthlyFIC: 8,
    monthlyNaira: 800,
  },
  {
    id: 'role_fleet_concierge',
    name: 'FingerLux Presidential Fleet VIP',
    description: 'Armored chauffeur airport escorts, private villas, and yacht charters.',
    assignedMembersCount: 185,
    accessiblePagesCount: 1,
    accessiblePageIds: ['page_fingerlux'],
    createdAt: '2026-03-01T00:00:00Z',
    subscriptionPlanId: 'sub_lux_fingerlux',
    subscriptionPlanName: 'Presidential Fleet Concierge',
    monthlyFIC: 50,
    monthlyNaira: 5000,
  },
  {
    id: 'role_flamingo_keyholder',
    name: 'Flamingo Private Chamber Key',
    description: 'Zero-knowledge 1-on-1 private chamber access and vault keys.',
    assignedMembersCount: 1840,
    accessiblePagesCount: 1,
    accessiblePageIds: ['page_flamingo'],
    createdAt: '2026-03-10T00:00:00Z',
    subscriptionPlanId: 'sub_adult_flamingo',
    subscriptionPlanName: 'Private Chamber Access',
    monthlyFIC: 15,
    monthlyNaira: 1500,
  },
  {
    id: 'role_stercs_render',
    name: 'Stercs Studio AI Render Pro',
    description: 'Cloud GPU 4K AI video render farm, AI voice denoiser & preset suite.',
    assignedMembersCount: 1480,
    accessiblePagesCount: 1,
    accessiblePageIds: ['page_stercs'],
    createdAt: '2026-03-22T00:00:00Z',
    subscriptionPlanId: 'sub_creator_stercs',
    subscriptionPlanName: '4K AI Render Farm Suite',
    monthlyFIC: 18,
    monthlyNaira: 1800,
  },
  {
    id: 'role_guardian_shield',
    name: 'Guardian AI Enterprise Shield',
    description: 'Live-motion facial verification, anti-deepfake scan, high-value vault lock.',
    assignedMembersCount: 650,
    accessiblePagesCount: 1,
    accessiblePageIds: ['page_guardian'],
    createdAt: '2026-04-05T00:00:00Z',
    subscriptionPlanId: 'sub_sec_guardian',
    subscriptionPlanName: 'Enterprise Biometric Shield',
    monthlyFIC: 35,
    monthlyNaira: 3500,
  },
  {
    id: 'role_franchise_operator',
    name: 'Franchise Territorial Node',
    description: 'Exclusive regional territory node license with 30% platform net royalty share.',
    assignedMembersCount: 42,
    accessiblePagesCount: 3,
    accessiblePageIds: ['page_franchise', 'page_dancia', 'page_stercs'],
    createdAt: '2026-04-12T00:00:00Z',
    subscriptionPlanId: 'sub_node_franchise',
    subscriptionPlanName: 'Territorial License Node',
    monthlyFIC: 250,
    monthlyNaira: 25000,
  },
];

class RolesPermissionsService {
  // ----------------------------------------------------
  // Collaborators & Seat Plan
  // ----------------------------------------------------

  async getCollaborators(params: {
    page?: number;
    limit?: number;
    search?: string;
    roleId?: string;
    status?: string;
  } = {}): Promise<{
    seats: CollaboratorSeatPlan;
    collaborators: Collaborator[];
    pagination: { page: number; limit: number; totalPages: number; totalCount: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.roleId) query.append('roleId', params.roleId);
    if (params.status) query.append('status', params.status);

    try {
      const res = await fetch(`${API_BASE}/collaborators?${query.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      // Fallback to local default structure if offline
    }

    return {
      seats: { totalSeats: 10, usedSeats: 5, availableSeats: 5, canUpgrade: true },
      collaborators: [
        {
          id: 'usr_981',
          name: 'Marcus Ellery',
          email: 'marcus.ellery@testmail.com',
          avatarUrl: null,
          roles: [{ id: 'role_admin_co_owner', name: 'Admin (Co-Owner)' }],
          status: 'Active',
          statusDate: '2026-05-06T00:00:00Z',
          locationScope: { type: 'ALL' },
        },
        {
          id: 'usr_982',
          name: 'Priya Vandermeer',
          email: 'priya.vandermeer@fingermobileprotocol.com',
          avatarUrl: null,
          roles: [
            { id: 'role_back_office_manager', name: 'Back Office Manager' },
            { id: 'role_custom_online_programs_author', name: 'Online Programs Author' },
          ],
          status: 'Active',
          statusDate: '2024-09-08T00:00:00Z',
          locationScope: { type: 'ALL' },
        },
        {
          id: 'usr_983',
          name: 'Theo Brannigan',
          email: 'theo.brannigan@fingermobileprotocol.com',
          avatarUrl: null,
          roles: [{ id: 'role_admin_co_owner', name: 'Owner' }],
          status: 'Active',
          statusDate: '2024-05-12T00:00:00Z',
          locationScope: { type: 'ALL' },
        },
        {
          id: 'usr_984',
          name: 'Equipe',
          email: 'equipe@fingermobileprotocol.com',
          avatarUrl: null,
          roles: [{ id: 'role_back_office_manager', name: 'Back Office Manager' }],
          status: 'Active',
          statusDate: '2024-09-08T00:00:00Z',
          locationScope: { type: 'SPECIFIC', locationIds: ['loc_lagos_hq'], locationNames: ['Lagos Flagship Office'] },
        },
        {
          id: 'usr_985',
          name: 'My Workspace',
          email: 'workspace@fingermobileprotocol.com',
          avatarUrl: null,
          roles: [
            { id: 'role_admin_co_owner', name: 'Admin (Co-Owner)' },
            { id: 'role_custom_online_programs_author', name: 'Online Programs Author' },
          ],
          status: 'Active',
          statusDate: '2025-11-24T00:00:00Z',
          locationScope: { type: 'ALL' },
        },
      ],
      pagination: { page: 1, limit: 10, totalPages: 1, totalCount: 5 },
    };
  }

  async inviteCollaborator(payload: {
    email: string;
    name?: string;
    roleIds: string[];
    locationScope?: { type: 'ALL' | 'SPECIFIC'; locationIds?: string[]; locationNames?: string[] };
  }): Promise<{ success: boolean; collaborator: Collaborator }> {
    const res = await fetch(`${API_BASE}/collaborators/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to invite collaborator');
    }
    return await res.json();
  }

  async updateCollaboratorRoles(
    id: string,
    roleIds: string[]
  ): Promise<{ success: boolean; collaborator: Collaborator }> {
    const res = await fetch(`${API_BASE}/collaborators/${id}/roles`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleIds }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update roles');
    }
    return await res.json();
  }

  async updateCollaboratorLocations(
    id: string,
    payload: { type: 'ALL' | 'SPECIFIC'; locationIds?: string[]; locationNames?: string[] }
  ): Promise<{ success: boolean; collaborator: Collaborator }> {
    const res = await fetch(`${API_BASE}/collaborators/${id}/locations`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update locations');
    }
    return await res.json();
  }

  async removeCollaborator(id: string): Promise<{ success: boolean; freedSeat: boolean }> {
    const res = await fetch(`${API_BASE}/collaborators/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to remove collaborator');
    }
    return await res.json();
  }

  // ----------------------------------------------------
  // Roles & Catalog
  // ----------------------------------------------------

  async getRoles(params: { category?: string; search?: string } = {}): Promise<{
    roles: RoleDetail[];
    grouped: Record<string, RoleDetail[]>;
    totalCount: number;
  }> {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);

    try {
      const res = await fetch(`${API_BASE}/roles?${query.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      // Fallback
    }

    return {
      roles: [],
      grouped: {},
      totalCount: 0,
    };
  }

  async createRole(payload: {
    name: string;
    description: string;
    category?: string;
    permissions: string[];
  }): Promise<{ success: boolean; role: RoleDetail }> {
    const res = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create role');
    }
    return await res.json();
  }

  async updateRole(
    id: string,
    payload: { name?: string; description?: string; permissions?: string[] }
  ): Promise<{ success: boolean; role: RoleDetail }> {
    const res = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update role');
    }
    return await res.json();
  }

  async deleteRole(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete role');
    }
    return await res.json();
  }

  async getPermissions(): Promise<Permission[]> {
    try {
      const res = await fetch(`${API_BASE}/roles/permissions`);
      if (res.ok) {
        const data = await res.json();
        return data.permissions;
      }
    } catch (_e) {
      // Fallback
    }
    return [];
  }

  // ----------------------------------------------------
  // Site Member Access & Page Gating
  // ----------------------------------------------------

  async getMemberAccessOverview(): Promise<SiteMemberAccessOverview> {
    try {
      const res = await fetch(`${API_BASE}/member-access/overview`);
      if (res.ok) {
        const data = await res.json();
        if (data.memberRoles && data.memberRoles.length > 0) {
          return data;
        }
      }
    } catch (_e) {
      // Fallback
    }
    return {
      totalMemberPages: DEFAULT_MEMBER_PAGES.length,
      totalMemberRoles: DEFAULT_MEMBER_ROLES.length,
      memberRoles: DEFAULT_MEMBER_ROLES,
      memberPages: DEFAULT_MEMBER_PAGES,
    };
  }

  async getMemberRoles(search = ''): Promise<MemberRole[]> {
    try {
      const res = await fetch(`${API_BASE}/member-access/roles?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.roles && data.roles.length > 0) {
          return data.roles;
        }
      }
    } catch (_e) {
      // Fallback
    }
    return DEFAULT_MEMBER_ROLES.filter((r: MemberRole) =>
      !search || r.name.toLowerCase().includes(search.toLowerCase()) || (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
    );
  }

  async createMemberRole(payload: {
    name: string;
    description?: string;
    accessiblePageIds: string[];
  }): Promise<{ success: boolean; role: MemberRole }> {
    const res = await fetch(`${API_BASE}/member-access/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create member role');
    }
    return await res.json();
  }

  async updateMemberRole(
    id: string,
    payload: { name?: string; description?: string; accessiblePageIds?: string[] }
  ): Promise<{ success: boolean; role: MemberRole }> {
    const res = await fetch(`${API_BASE}/member-access/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update member role');
    }
    return await res.json();
  }

  async deleteMemberRole(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/member-access/roles/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete member role');
    }
    return await res.json();
  }

  async getMemberPages(): Promise<MemberPage[]> {
    try {
      const res = await fetch(`${API_BASE}/member-access/pages`);
      if (res.ok) {
        const data = await res.json();
        return data.pages;
      }
    } catch (_e) {
      // Fallback
    }
    return DEFAULT_MEMBER_PAGES;
  }

  async updatePagePermissions(
    pageId: string,
    allowedRoleIds: string[]
  ): Promise<{ success: boolean; page: MemberPage }> {
    const res = await fetch(`${API_BASE}/member-access/pages/${pageId}/permissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowedRoleIds }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update page gate permissions');
    }
    return await res.json();
  }


  // =========================================================================
  // 5 Moderator Tiers & RBAC Bitmask Methods
  // =========================================================================

  private getLocalModerators(): ModeratorAssignment[] {
    try {
      const stored = localStorage.getItem(MODS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((m: any) => ({
          ...m,
          customPermissions: BigInt(m.customPermissions || '0'),
          combinedMask: BigInt(m.combinedMask || '0'),
        }));
      }
    } catch (_e) {
      // Ignore
    }
    return [
      {
        id: 'mod-asg-01',
        userId: 'user-001',
        userName: 'Mbah Israel Obinna',
        userEmail: 'fingermobileprotocol@gmail.com',
        avatarUrl: '/assets/branding/mbah_israel_obinna.jpeg',
        tierLevel: 'TIER_5_SUPERADMIN',
        tierTitle: 'Tier 5: Platform SuperAdmin & Root Operations',
        scopeType: 'GLOBAL',
        customPermissions: 0n,
        combinedMask: ModeratorTierDefaults.TIER_5_SUPERADMIN,
        assignedBy: 'System Genesis Protocol',
        createdAt: '2026-10-13T00:00:00.000Z',
      },
      {
        id: 'mod-asg-02',
        userId: 'user-002',
        userName: 'Mrs. Mbah Eunice Emonena',
        userEmail: 'eunice.mbah@fingermobileprotocol.com',
        avatarUrl: '/assets/branding/eunice_emonena_mbah.webp',
        tierLevel: 'TIER_4_GLOBAL_STAFF',
        tierTitle: 'Tier 4: Global Staff / Platform Marshall',
        scopeType: 'GLOBAL',
        customPermissions: 0n,
        combinedMask: ModeratorTierDefaults.TIER_4_GLOBAL_STAFF,
        assignedBy: 'Mbah Israel Obinna (Founder)',
        createdAt: '2026-10-13T00:00:00.000Z',
      },
      {
        id: 'mod-asg-03',
        userId: 'user-003',
        userName: 'Mercy Kulem',
        userEmail: 'mercykulem11@gmail.com',
        avatarUrl: '/assets/branding/mercy_kulem.webp',
        tierLevel: 'TIER_3_LEAD_MOD',
        tierTitle: 'Tier 3: Lead Community Mod (Guild Master)',
        scopeType: 'COMMUNITY',
        communityId: 'comm-forums-ugc',
        communityName: 'Forum & Lush Pressies Hub',
        customPermissions: 0n,
        combinedMask: ModeratorTierDefaults.TIER_3_LEAD_MOD,
        assignedBy: 'Mbah Israel Obinna (Founder)',
        createdAt: '2026-10-13T00:00:00.000Z',
      },
      {
        id: 'mod-asg-04',
        userId: 'user-004',
        userName: 'Kwame Asante',
        userEmail: 'kwame.asante@fingermobileprotocol.com',
        tierLevel: 'TIER_2_COMMUNITY_WARDEN',
        tierTitle: 'Tier 2: Community Moderator (Channel Warden)',
        scopeType: 'COMMUNITY',
        communityId: 'comm-beatwave',
        communityName: 'BeatwaveNG Hi-Fi SoundRiver',
        customPermissions: 0n,
        combinedMask: ModeratorTierDefaults.TIER_2_COMMUNITY_WARDEN,
        assignedBy: 'Mercy Kulem (Lead Mod)',
        createdAt: '2026-10-13T00:00:00.000Z',
      },
      {
        id: 'mod-asg-05',
        userId: 'user-005',
        userName: 'Chidi Okonkwo',
        userEmail: 'chidi.okonkwo@fingermobileprotocol.com',
        tierLevel: 'TIER_1_ROOM_SENTINEL',
        tierTitle: 'Tier 1: Room / Stream Moderator (Live Sentinel)',
        scopeType: 'ROOM',
        roomId: 'room-dancia-live-01',
        roomName: 'Dancia-4Tv Cinema Sound Clash Live',
        customPermissions: 0n,
        combinedMask: ModeratorTierDefaults.TIER_1_ROOM_SENTINEL,
        assignedBy: 'Kwame Asante (Community Warden)',
        createdAt: '2026-10-13T00:00:00.000Z',
      },
    ];
  }

  private saveLocalModerators(mods: ModeratorAssignment[]): void {
    try {
      const serializable = mods.map((m) => ({
        ...m,
        customPermissions: m.customPermissions.toString(),
        combinedMask: m.combinedMask.toString(),
      }));
      localStorage.setItem(MODS_STORAGE_KEY, JSON.stringify(serializable));
    } catch (_e) {
      // Ignore
    }
  }

  async getModeratorAssignments(): Promise<ModeratorAssignment[]> {
    try {
      const res = await fetch(`${API_BASE}/moderation/assignments`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.assignments) && data.assignments.length > 0) {
          return data.assignments.map((m: any) => ({
            ...m,
            customPermissions: BigInt(m.customPermissions || '0'),
            combinedMask: BigInt(m.combinedMask || '0'),
          }));
        }
      }
    } catch (_e) {
      // Fallback
    }
    return this.getLocalModerators();
  }

  async checkPermission(
    userId: string,
    requiredPerm: bigint,
    communityId?: string,
    roomId?: string
  ): Promise<boolean> {
    const mods = this.getLocalModerators();
    const userAssignments = mods.filter((m) => m.userId === userId);

    if (userAssignments.length === 0) {
      return false;
    }

    let accumulatedMask = 0n;
    for (const asg of userAssignments) {
      // Scope evaluation matching PostgreSQL check_user_permission()
      const scopeMatches =
        asg.scopeType === 'GLOBAL' ||
        (asg.scopeType === 'COMMUNITY' && (!communityId || asg.communityId === communityId)) ||
        (asg.scopeType === 'ROOM' && (!roomId || asg.roomId === roomId));

      if (scopeMatches) {
        if (asg.tierLevel === 'TIER_5_SUPERADMIN') {
          return true;
        }
        accumulatedMask |= asg.combinedMask;
      }
    }

    return hasPermission(accumulatedMask, requiredPerm);
  }

  async assignModerator(payload: {
    userId: string;
    userName: string;
    userEmail: string;
    avatarUrl?: string;
    tierLevel: ModeratorTierLevel;
    scopeType: ModScopeType;
    communityId?: string;
    communityName?: string;
    roomId?: string;
    roomName?: string;
    customPermissions?: bigint;
    assignedBy?: string;
  }): Promise<ModeratorAssignment> {
    const defaultMask = ModeratorTierDefaults[payload.tierLevel];
    const customMask = payload.customPermissions || 0n;
    const combined = defaultMask | customMask;

    const titles: Record<ModeratorTierLevel, string> = {
      TIER_1_ROOM_SENTINEL: 'Tier 1: Room / Stream Moderator (Live Sentinel)',
      TIER_2_COMMUNITY_WARDEN: 'Tier 2: Community Moderator (Channel Warden)',
      TIER_3_LEAD_MOD: 'Tier 3: Lead Community Mod (Guild Master)',
      TIER_4_GLOBAL_STAFF: 'Tier 4: Global Staff / Platform Marshall',
      TIER_5_SUPERADMIN: 'Tier 5: Platform SuperAdmin & Root Operations',
    };

    const newAsg: ModeratorAssignment = {
      id: `mod-asg-${Date.now()}`,
      userId: payload.userId,
      userName: payload.userName,
      userEmail: payload.userEmail,
      avatarUrl: payload.avatarUrl,
      tierLevel: payload.tierLevel,
      tierTitle: titles[payload.tierLevel],
      scopeType: payload.scopeType,
      communityId: payload.communityId,
      communityName: payload.communityName,
      roomId: payload.roomId,
      roomName: payload.roomName,
      customPermissions: customMask,
      combinedMask: combined,
      assignedBy: payload.assignedBy || 'Admin',
      createdAt: new Date().toISOString(),
    };

    const mods = [newAsg, ...this.getLocalModerators()];
    this.saveLocalModerators(mods);
    return newAsg;
  }

  async revokeModerator(assignmentId: string): Promise<void> {
    const mods = this.getLocalModerators().filter((m) => m.id !== assignmentId);
    this.saveLocalModerators(mods);
  }
}

export const rolesPermissionsService = new RolesPermissionsService();
export default rolesPermissionsService;

