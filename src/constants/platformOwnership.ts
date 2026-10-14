/**
 * FingerMobile Protocol - Platform Ownership & Master Control Authority
 * Hardcoded Platform Executive Officers & Root Authorities
 */

export interface PlatformOwnerProfile {
  id: string;
  name: string;
  title: string;
  roles: string[];
  roleBadge: string;
  isRootSuperAdmin: boolean;
  masterControl: boolean;
  accessLevelDescription: string;
  dashboardAccess: {
    masterDashboard: 'ABSOLUTE_FULL_ACCESS' | 'PERMITTED_MOST_PAGES';
    stercsDashboard: 'ABSOLUTE_FULL_ACCESS' | 'PERMITTED_MOST_PAGES';
    canGrantPermissions: boolean;
    canRevokeAccess: boolean;
  };
  signinEmail: string;
  emails: string[];
  phones: string[];
  meansOfIdentification: {
    type: 'NIN';
    number: string;
    formatted: string;
  };
  biometry: string;
  countryCode: string;
  jurisdiction: string;
  status: 'ACTIVE_ROOT_AUTHORITY';
  rootMasterSeal?: string[];
  executiveRole?: string;
}

export const DEDICATED_TREASURY_RAIL = {
  bankName: 'Alternative Bank',
  licenseStatus: 'CBN Licensed & Supervised Institution',
  accountNumber: '0514108422',
  railTitle: 'Dedicated Sovereign Protocol Treasury Rail',
  accountName: 'FingerMobile Protocol Communication',
  currency: 'NGN',
  standardRatePerFic: 650.00,
  seedRatePerFic: 65.00
};

export const PLATFORM_OWNERSHIP: {
  founder: PlatformOwnerProfile;
  coFounder: PlatformOwnerProfile;
} = {
  founder: {
    id: 'owner_mbah_israel_obinna',
    name: 'Mr. Mbah Israel Obinna',
    title: 'Founder and Owner',
    roles: ['Founder and Owner', 'SuperAdmin and Master Control'],
    roleBadge: '👑 Founder & Owner — SuperAdmin & Master Control',
    isRootSuperAdmin: true,
    masterControl: true,
    accessLevelDescription: 'Absolute Full Access to MasterDashboard and Stercs Dashboard',
    dashboardAccess: {
      masterDashboard: 'ABSOLUTE_FULL_ACCESS',
      stercsDashboard: 'ABSOLUTE_FULL_ACCESS',
      canGrantPermissions: true,
      canRevokeAccess: true
    },
    signinEmail: 'fingermobileprotocol@gmail.com',
    emails: [
      'obinnambah100@gmail.com',
      'gracelinkbustech@gmail.com',
      'fingermobileprotocol@gmail.com'
    ],
    phones: [
      '+2348088855752',
      '+2347033304670'
    ],
    meansOfIdentification: {
      type: 'NIN',
      number: '225-3324-4384',
      formatted: 'NIN: 225-3324-4384'
    },
    biometry: 'Live/Motion facial ID',
    countryCode: 'NG',
    jurisdiction: 'Nigeria (NG) & Global Sovereign Network',
    status: 'ACTIVE_ROOT_AUTHORITY'
  },
  coFounder: {
    id: 'owner_mbah_eunice_emonena',
    name: 'Mrs. Mbah Eunice Emonena',
    title: 'Chief Financial Officer (CFO)',
    executiveRole: 'Chief Financial Officer (CFO)',
    roles: [
      'Co-Founder',
      'Admin-1 and Master Control',
      'Chief Financial Officer (CFO)'
    ],
    roleBadge: '⭐ Co-Founder — Admin-1 & Master Control, Chief Financial Officer (CFO)',
    rootMasterSeal: [
      '✓ Co-Founder',
      '✓ Admin-1 and Master Control, Chief Financial Officer (CFO)',
      'Master Dashboard & STERCS Dashboard Authority: Chief Financial Officer (CFO)',
      'RBC (Limited) Access to MasterDashboard and Stercs Dashboard (Permitted to Most Pages Granted by SuperAdmin)'
    ],
    isRootSuperAdmin: false,
    masterControl: true,
    accessLevelDescription: 'RBC (Limited) Access to MasterDashboard and Stercs Dashboard (Permitted to Most Pages Granted by SuperAdmin)',
    dashboardAccess: {
      masterDashboard: 'PERMITTED_MOST_PAGES',
      stercsDashboard: 'PERMITTED_MOST_PAGES',
      canGrantPermissions: false,
      canRevokeAccess: false
    },
    signinEmail: 'eunicembah@gmail.com',
    emails: [
      'eunicembah@gmail.com',
      'philipatiks@yahoo.com'
    ],
    phones: [
      '+234-803-392-4846',
      '+234-808-892-1787'
    ],
    meansOfIdentification: {
      type: 'NIN',
      number: '774-3558-2138',
      formatted: 'NIN: 774-3558-2138'
    },
    biometry: 'Live/Motion facial ID',
    countryCode: 'NG',
    jurisdiction: 'Nigeria (NG) & Global Sovereign Network',
    status: 'ACTIVE_ROOT_AUTHORITY'
  }
};

export interface AccountingRole {
  roleCode: string;
  roleName: string;
  category: 'EXECUTIVE_LEADERSHIP' | 'MANAGEMENT_SUPERVISORY' | 'PROFESSIONAL_MIDLEVEL' | 'ENTRY_SUPPORT';
  responsibilities: string;
  canConfirmPayment: boolean;
  canFinalApprove: boolean;
}

export const FINANCIAL_ROLES_TAXONOMY: AccountingRole[] = [
  // Executive & Leadership Roles
  {
    roleCode: 'CFO',
    roleName: 'Chief Financial Officer (CFO)',
    category: 'EXECUTIVE_LEADERSHIP',
    responsibilities: 'Manages overall corporate financial strategy, long-term planning, high-level risk management, and capital structure. Final authority on treasury disbursements.',
    canConfirmPayment: true,
    canFinalApprove: true
  },
  {
    roleCode: 'CAO',
    roleName: 'Chief Accounting Officer (CAO) / Controller',
    category: 'EXECUTIVE_LEADERSHIP',
    responsibilities: 'Directs day-to-day accounting operations, ensures compliance with accounting standards (like GAAP or IFRS), and oversees closing the monthly and yearly books.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'TREASURER',
    roleName: 'Treasurer',
    category: 'EXECUTIVE_LEADERSHIP',
    responsibilities: 'Manages corporate cash flow, bank relationships, debt, and investment strategies.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  // Management & Supervisory Roles
  {
    roleCode: 'FIN_CONTROLLER',
    roleName: 'Financial Controller / Accounting Manager',
    category: 'MANAGEMENT_SUPERVISORY',
    responsibilities: 'Supervises daily accounting workflows, reviews reconciliations, and acts as the bridge between junior staff and executive leadership.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'AP_AR_MGR',
    roleName: 'Accounts Payable (AP) / Accounts Receivable (AR) Manager',
    category: 'MANAGEMENT_SUPERVISORY',
    responsibilities: 'Oversees specialized teams handling outgoing vendor payments and incoming customer collections.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'PAYROLL_MGR',
    roleName: 'Payroll Manager',
    category: 'MANAGEMENT_SUPERVISORY',
    responsibilities: 'Manages employee compensation schedules, overtime, bonuses, and statutory tax withholdings.',
    canConfirmPayment: false,
    canFinalApprove: false
  },
  // Professional & Mid-Level Roles
  {
    roleCode: 'SR_ACCOUNTANT',
    roleName: 'Senior Accountant',
    category: 'PROFESSIONAL_MIDLEVEL',
    responsibilities: 'Prepares complex journal entries, manages general ledgers, analyzes financial variances, and assists with audits.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'STAFF_ACCT_1',
    roleName: 'Account Staff 1',
    category: 'PROFESSIONAL_MIDLEVEL',
    responsibilities: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and basic AP/AR support.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'STAFF_ACCT_2',
    roleName: 'Account Staff 2',
    category: 'PROFESSIONAL_MIDLEVEL',
    responsibilities: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and basic AP/AR support.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'STAFF_ACCT_3',
    roleName: 'Account Staff 3',
    category: 'PROFESSIONAL_MIDLEVEL',
    responsibilities: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and basic AP/AR support.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'STAFF_ACCT_4',
    roleName: 'Account Staff 4',
    category: 'PROFESSIONAL_MIDLEVEL',
    responsibilities: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and basic AP/AR support.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'STAFF_ACCT_5',
    roleName: 'Account Staff 5',
    category: 'PROFESSIONAL_MIDLEVEL',
    responsibilities: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and basic AP/AR support.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'STAFF_ACCT_6',
    roleName: 'Account Staff 6',
    category: 'PROFESSIONAL_MIDLEVEL',
    responsibilities: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and basic AP/AR support.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'STAFF_ACCT_7',
    roleName: 'Account Staff 7',
    category: 'PROFESSIONAL_MIDLEVEL',
    responsibilities: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and basic AP/AR support.',
    canConfirmPayment: true,
    canFinalApprove: false
  },
  {
    roleCode: 'COST_ACCOUNTANT',
    roleName: 'Cost Accountant',
    category: 'PROFESSIONAL_MIDLEVEL',
    responsibilities: 'Analyzes production, labor, and material overhead costs to help the business improve efficiency.',
    canConfirmPayment: false,
    canFinalApprove: false
  },
  {
    roleCode: 'FIN_ANALYST',
    roleName: 'Financial Analyst',
    category: 'PROFESSIONAL_MIDLEVEL',
    responsibilities: 'Evaluates financial data, builds budgets, forecasts cash flow, and creates performance dashboards for management.',
    canConfirmPayment: false,
    canFinalApprove: false
  },
  // Entry-Level & Support Roles
  {
    roleCode: 'JR_ACCOUNTANT',
    roleName: 'Junior Accountant / Accounting Clerk',
    category: 'ENTRY_SUPPORT',
    responsibilities: 'Assists with preliminary report generation, data entry, and checking transaction numbers.',
    canConfirmPayment: false,
    canFinalApprove: false
  },
  {
    roleCode: 'BOOKKEEPER',
    roleName: 'Bookkeeper',
    category: 'ENTRY_SUPPORT',
    responsibilities: 'Records day-to-day financial transactions, issues customer invoices, and files basic financial documents.',
    canConfirmPayment: false,
    canFinalApprove: false
  },
  {
    roleCode: 'AUDITING_CLERK',
    roleName: 'Auditing Clerk',
    category: 'ENTRY_SUPPORT',
    responsibilities: 'Supports internal or external auditors by gathering transaction records and verifying data accuracy.',
    canConfirmPayment: false,
    canFinalApprove: false
  }
];

/**
 * Check if a given email belongs to the Root SuperAdmin Founder (Mr. Mbah Israel Obinna)
 */
export function isPlatformFounderEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    normalized === PLATFORM_OWNERSHIP.founder.signinEmail.toLowerCase() ||
    PLATFORM_OWNERSHIP.founder.emails.some((e) => e.toLowerCase() === normalized)
  );
}

/**
 * Check if a given phone belongs to Mr. Mbah Israel Obinna
 */
export function isPlatformFounderPhone(phone?: string | null): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-()]/g, '');
  return PLATFORM_OWNERSHIP.founder.phones.some((p) => p.replace(/[\s\-()]/g, '') === clean);
}

/**
 * Check if a given email belongs to Co-Founder (Mrs. Mbah Eunice Emonena)
 */
export function isPlatformCoFounderEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    normalized === PLATFORM_OWNERSHIP.coFounder.signinEmail.toLowerCase() ||
    PLATFORM_OWNERSHIP.coFounder.emails.some((e) => e.toLowerCase() === normalized)
  );
}

/**
 * Check if a given phone belongs to Mrs. Mbah Eunice Emonena
 */
export function isPlatformCoFounderPhone(phone?: string | null): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-()]/g, '');
  return PLATFORM_OWNERSHIP.coFounder.phones.some((p) => p.replace(/[\s\-()]/g, '') === clean);
}

/**
 * Verify if the user has absolute full access or permitted access to Master Control
 */
export function getPlatformAuthorityForUser(email?: string | null, phone?: string | null): {
  isOwner: boolean;
  profile: PlatformOwnerProfile | null;
  role: 'SUPERADMIN_FOUNDER' | 'ADMIN1_COFOUNDER' | 'STANDARD_USER';
} {
  if (isPlatformFounderEmail(email) || isPlatformFounderPhone(phone)) {
    return {
      isOwner: true,
      profile: PLATFORM_OWNERSHIP.founder,
      role: 'SUPERADMIN_FOUNDER'
    };
  }
  if (isPlatformCoFounderEmail(email) || isPlatformCoFounderPhone(phone)) {
    return {
      isOwner: true,
      profile: PLATFORM_OWNERSHIP.coFounder,
      role: 'ADMIN1_COFOUNDER'
    };
  }
  return {
    isOwner: false,
    profile: null,
    role: 'STANDARD_USER'
  };
}
