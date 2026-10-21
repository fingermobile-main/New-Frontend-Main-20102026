'use strict';

let memberPagesState = [
  { id: 'page_01', slug: 'masterclass-vault', title: 'Executive Masterclass Vault', path: '/courses/masterclass-vault', isRestricted: true, description: 'Exclusive high-yield training videos and blueprints', allowedRoleIds: ['mem_role_teacher', 'mem_role_child', 'mem_role_vip', 'mem_role_subscriber'] },
  { id: 'page_02', slug: 'vip-lounge', title: 'FingerLux VIP Lounge', path: '/vip-lounge', isRestricted: true, description: 'Private high-net-worth discussion and live concierge', allowedRoleIds: ['mem_role_vip'] },
  { id: 'page_03', slug: 'alpha-forum', title: 'Private Alpha Community Board', path: '/forum/private-alpha', isRestricted: true, description: 'Unlisted trading insights and insider discussions', allowedRoleIds: ['mem_role_vip'] },
  { id: 'page_04', slug: 'resource-hub', title: 'Developer & Creator Resource Hub', path: '/creators/resources', isRestricted: true, description: 'Premium 3D models, stems, vector packs and SDKs', allowedRoleIds: ['mem_role_teacher', 'mem_role_vip', 'mem_role_subscriber'] },
  { id: 'page_05', slug: 'webinar-live', title: 'Exclusive Live Stream Broadcasts', path: '/webinars/exclusive', isRestricted: true, description: 'Direct private streams with platform leadership', allowedRoleIds: ['mem_role_teacher', 'mem_role_vip'] },
  { id: 'page_06', slug: 'mentorship-chat', title: 'Direct Mentorship Chat Room', path: '/mentorship/chat', isRestricted: true, description: '1-on-1 private channels with verified coaches', allowedRoleIds: ['mem_role_teacher'] },
  { id: 'page_07', slug: 'deals-vault', title: 'Private Partner Discounts & Deals', path: '/deals/vault', isRestricted: true, description: 'Tiered coupon and wholesale pricing agreements', allowedRoleIds: ['mem_role_vip', 'mem_role_subscriber'] },
  { id: 'page_08', slug: 'governance-voting', title: 'Council Voting Chamber', path: '/governance/council', isRestricted: true, description: 'Ballots and community treasury allocations', allowedRoleIds: ['mem_role_teacher'] },
  { id: 'page_09', slug: 'audio-stems', title: 'Beatwave Studio Stems Archive', path: '/beatwave/stems-archive', isRestricted: true, description: 'Lossless multi-track stems for remixing', allowedRoleIds: ['mem_role_vip'] },
  { id: 'page_10', slug: 'exclusive-drops', title: 'Flamingo & OwnIt Premier Drops', path: '/exclusive/drops', isRestricted: true, description: 'Limited-run luxury item reservations', allowedRoleIds: ['mem_role_vip'] },
];

let memberRolesState = [
  {
    id: 'mem_role_teacher',
    name: 'Teacher',
    description: 'Verified educators and seminar creators',
    assignedMembersCount: 1,
    accessiblePagesCount: 5,
    accessiblePageIds: ['page_01', 'page_04', 'page_05', 'page_06', 'page_08'],
    createdAt: '2024-10-30T00:00:00Z',
  },
  {
    id: 'mem_role_child',
    name: 'Child',
    description: 'Restricted junior account with filtered access',
    assignedMembersCount: 0,
    accessiblePagesCount: 1,
    accessiblePageIds: ['page_01'],
    createdAt: '2024-09-17T00:00:00Z',
  },
  {
    id: 'mem_role_vip',
    name: 'VIP Member',
    description: 'Premium subscriber tier unlocking concierge & drops',
    assignedMembersCount: 28,
    accessiblePagesCount: 8,
    accessiblePageIds: ['page_01', 'page_02', 'page_03', 'page_04', 'page_05', 'page_07', 'page_09', 'page_10'],
    createdAt: '2024-08-11T00:00:00Z',
  },
  {
    id: 'mem_role_subscriber',
    name: 'Subscriber',
    description: 'Standard authenticated member tier',
    assignedMembersCount: 142,
    accessiblePagesCount: 3,
    accessiblePageIds: ['page_01', 'page_04', 'page_07'],
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'mem_role_moderator',
    name: 'Course Moderator',
    description: 'Community discussion monitors',
    assignedMembersCount: 4,
    accessiblePagesCount: 6,
    accessiblePageIds: ['page_01', 'page_03', 'page_04', 'page_05', 'page_06', 'page_08'],
    createdAt: '2024-11-05T00:00:00Z',
  },
];

class MemberAccessService {
  async getOverview() {
    return {
      totalMemberPages: memberPagesState.length,
      totalMemberRoles: memberRolesState.length,
      memberRoles: memberRolesState,
      memberPages: memberPagesState,
    };
  }

  async getMemberRoles({ search = '' } = {}) {
    let list = [...memberRolesState];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q)));
    }
    return list;
  }

  async createMemberRole({ name, description, accessiblePageIds = [] }) {
    if (!name) {
      throw new Error('Role name is required');
    }

    const existing = memberRolesState.find((r) => r.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      throw new Error('A member role with this name already exists');
    }

    const newRole = {
      id: `mem_role_${Date.now()}`,
      name: name.trim(),
      description: description || '',
      assignedMembersCount: 0,
      accessiblePagesCount: accessiblePageIds.length,
      accessiblePageIds,
      createdAt: new Date().toISOString(),
    };

    memberRolesState.unshift(newRole);

    // Update member pages junction
    accessiblePageIds.forEach((pageId) => {
      const page = memberPagesState.find((p) => p.id === pageId);
      if (page && !page.allowedRoleIds.includes(newRole.id)) {
        page.allowedRoleIds.push(newRole.id);
      }
    });

    return newRole;
  }

  async updateMemberRole(id, { name, description, accessiblePageIds }) {
    const role = memberRolesState.find((r) => r.id === id);
    if (!role) {
      throw new Error('Member role not found');
    }

    if (name) role.name = name.trim();
    if (description !== undefined) role.description = description;

    if (accessiblePageIds) {
      role.accessiblePageIds = accessiblePageIds;
      role.accessiblePagesCount = accessiblePageIds.length;

      // Sync pages
      memberPagesState.forEach((page) => {
        if (accessiblePageIds.includes(page.id)) {
          if (!page.allowedRoleIds.includes(role.id)) {
            page.allowedRoleIds.push(role.id);
          }
        } else {
          page.allowedRoleIds = page.allowedRoleIds.filter((rid) => rid !== role.id);
        }
      });
    }

    return role;
  }

  async deleteMemberRole(id) {
    const index = memberRolesState.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Member role not found');
    }

    const [deleted] = memberRolesState.splice(index, 1);

    // Remove from pages
    memberPagesState.forEach((page) => {
      page.allowedRoleIds = page.allowedRoleIds.filter((rid) => rid !== id);
    });

    return { success: true, deletedRoleId: deleted.id };
  }

  async getMemberPages() {
    return memberPagesState;
  }

  async updatePagePermissions(pageId, { allowedRoleIds }) {
    const page = memberPagesState.find((p) => p.id === pageId || p.slug === pageId);
    if (!page) {
      throw new Error('Member page not found');
    }

    page.allowedRoleIds = allowedRoleIds;

    // Recalculate accessible page counts for roles
    memberRolesState.forEach((r) => {
      if (allowedRoleIds.includes(r.id)) {
        if (!r.accessiblePageIds.includes(page.id)) {
          r.accessiblePageIds.push(page.id);
        }
      } else {
        r.accessiblePageIds = r.accessiblePageIds.filter((pid) => pid !== page.id);
      }
      r.accessiblePagesCount = r.accessiblePageIds.length;
    });

    return page;
  }
}

module.exports = new MemberAccessService();
