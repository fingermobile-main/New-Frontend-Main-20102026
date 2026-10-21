/**
 * FingerMobile Protocol™ - Member Badges API Service
 * Handles badge design, SVG icons, page access unlock privileges and member assignments.
 * Implements the 10-Tier Gamification Architecture (Onboarding, Core Contribution, Ecosystem Prestige).
 */

import { MemberBadge, MemberBadgeAssignment } from '../types/roles-permissions';

const API_BASE = '/api/v1';
const STORAGE_KEY = 'fingermobile_platform_badges_v1';
const ASSIGNMENTS_STORAGE_KEY = 'fingermobile_badge_assignments_v1';

export const DEFAULT_10_TIER_BADGES: MemberBadge[] = [
  {
    id: 'badge-tier-01',
    tierRank: 1,
    phase: 'ONBOARDING',
    slug: 'newcomer',
    name: 'Newcomer (Seed)',
    functionalRole: 'Baseline Identity',
    unlockCriteria: 'Complete profile registration, avatar upload, and email/SMS verification.',
    privileges: 'Standard posting access; basic rate limits apply to prevent spam.',
    description: 'Verified registered account with validated baseline proof of identity.',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z"/><path d="M12 6v6l4 2"/></svg>',
    bgColor: '#10B981',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_forum', 'page_discover'],
    assignedMembersCount: 4210,
    createdAt: '2026-10-13T00:00:00.000Z',
    updatedAt: '2026-10-13T00:00:00.000Z',
  },
  {
    id: 'badge-tier-02',
    tierRank: 2,
    phase: 'ONBOARDING',
    slug: 'verified_citizen',
    name: 'Verified Citizen (Checkmark)',
    functionalRole: 'Authenticated Identity',
    unlockCriteria: 'Government ID/biometric proof-of-personhood or phone-bound trust tier.',
    privileges: 'Bypasses standard bot captchas; unlocks search discovery and direct messaging.',
    description: 'Authenticated human identity with proof-of-personhood verification.',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-full h-full"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    bgColor: '#3B82F6',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_messages', 'page_marketplace'],
    assignedMembersCount: 1850,
    createdAt: '2026-10-13T00:00:00.000Z',
    updatedAt: '2026-10-13T00:00:00.000Z',
  },
  {
    id: 'badge-tier-03',
    tierRank: 3,
    phase: 'ONBOARDING',
    slug: 'active_contributor',
    name: 'Active Contributor (Spark)',
    functionalRole: 'Consistent Engagement',
    unlockCriteria: '30-day active streak; 50+ constructive comments/posts; low moderation strike count.',
    privileges: 'Mildly boosted comment placement; custom emoji/reaction packs unlocked.',
    description: 'Consistent daily presence with proven engagement quality across communities.',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    bgColor: '#F59E0B',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_groups', 'page_audio_rooms'],
    assignedMembersCount: 940,
    createdAt: '2026-10-13T00:00:00.000Z',
    updatedAt: '2026-10-13T00:00:00.000Z',
  },
  {
    id: 'badge-tier-04',
    tierRank: 4,
    phase: 'CORE_CONTRIBUTION',
    slug: 'rising_creator',
    name: 'Rising Creator (Bronze Beacon)',
    functionalRole: 'Content Milestone',
    unlockCriteria: '1,000+ followers; consistent weekly media output; sustained minimum view completion rate.',
    privileges: 'Early access to creator analytics, audio room hosting, and tip jar features.',
    description: 'Emerging content publisher reaching audience milestones with weekly broadcasts.',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m-7.07-14.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2m-14.93 7.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>',
    bgColor: '#B45309',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_creator_analytics', 'page_tip_jar'],
    assignedMembersCount: 412,
    createdAt: '2026-10-13T00:00:00.000Z',
    updatedAt: '2026-10-13T00:00:00.000Z',
  },
  {
    id: 'badge-tier-05',
    tierRank: 5,
    phase: 'CORE_CONTRIBUTION',
    slug: 'community_pillar',
    name: 'Community Pillar (Silver Keystone)',
    functionalRole: 'High-Trust Anchor',
    unlockCriteria: '6+ months active; top 5% helpfulness score in report accuracy or forum upvotes.',
    privileges: '"Trusted Reporter" status (reports bypass queue to immediate mod review); distinct username accent.',
    description: 'High-trust community anchor with top tier helpfulness rating and vetted reporting accuracy.',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/><path d="M12 8v8m-4-4h8"/></svg>',
    bgColor: '#64748B',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_mod_triage_preview', 'page_hallmarks'],
    assignedMembersCount: 184,
    createdAt: '2026-10-13T00:00:00.000Z',
    updatedAt: '2026-10-13T00:00:00.000Z',
  },
  {
    id: 'badge-tier-06',
    tierRank: 6,
    phase: 'CORE_CONTRIBUTION',
    slug: 'elite_creator',
    name: 'Elite Creator (Gold Crest)',
    functionalRole: 'Proven Broadcaster',
    unlockCriteria: '25,000+ followers; eligible for ad-revenue sharing; verified original media rights.',
    privileges: 'Priority live-stream transcoding, monetization dashboards, and dedicated partner support.',
    description: 'Proven broadcaster with commercial monetization rights and multi-channel reach.',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    bgColor: '#EAB308',
    textColor: '#1E293B',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_dancia4tv_creator', 'page_beatwaveng_stems'],
    assignedMembersCount: 68,
    createdAt: '2026-10-13T00:00:00.000Z',
    updatedAt: '2026-10-13T00:00:00.000Z',
  },
  {
    id: 'badge-tier-07',
    tierRank: 7,
    phase: 'CORE_CONTRIBUTION',
    slug: 'ecosystem_luminary',
    name: 'Ecosystem Luminary (Platinum Star)',
    functionalRole: 'Regional Cultural Anchor',
    unlockCriteria: '100,000+ followers or top-tier regional impact; official brand partnerships verified.',
    privileges: 'Verified VIP badge, custom profile banner animations, direct portal to partner managers.',
    description: 'Regional cultural and media influencer with institutional partner status.',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/><line x1="12" y1="2" x2="12" y2="18"/></svg>',
    bgColor: '#6366F1',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_fingerlux', 'page_canary_vip'],
    assignedMembersCount: 24,
    createdAt: '2026-10-13T00:00:00.000Z',
    updatedAt: '2026-10-13T00:00:00.000Z',
  },
  {
    id: 'badge-tier-08',
    tierRank: 8,
    phase: 'ECOSYSTEM_PRESTIGE',
    slug: 'founding_patron',
    name: 'Founding Patron (Diamond Guild)',
    functionalRole: 'Economic Supporter',
    unlockCriteria: 'High-tier platform subscriber, continuous community backer, or early-access investor.',
    privileges: 'Exclusive badge styling, zero platform ads, private beta feature opt-ins.',
    description: 'High-capital patron and treasury liquidity backer with permanent protocol status.',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="12" y1="3" x2="12" y2="21"/></svg>',
    bgColor: '#06B6D4',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_fic_vault', 'page_beta_portal'],
    assignedMembersCount: 15,
    createdAt: '2026-10-13T00:00:00.000Z',
    updatedAt: '2026-10-13T00:00:00.000Z',
  },
  {
    id: 'badge-tier-09',
    tierRank: 9,
    phase: 'ECOSYSTEM_PRESTIGE',
    slug: 'master_architect',
    name: 'Master Architect (Ruby Vanguard)',
    functionalRole: 'Community Governance',
    unlockCriteria: 'Elected community leader, top open-source contributor, or platform advisory council member.',
    privileges: 'Direct feedback channel to engineering/product teams; highlighted profile presence.',
    description: 'Elected protocol leader and engineering advisory ambassador with governance votes.',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z"/><polyline points="12 12 20 7.5 12 3 4 7.5 12 12"/><line x1="12" y1="12" x2="12" y2="20"/></svg>',
    bgColor: '#E11D48',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_master_governance', 'page_advisory_council'],
    assignedMembersCount: 8,
    createdAt: '2026-10-13T00:00:00.000Z',
    updatedAt: '2026-10-13T00:00:00.000Z',
  },
  {
    id: 'badge-tier-10',
    tierRank: 10,
    phase: 'ECOSYSTEM_PRESTIGE',
    slug: 'apex_legend',
    name: 'Apex Legend (Obsidian Crown)',
    functionalRole: 'Historical Platform Icon',
    unlockCriteria: 'Platform Hall of Fame: sustained multi-year top-tier contribution, major platform pioneer.',
    privileges: 'Globally unique animated profile frame, permanent legacy index, all aesthetic perks unlocked.',
    description: 'Platform Hall of Fame icon and founder-level pioneer with perpetual platform authority.',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><circle cx="12" cy="19" r="2"/></svg>',
    bgColor: '#0F172A',
    textColor: '#F59E0B',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_root_audit', 'page_sovereign_hall_of_fame'],
    assignedMembersCount: 3,
    createdAt: '2026-10-13T00:00:00.000Z',
    updatedAt: '2026-10-13T00:00:00.000Z',
  },
];

const DEFAULT_SAMPLE_ASSIGNMENTS: Record<string, MemberBadgeAssignment[]> = {
  'badge-tier-10': [
    {
      id: 'asg-01',
      badgeId: 'badge-tier-10',
      memberId: 'user-001',
      memberName: 'Mbah Israel Obinna',
      memberEmail: 'fingermobileprotocol@gmail.com',
      assignedAt: '2026-10-13T08:00:00.000Z',
      assignedBy: 'System Genesis Protocol',
      isMuted: false,
    },
  ],
  'badge-tier-09': [
    {
      id: 'asg-02',
      badgeId: 'badge-tier-09',
      memberId: 'user-002',
      memberName: 'Mrs. Mbah Eunice Emonena',
      memberEmail: 'eunice.mbah@fingermobileprotocol.com',
      assignedAt: '2026-10-13T08:00:00.000Z',
      assignedBy: 'Mbah Israel Obinna (Founder)',
      isMuted: false,
    },
    {
      id: 'asg-03',
      badgeId: 'badge-tier-09',
      memberId: 'user-003',
      memberName: 'Mercy Kulem',
      memberEmail: 'mercykulem11@gmail.com',
      assignedAt: '2026-10-13T08:30:00.000Z',
      assignedBy: 'Mbah Israel Obinna (Founder)',
      isMuted: false,
    },
  ],
  'badge-tier-05': [
    {
      id: 'asg-04',
      badgeId: 'badge-tier-05',
      memberId: 'user-004',
      memberName: 'Kwame Asante',
      memberEmail: 'kwame.asante@fingermobileprotocol.com',
      assignedAt: '2026-10-13T09:00:00.000Z',
      assignedBy: 'Community Council',
      isMuted: false,
    },
  ],
  'badge-tier-03': [
    {
      id: 'asg-05',
      badgeId: 'badge-tier-03',
      memberId: 'user-005',
      memberName: 'Chidi Okonkwo',
      memberEmail: 'chidi.okonkwo@fingermobileprotocol.com',
      assignedAt: '2026-10-13T09:15:00.000Z',
      assignedBy: 'Automated Streak Worker',
      isMuted: false,
    },
  ],
};

class BadgeService {
  private getLocalBadges(): MemberBadge[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_e) {
      // Ignore
    }
    return DEFAULT_10_TIER_BADGES;
  }

  private saveLocalBadges(badges: MemberBadge[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
    } catch (_e) {
      // Ignore
    }
  }

  private getLocalAssignments(): Record<string, MemberBadgeAssignment[]> {
    try {
      const stored = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_e) {
      // Ignore
    }
    return DEFAULT_SAMPLE_ASSIGNMENTS;
  }

  private saveLocalAssignments(assignments: Record<string, MemberBadgeAssignment[]>): void {
    try {
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
    } catch (_e) {
      // Ignore
    }
  }

  async getBadges(search = ''): Promise<MemberBadge[]> {
    try {
      const res = await fetch(`${API_BASE}/badges?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.badges) && data.badges.length > 0) {
          return data.badges;
        }
      }
    } catch (_e) {
      // Network/offline fallback
    }

    const local = this.getLocalBadges();
    if (!search.trim()) return local;

    const term = search.toLowerCase();
    return local.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term) ||
        (b.functionalRole && b.functionalRole.toLowerCase().includes(term))
    );
  }

  async getBadgeById(id: string): Promise<MemberBadge> {
    try {
      const res = await fetch(`${API_BASE}/badges/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.badge;
      }
    } catch (_e) {
      // Fallback
    }

    const badge = this.getLocalBadges().find((b) => b.id === id);
    if (!badge) {
      throw new Error(`Badge '${id}' not found`);
    }
    return badge;
  }

  async createBadge(payload: {
    name: string;
    description: string;
    iconSvg?: string;
    iconUrl?: string;
    bgColor?: string;
    textColor?: string;
    badgeAccessEnabled?: boolean;
    accessiblePageIds?: string[];
    tierRank?: any;
    phase?: any;
  }): Promise<{ success: boolean; badge: MemberBadge }> {
    try {
      const res = await fetch(`${API_BASE}/badges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (_e) {
      // Fallback
    }

    const newBadge: MemberBadge = {
      id: `badge-custom-${Date.now()}`,
      tierRank: payload.tierRank || 3,
      phase: payload.phase || 'CORE_CONTRIBUTION',
      slug: payload.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: payload.name,
      description: payload.description,
      iconSvg: payload.iconSvg,
      iconUrl: payload.iconUrl,
      bgColor: payload.bgColor || '#F59E0B',
      textColor: payload.textColor || '#FFFFFF',
      badgeAccessEnabled: payload.badgeAccessEnabled ?? true,
      accessiblePageIds: payload.accessiblePageIds || [],
      assignedMembersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const badges = [newBadge, ...this.getLocalBadges()];
    this.saveLocalBadges(badges);
    return { success: true, badge: newBadge };
  }

  async updateBadge(
    id: string,
    payload: Partial<MemberBadge>
  ): Promise<{ success: boolean; badge: MemberBadge }> {
    try {
      const res = await fetch(`${API_BASE}/badges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      // Fallback
    }

    const badges = this.getLocalBadges();
    const idx = badges.findIndex((b) => b.id === id);
    if (idx === -1) {
      throw new Error(`Badge '${id}' not found`);
    }

    const updated = {
      ...badges[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    badges[idx] = updated;
    this.saveLocalBadges(badges);

    return { success: true, badge: updated };
  }

  async deleteBadge(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/badges/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      // Fallback
    }

    const badges = this.getLocalBadges().filter((b) => b.id !== id);
    this.saveLocalBadges(badges);
    return { success: true };
  }

  async assignBadge(
    badgeId: string,
    members: Array<{ id: string; name: string; email?: string }>,
    assignedBy = 'Admin'
  ): Promise<{ success: boolean; assignedCount: number; badge: MemberBadge }> {
    try {
      const res = await fetch(`${API_BASE}/badges/${badgeId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members, assignedBy }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      // Fallback
    }

    const assignments = this.getLocalAssignments();
    const existing = assignments[badgeId] || [];

    const newAssignments: MemberBadgeAssignment[] = members.map((m) => ({
      id: `asg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      badgeId,
      memberId: m.id,
      memberName: m.name,
      memberEmail: m.email,
      assignedAt: new Date().toISOString(),
      assignedBy,
      isMuted: false,
    }));

    assignments[badgeId] = [...existing, ...newAssignments];
    this.saveLocalAssignments(assignments);

    // Update count in badge
    const badges = this.getLocalBadges();
    const bIdx = badges.findIndex((b) => b.id === badgeId);
    let targetBadge = badges[bIdx];
    if (bIdx !== -1) {
      targetBadge = {
        ...badges[bIdx],
        assignedMembersCount: assignments[badgeId].length,
      };
      badges[bIdx] = targetBadge;
      this.saveLocalBadges(badges);
    }

    return {
      success: true,
      assignedCount: members.length,
      badge: targetBadge,
    };
  }

  async unassignBadge(badgeId: string, memberId: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/badges/${badgeId}/unassign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      // Fallback
    }

    const assignments = this.getLocalAssignments();
    if (assignments[badgeId]) {
      assignments[badgeId] = assignments[badgeId].filter((a) => a.memberId !== memberId);
      this.saveLocalAssignments(assignments);

      const badges = this.getLocalBadges();
      const bIdx = badges.findIndex((b) => b.id === badgeId);
      if (bIdx !== -1) {
        badges[bIdx].assignedMembersCount = assignments[badgeId].length;
        this.saveLocalBadges(badges);
      }
    }

    return { success: true };
  }

  async getBadgeMembers(badgeId: string): Promise<MemberBadgeAssignment[]> {
    try {
      const res = await fetch(`${API_BASE}/badges/${badgeId}/members`);
      if (res.ok) {
        const data = await res.json();
        return data.members;
      }
    } catch (_e) {
      // Fallback
    }

    const assignments = this.getLocalAssignments();
    return assignments[badgeId] || [];
  }

  async toggleMuteMember(
    badgeId: string,
    memberId: string
  ): Promise<{ success: boolean; assignment: MemberBadgeAssignment }> {
    try {
      const res = await fetch(`${API_BASE}/badges/${badgeId}/members/${memberId}/mute`, {
        method: 'PATCH',
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_e) {
      // Fallback
    }

    const assignments = this.getLocalAssignments();
    if (!assignments[badgeId]) {
      throw new Error('Badge assignments not found');
    }

    const idx = assignments[badgeId].findIndex((a) => a.memberId === memberId);
    if (idx === -1) {
      throw new Error('Member assignment not found');
    }

    assignments[badgeId][idx].isMuted = !assignments[badgeId][idx].isMuted;
    this.saveLocalAssignments(assignments);

    return {
      success: true,
      assignment: assignments[badgeId][idx],
    };
  }
}

export const badgeService = new BadgeService();
export default badgeService;
