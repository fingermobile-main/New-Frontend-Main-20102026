'use strict';

const {
  ROLE_CATEGORIES,
  SYSTEM_DEFAULT_ROLES,
} = require('../constants/rolesPermissionsConstants');

let customRolesState = [
  ...SYSTEM_DEFAULT_ROLES.map((r) => ({
    ...r,
    permissions: [
      'site.edit',
      'site.publish',
      'billing.manage',
      'collaborators.invite',
    ],
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  })),
];

const ALL_PERMISSION_NODES = [
  { id: 'perm_site_edit', code: 'site.edit', name: 'Edit Site Content', module: 'SITE', category: 'GENERAL', description: 'Can edit text, layouts and media on site' },
  { id: 'perm_site_publish', code: 'site.publish', name: 'Publish Site', module: 'SITE', category: 'GENERAL', description: 'Can push live updates to the production web experience' },
  { id: 'perm_billing_manage', code: 'billing.manage', name: 'Manage Billing & Subscriptions', module: 'BILLING', category: 'BILLING', description: 'Can manage subscriptions, invoices, and payment methods' },
  { id: 'perm_collaborators_invite', code: 'collaborators.invite', name: 'Invite Collaborators', module: 'SETTINGS', category: 'GENERAL', description: 'Can invite staff and assign collaborator permissions' },
  { id: 'perm_roles_manage', code: 'roles.manage', name: 'Manage Roles', module: 'SETTINGS', category: 'GENERAL', description: 'Can create and modify custom access roles' },
  { id: 'perm_cms_view', code: 'cms.content.view', name: 'View CMS Collections', module: 'CMS', category: 'CMS', description: 'Can read and search collection records' },
  { id: 'perm_cms_edit', code: 'cms.content.edit', name: 'Edit CMS Items', module: 'CMS', category: 'CMS', description: 'Can modify and delete records in CMS collections' },
  { id: 'perm_cms_structure', code: 'cms.structure.edit', name: 'Edit Field Schema', module: 'CMS', category: 'CMS', description: 'Can add fields and restructure collections' },
  { id: 'perm_store_manage', code: 'store.catalog.manage', name: 'Manage Store Catalog', module: 'STORE', category: 'STORES', description: 'Can add, update and remove merchandise and inventory' },
  { id: 'perm_pos_checkout', code: 'pos.sales.checkout', name: 'POS Cashier Checkout', module: 'POS', category: 'POS', description: 'Can execute in-person terminal checkouts' },
  { id: 'perm_blog_publish', code: 'blog.posts.publish', name: 'Publish Blog Articles', module: 'BLOG', category: 'BLOG', description: 'Can approve and publish blog stories' },
  { id: 'perm_bookings_manage', code: 'bookings.calendar.manage', name: 'Manage Booking Calendar', module: 'BOOKINGS', category: 'BOOKINGS', description: 'Can view, reschedule and cancel appointments' },
  { id: 'perm_events_checkin', code: 'events.tickets.checkin', name: 'Scan Tickets & Guest Check-In', module: 'EVENTS', category: 'EVENTS', description: 'Can check in attendees and validate entry tickets' },
  { id: 'perm_payments_admin', code: 'payments.provider.admin', name: 'Payments Admin', module: 'PAYMENTS', category: 'PAYMENTS', description: 'Full financial integration and bank account connection' },
  { id: 'perm_stream_broadcast', code: 'stream.broadcast', name: 'Live WebRTC Broadcast', module: 'MEDIA', category: 'GENERAL', description: 'Can initiate live video streams and broadcast channels' },
  { id: 'perm_chat_moderate', code: 'chat.moderate', name: 'Moderate Chat & Forum', module: 'COMMUNITY', category: 'GENERAL', description: 'Can delete messages and mute users' },
  { id: 'perm_restaurant_menus', code: 'restaurant.menus.manage', name: 'Manage Restaurant Menus', module: 'RESTAURANT', category: 'RESTAURANTS', description: 'Can configure table reservations and restaurant menus' },
];

class RolePermissionService {
  async getAllRoles({ category = '', search = '' } = {}) {
    let list = [...customRolesState];

    if (category) {
      list = list.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    // Grouping by category
    const grouped = {
      CUSTOM: list.filter((r) => r.category === ROLE_CATEGORIES.CUSTOM),
      GENERAL: list.filter((r) => r.category === ROLE_CATEGORIES.GENERAL),
      CMS: list.filter((r) => r.category === ROLE_CATEGORIES.CMS),
      BILLING: list.filter((r) => r.category === ROLE_CATEGORIES.BILLING),
      MARKETING: list.filter((r) => r.category === ROLE_CATEGORIES.MARKETING),
      STORES: list.filter((r) => r.category === ROLE_CATEGORIES.STORES),
      POS: list.filter((r) => r.category === ROLE_CATEGORIES.POS),
      BLOG: list.filter((r) => r.category === ROLE_CATEGORIES.BLOG),
      BOOKINGS: list.filter((r) => r.category === ROLE_CATEGORIES.BOOKINGS),
      EVENTS: list.filter((r) => r.category === ROLE_CATEGORIES.EVENTS),
      PAYMENTS: list.filter((r) => r.category === ROLE_CATEGORIES.PAYMENTS),
      RESTAURANTS: list.filter((r) => r.category === ROLE_CATEGORIES.RESTAURANTS),
    };

    return {
      roles: list,
      grouped,
      totalCount: list.length,
    };
  }

  async getRoleById(id) {
    const role = customRolesState.find((r) => r.id === id || r.slug === id);
    if (!role) {
      throw new Error(`Role not found: ${id}`);
    }
    return role;
  }

  async createCustomRole({ name, description, category = 'CUSTOM', permissions = [] }) {
    if (!name) {
      throw new Error('Role name is required');
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const existing = customRolesState.find((r) => r.slug === slug);
    if (existing) {
      throw new Error('A role with this name already exists');
    }

    const newRole = {
      id: `role_${Date.now()}`,
      slug,
      name,
      description: description || 'Custom role created by administrator',
      category: category.toUpperCase(),
      isSystemDefault: false,
      assignedUsersCount: 0,
      permissions: permissions.length > 0 ? permissions : ['site.edit'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    customRolesState.unshift(newRole);
    return newRole;
  }

  async updateRole(id, { name, description, permissions }) {
    const role = customRolesState.find((r) => r.id === id || r.slug === id);
    if (!role) {
      throw new Error('Role not found');
    }

    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    if (permissions) role.permissions = permissions;
    role.updatedAt = new Date().toISOString();

    return role;
  }

  async deleteRole(id) {
    const index = customRolesState.findIndex((r) => r.id === id || r.slug === id);
    if (index === -1) {
      throw new Error('Role not found');
    }

    if (customRolesState[index].isSystemDefault) {
      throw new Error('Cannot delete built-in system default role');
    }

    const [deleted] = customRolesState.splice(index, 1);
    return { success: true, deletedRoleId: deleted.id };
  }

  async getAllPermissions() {
    return ALL_PERMISSION_NODES;
  }
}

module.exports = new RolePermissionService();
