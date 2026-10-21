'use strict';

const {
  DEFAULT_SEATS_QUOTA,
  COLLABORATOR_STATUS,
  LOCATION_SCOPE,
} = require('../constants/rolesPermissionsConstants');

// In-memory persistent state store with database synchronization fallback
let seatPlanState = { ...DEFAULT_SEATS_QUOTA };

let collaboratorsState = [
  {
    id: 'usr_981',
    name: 'Marcus Ellery',
    email: 'marcus.ellery@testmail.com',
    avatarUrl: null,
    roles: [{ id: 'role_admin_co_owner', name: 'Admin (Co-Owner)' }],
    status: COLLABORATOR_STATUS.ACTIVE,
    statusDate: '2026-05-06T00:00:00Z',
    locationScope: { type: LOCATION_SCOPE.ALL, locationIds: [] },
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
    status: COLLABORATOR_STATUS.ACTIVE,
    statusDate: '2024-09-08T00:00:00Z',
    locationScope: { type: LOCATION_SCOPE.ALL, locationIds: [] },
  },
  {
    id: 'usr_983',
    name: 'Theo Brannigan',
    email: 'theo.brannigan@fingermobileprotocol.com',
    avatarUrl: null,
    roles: [{ id: 'role_admin_co_owner', name: 'Owner' }],
    status: COLLABORATOR_STATUS.ACTIVE,
    statusDate: '2024-05-12T00:00:00Z',
    locationScope: { type: LOCATION_SCOPE.ALL, locationIds: [] },
  },
  {
    id: 'usr_984',
    name: 'Equipe',
    email: 'equipe@fingermobileprotocol.com',
    avatarUrl: null,
    roles: [{ id: 'role_back_office_manager', name: 'Back Office Manager' }],
    status: COLLABORATOR_STATUS.ACTIVE,
    statusDate: '2024-09-08T00:00:00Z',
    locationScope: {
      type: LOCATION_SCOPE.SPECIFIC,
      locationIds: ['loc_lagos_hq'],
      locationNames: ['Lagos Flagship Office'],
    },
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
    status: COLLABORATOR_STATUS.ACTIVE,
    statusDate: '2025-11-24T00:00:00Z',
    locationScope: { type: LOCATION_SCOPE.ALL, locationIds: [] },
  },
];

class CollaboratorService {
  async getCollaborators({ page = 1, limit = 10, search = '', roleId = '', status = '' }) {
    let filtered = [...collaboratorsState];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    if (status) {
      filtered = filtered.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    if (roleId) {
      filtered = filtered.filter((c) => c.roles.some((r) => r.id === roleId));
    }

    const totalCount = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + Number(limit));

    // Update seat counts
    seatPlanState.usedSeats = collaboratorsState.filter(
      (c) => c.status !== COLLABORATOR_STATUS.SUSPENDED
    ).length;
    seatPlanState.availableSeats = Math.max(0, seatPlanState.totalSeats - seatPlanState.usedSeats);

    return {
      seats: { ...seatPlanState },
      collaborators: paginated,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / limit) || 1,
        totalCount,
      },
    };
  }

  async inviteCollaborator({ email, name, roleIds = [], locationScope = { type: 'ALL' } }) {
    if (!email) {
      throw new Error('Email is required to invite a collaborator');
    }

    if (seatPlanState.availableSeats <= 0) {
      throw new Error('Collaborator seat limit reached. Please upgrade your seat plan.');
    }

    const existing = collaboratorsState.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('A collaborator with this email already exists.');
    }

    const newCollaborator = {
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      email: email.trim().toLowerCase(),
      avatarUrl: null,
      roles: roleIds.map((id) => ({
        id,
        name: id.replace('role_', '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      })),
      status: COLLABORATOR_STATUS.PENDING,
      statusDate: new Date().toISOString(),
      locationScope,
    };

    collaboratorsState.unshift(newCollaborator);
    seatPlanState.usedSeats += 1;
    seatPlanState.availableSeats = seatPlanState.totalSeats - seatPlanState.usedSeats;

    return newCollaborator;
  }

  async updateCollaboratorRoles(id, { roleIds }) {
    const collaborator = collaboratorsState.find((c) => c.id === id);
    if (!collaborator) {
      throw new Error('Collaborator not found');
    }

    collaborator.roles = roleIds.map((rid) => ({
      id: rid,
      name: rid.replace('role_', '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
    collaborator.statusDate = new Date().toISOString();

    return collaborator;
  }

  async updateCollaboratorLocations(id, { type, locationIds = [], locationNames = [] }) {
    const collaborator = collaboratorsState.find((c) => c.id === id);
    if (!collaborator) {
      throw new Error('Collaborator not found');
    }

    collaborator.locationScope = {
      type: type || LOCATION_SCOPE.ALL,
      locationIds,
      locationNames,
    };
    collaborator.statusDate = new Date().toISOString();

    return collaborator;
  }

  async removeCollaborator(id) {
    const index = collaboratorsState.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Collaborator not found');
    }

    collaboratorsState.splice(index, 1);
    seatPlanState.usedSeats = Math.max(0, seatPlanState.usedSeats - 1);
    seatPlanState.availableSeats = seatPlanState.totalSeats - seatPlanState.usedSeats;

    return { success: true, freedSeat: true, availableSeats: seatPlanState.availableSeats };
  }

  async upgradeSeatPlan(newTotalSeats = 20) {
    seatPlanState.totalSeats = Number(newTotalSeats);
    seatPlanState.availableSeats = Math.max(0, seatPlanState.totalSeats - seatPlanState.usedSeats);
    return { ...seatPlanState };
  }
}

module.exports = new CollaboratorService();
