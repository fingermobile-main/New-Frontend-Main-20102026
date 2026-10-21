/**
 * FingerMobile Protocol™ - Enterprise Roles, Permissions, Badges & Member Access Types
 * Conforms to specification in Roles permission and Badges 11092026.md
 */

export type CollaboratorStatus = 'Active' | 'Pending' | 'Suspended';
export type LocationScopeType = 'ALL' | 'SPECIFIC';
export type RoleCategory =
  | 'GENERAL'
  | 'CMS'
  | 'BILLING'
  | 'CUSTOM'
  | 'MARKETING'
  | 'STORES'
  | 'POS'
  | 'BLOG'
  | 'BOOKINGS'
  | 'EVENTS'
  | 'PAYMENTS'
  | 'RESTAURANTS';

// --------------------------------------------------
// Collaborators & Staff Access
// --------------------------------------------------

export interface LocationScope {
  type: LocationScopeType;
  locationIds?: string[];
  locationNames?: string[];
}

export interface RoleSummary {
  id: string;
  name: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  roles: RoleSummary[];
  status: CollaboratorStatus;
  statusDate: string; // ISO 8601
  locationScope: LocationScope;
}

export interface CollaboratorSeatPlan {
  totalSeats: number;
  usedSeats: number;
  availableSeats: number;
  canUpgrade: boolean;
  planName?: string;
}

// --------------------------------------------------
// Roles & Permissions System
// --------------------------------------------------

export interface Permission {
  id: string;
  code: string; // e.g. "cms.content.publish", "billing.manage"
  name: string;
  category: string;
  module: string;
  description?: string;
}

export interface RoleDetail {
  id: string;
  slug?: string;
  name: string;
  description: string;
  category: RoleCategory;
  isSystemDefault: boolean;
  assignedUsersCount: number;
  permissions: string[]; // Permission codes or IDs
  createdAt: string;
  updatedAt: string;
}

// --------------------------------------------------
// Site Member Access (Client/End-User Portal)
// --------------------------------------------------

export interface MemberPage {
  id: string;
  slug?: string;
  title: string;
  path: string;
  isRestricted: boolean;
  description?: string;
  allowedRoleIds?: string[];
  requiredSubscriptionTier?: string;
  gatedCategory?: string;
  monthlyFIC?: number;
}

export interface MemberRole {
  id: string;
  name: string;
  description?: string;
  assignedMembersCount: number;
  accessiblePagesCount: number;
  accessiblePageIds: string[];
  createdAt: string;
  subscriptionPlanId?: string;
  subscriptionPlanName?: string;
  monthlyFIC?: number;
  monthlyNaira?: number;
}

export interface SiteMemberAccessOverview {
  totalMemberPages: number;
  totalMemberRoles: number;
  memberRoles: MemberRole[];
  memberPages: MemberPage[];
}

// --------------------------------------------------
// Member Badges System (10-Tier Gamification Architecture)
// --------------------------------------------------

export type BadgeTierRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type BadgePhase = 'ONBOARDING' | 'CORE_CONTRIBUTION' | 'ECOSYSTEM_PRESTIGE';

export interface MemberBadge {
  id: string;
  tierRank?: BadgeTierRank;
  phase?: BadgePhase;
  slug?: string;
  name: string;
  functionalRole?: string;
  unlockCriteria?: string;
  privileges?: string;
  description: string;
  iconSvg?: string;
  iconUrl?: string | null;
  bgColor: string;
  textColor: string;
  badgeAccessEnabled: boolean;
  accessiblePageIds: string[];
  assignedMembersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MemberBadgeAssignment {
  id: string;
  badgeId: string;
  memberId: string;
  memberName: string;
  memberEmail?: string;
  assignedAt: string;
  assignedBy?: string;
  isMuted?: boolean;
}

// --------------------------------------------------
// 5 Moderator Tiers & 64-Bit Bitmask RBAC System
// --------------------------------------------------

export type ModeratorTierLevel =
  | 'TIER_1_ROOM_SENTINEL'
  | 'TIER_2_COMMUNITY_WARDEN'
  | 'TIER_3_LEAD_MOD'
  | 'TIER_4_GLOBAL_STAFF'
  | 'TIER_5_SUPERADMIN';

export type ModScopeType = 'ROOM' | 'COMMUNITY' | 'GLOBAL';

export const Permissions = {
  // --- Ephemeral / Room Level (Bits 0 - 7) ---
  DELETE_ROOM_MESSAGE: 1n << 0n, // 0x01
  TIMEOUT_ROOM_USER: 1n << 1n, // 0x02
  TOGGLE_SLOW_MODE: 1n << 2n, // 0x04
  KICK_ROOM_USER: 1n << 3n, // 0x08

  // --- Community / Channel Level (Bits 8 - 19) ---
  DELETE_COMMUNITY_POST: 1n << 8n, // 0x0100
  LOCK_COMMENTS: 1n << 9n, // 0x0200
  PIN_COMMUNITY_POST: 1n << 10n, // 0x0400
  MUTE_COMMUNITY_USER: 1n << 11n, // 0x0800
  TRIAGE_LOCAL_REPORTS: 1n << 12n, // 0x1000
  MANAGE_LOCAL_MODS: 1n << 13n, // 0x2000
  CONFIGURE_AUTOMOD_RULES: 1n << 14n, // 0x4000
  PERM_BAN_COMMUNITY: 1n << 15n, // 0x8000

  // --- Global / Network Level (Bits 20 - 31) ---
  VIEW_AUDIT_LOGS: 1n << 20n, // 0x100000
  GLOBAL_TIMEOUT_USER: 1n << 21n, // 0x200000
  SHADOWBAN_USER: 1n << 22n, // 0x400000
  OVERRIDE_LOCAL_MOD: 1n << 23n, // 0x800000
  ACCESS_DEVICE_SIGNATURES: 1n << 24n, // 0x1000000
  UPDATE_GLOBAL_AUTOMOD: 1n << 25n, // 0x2000000

  // --- SuperAdmin / System Level (Bits 32 - 40) ---
  PERM_BAN_PLATFORM: 1n << 32n, // 0x100000000
  EXPORT_LEGAL_COMPLIANCE: 1n << 33n, // 0x200000000
  MANAGE_SYSTEM_RBAC: 1n << 34n, // 0x400000000
  ALL_PERMISSIONS: 0x7fffffffffffffffn,
} as const;

export const ModeratorTierDefaults: Record<ModeratorTierLevel, bigint> = {
  // Tier 1: Room Sentinel
  TIER_1_ROOM_SENTINEL:
    Permissions.DELETE_ROOM_MESSAGE |
    Permissions.TIMEOUT_ROOM_USER |
    Permissions.TOGGLE_SLOW_MODE |
    Permissions.KICK_ROOM_USER,

  // Tier 2: Community Warden (+ all room actions)
  TIER_2_COMMUNITY_WARDEN:
    Permissions.DELETE_ROOM_MESSAGE |
    Permissions.TIMEOUT_ROOM_USER |
    Permissions.TOGGLE_SLOW_MODE |
    Permissions.KICK_ROOM_USER |
    Permissions.DELETE_COMMUNITY_POST |
    Permissions.LOCK_COMMENTS |
    Permissions.PIN_COMMUNITY_POST |
    Permissions.MUTE_COMMUNITY_USER |
    Permissions.TRIAGE_LOCAL_REPORTS,

  // Tier 3: Lead Moderator / Guild Master
  TIER_3_LEAD_MOD:
    Permissions.DELETE_ROOM_MESSAGE |
    Permissions.TIMEOUT_ROOM_USER |
    Permissions.TOGGLE_SLOW_MODE |
    Permissions.KICK_ROOM_USER |
    Permissions.DELETE_COMMUNITY_POST |
    Permissions.LOCK_COMMENTS |
    Permissions.PIN_COMMUNITY_POST |
    Permissions.MUTE_COMMUNITY_USER |
    Permissions.TRIAGE_LOCAL_REPORTS |
    Permissions.MANAGE_LOCAL_MODS |
    Permissions.CONFIGURE_AUTOMOD_RULES |
    Permissions.PERM_BAN_COMMUNITY |
    Permissions.VIEW_AUDIT_LOGS,

  // Tier 4: Global Staff / Platform Marshall
  TIER_4_GLOBAL_STAFF: 0x000000003fffffffn, // Bits 0 through 25

  // Tier 5: SuperAdmin
  TIER_5_SUPERADMIN: Permissions.ALL_PERMISSIONS,
};

export interface ModeratorAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  tierLevel: ModeratorTierLevel;
  tierTitle: string;
  scopeType: ModScopeType;
  communityId?: string;
  communityName?: string;
  roomId?: string;
  roomName?: string;
  customPermissions: bigint;
  combinedMask: bigint;
  assignedBy: string;
  createdAt: string;
}

export function hasPermission(userMask: bigint, requiredPerm: bigint): boolean {
  return (userMask & requiredPerm) === requiredPerm;
}

// --------------------------------------------------
// Cross-Store Search (Marketplace, OwnIt, Flamingo, Storefront, FingerLux)
// --------------------------------------------------

export interface CrossStoreProduct {
  id: string;
  title: string;
  name?: string;
  price: number;
  currency: 'FIC' | 'USD';
  fiatPrice?: string;
  store: 'MarketPlace' | 'OwnIt' | 'Flamingo' | 'Storefront' | 'FingerLux' | string;
  storeBadgeColor: string;
  category: string;
  rating?: number;
  imageUrl?: string;
  inStock: boolean;
  canBeGifted?: boolean;
  canTipFIC?: boolean;
}

