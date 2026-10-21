'use strict';

let badgesState = [
  {
    id: 'badge_superstar',
    name: 'Certified Superstar',
    description: 'Recognizes top contributing members across all platforms with verified excellence',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    iconUrl: null,
    bgColor: '#2563EB',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_02', 'page_05'],
    assignedMembersCount: 12,
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'badge_coach',
    name: 'Coach',
    description: 'Recognized expert answering questions and mentoring community members in forum & groups',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    iconUrl: null,
    bgColor: '#059669',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_01', 'page_06'],
    assignedMembersCount: 8,
    createdAt: '2024-07-20T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'badge_organizer',
    name: 'Organizer',
    description: 'Community and group leads driving interactive meetups, streams and events',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    iconUrl: null,
    bgColor: '#D97706',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_05', 'page_08'],
    assignedMembersCount: 5,
    createdAt: '2024-08-14T00:00:00Z',
    updatedAt: '2026-07-12T00:00:00Z',
  },
  {
    id: 'badge_hall_of_fame',
    name: 'Hall of Fame',
    description: 'Legendary contributors with permanent lifetime achievement credentials and exclusive access',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
    iconUrl: null,
    bgColor: '#7C3AED',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_02', 'page_03'],
    assignedMembersCount: 3,
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'badge_verified_creator',
    name: 'Verified Creator',
    description: 'Original creator with verified intellectual property and commercial catalog on Storefronts & Flamingo',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>',
    iconUrl: null,
    bgColor: '#0284C7',
    textColor: '#FFFFFF',
    badgeAccessEnabled: true,
    accessiblePageIds: ['page_04', 'page_10'],
    assignedMembersCount: 45,
    createdAt: '2024-05-18T00:00:00Z',
    updatedAt: '2026-09-15T00:00:00Z',
  },
];

let badgeAssignmentsState = [
  { id: 'asgn_1', badgeId: 'badge_superstar', memberId: 'mem_101', memberName: 'Adaobi Okonjo', memberEmail: 'adaobi@fingermobileprotocol.com', assignedAt: '2026-01-10T10:00:00Z', isMuted: false },
  { id: 'asgn_2', badgeId: 'badge_superstar', memberId: 'mem_102', memberName: 'Chidi Amadi', memberEmail: 'chidi@fingermobileprotocol.com', assignedAt: '2026-02-12T14:30:00Z', isMuted: false },
  { id: 'asgn_3', badgeId: 'badge_coach', memberId: 'mem_103', memberName: 'Kelechi Nwosu', memberEmail: 'kelechi@fingermobileprotocol.com', assignedAt: '2026-03-01T09:15:00Z', isMuted: false },
  { id: 'asgn_4', badgeId: 'badge_organizer', memberId: 'mem_104', memberName: 'Zainab Balogun', memberEmail: 'zainab@fingermobileprotocol.com', assignedAt: '2026-03-14T11:20:00Z', isMuted: false },
  { id: 'asgn_5', badgeId: 'badge_hall_of_fame', memberId: 'mem_105', memberName: 'Tunde Adeleke', memberEmail: 'tunde@fingermobileprotocol.com', assignedAt: '2026-04-05T16:45:00Z', isMuted: false },
];

class BadgeService {
  async getBadges({ search = '' } = {}) {
    let list = [...badgesState];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
    }
    return list;
  }

  async getBadgeById(id) {
    const badge = badgesState.find((b) => b.id === id);
    if (!badge) {
      throw new Error(`Badge not found: ${id}`);
    }
    return badge;
  }

  async createBadge({ name, description, iconSvg, iconUrl, bgColor = '#1E293B', textColor = '#FFFFFF', badgeAccessEnabled = false, accessiblePageIds = [] }) {
    if (!name) {
      throw new Error('Badge name is required');
    }

    const newBadge = {
      id: `badge_${Date.now()}`,
      name: name.trim(),
      description: description || 'Member milestone badge',
      iconSvg: iconSvg || '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
      iconUrl: iconUrl || null,
      bgColor,
      textColor,
      badgeAccessEnabled: Boolean(badgeAccessEnabled),
      accessiblePageIds,
      assignedMembersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    badgesState.unshift(newBadge);
    return newBadge;
  }

  async updateBadge(id, updateData) {
    const badge = badgesState.find((b) => b.id === id);
    if (!badge) {
      throw new Error('Badge not found');
    }

    if (updateData.name) badge.name = updateData.name.trim();
    if (updateData.description !== undefined) badge.description = updateData.description;
    if (updateData.iconSvg !== undefined) badge.iconSvg = updateData.iconSvg;
    if (updateData.iconUrl !== undefined) badge.iconUrl = updateData.iconUrl;
    if (updateData.bgColor) badge.bgColor = updateData.bgColor;
    if (updateData.textColor) badge.textColor = updateData.textColor;
    if (updateData.badgeAccessEnabled !== undefined) badge.badgeAccessEnabled = updateData.badgeAccessEnabled;
    if (updateData.accessiblePageIds !== undefined) badge.accessiblePageIds = updateData.accessiblePageIds;
    badge.updatedAt = new Date().toISOString();

    return badge;
  }

  async deleteBadge(id) {
    const index = badgesState.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error('Badge not found');
    }

    const [deleted] = badgesState.splice(index, 1);
    badgeAssignmentsState = badgeAssignmentsState.filter((a) => a.badgeId !== id);

    return { success: true, deletedBadgeId: deleted.id };
  }

  async assignBadge(badgeId, { members, assignedBy = 'Admin' }) {
    const badge = badgesState.find((b) => b.id === badgeId);
    if (!badge) {
      throw new Error('Badge not found');
    }

    if (!Array.isArray(members) || members.length === 0) {
      throw new Error('Please select at least one member to assign');
    }

    const assigned = [];
    members.forEach((m) => {
      const alreadyHas = badgeAssignmentsState.some((a) => a.badgeId === badgeId && a.memberId === m.id);
      if (!alreadyHas) {
        const item = {
          id: `asgn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          badgeId,
          memberId: m.id,
          memberName: m.name || 'Member',
          memberEmail: m.email || '',
          assignedAt: new Date().toISOString(),
          assignedBy,
          isMuted: false,
        };
        badgeAssignmentsState.push(item);
        assigned.push(item);
      }
    });

    badge.assignedMembersCount = badgeAssignmentsState.filter((a) => a.badgeId === badgeId).length;

    return { success: true, assignedCount: assigned.length, badge };
  }

  async unassignBadge(badgeId, memberId) {
    const badge = badgesState.find((b) => b.id === badgeId);
    if (!badge) {
      throw new Error('Badge not found');
    }

    badgeAssignmentsState = badgeAssignmentsState.filter(
      (a) => !(a.badgeId === badgeId && a.memberId === memberId)
    );

    badge.assignedMembersCount = badgeAssignmentsState.filter((a) => a.badgeId === badgeId).length;

    return { success: true, remainingCount: badge.assignedMembersCount };
  }

  async getBadgeMembers(badgeId) {
    return badgeAssignmentsState.filter((a) => a.badgeId === badgeId);
  }

  async toggleMuteMember(badgeId, memberId) {
    const target = badgeAssignmentsState.find((a) => a.badgeId === badgeId && a.memberId === memberId);
    if (!target) {
      throw new Error('Assignment not found');
    }
    target.isMuted = !target.isMuted;
    return target;
  }
}

module.exports = new BadgeService();
