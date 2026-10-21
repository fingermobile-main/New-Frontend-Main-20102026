import { api } from './api';

export interface SystemHealthNode {
  id: string;
  service_name: string;
  category: 'core' | 'database' | 'ai' | 'gateway' | 'storage' | 'streaming';
  status: 'healthy' | 'degraded' | 'offline' | 'maintenance';
  latency_ms: number;
  uptime_pct: number;
  version: string;
  last_check_at: string;
}

export interface PlatformDashboardStats {
  totalUsers: number;
  totalTransactions: number;
  pendingModeration: number;
  totalModeration: number;
  totalAuditLogs: number;
  totalFranchises: number;
  systemUptime: number;
  activeSessions: number;
}

export interface SiteMenu {
  id: string;
  title: string;
  slug: string;
  location: string;
  items: Array<{ label: string; url: string }>;
  is_active: boolean;
}

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  template: string;
  status: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
}

export interface PlatformDomain {
  id: string;
  domain: string;
  ssl_status: 'active' | 'pending' | 'expired' | 'error';
  is_primary: boolean;
  dns_records: Array<{ type: string; name: string; value: string }>;
}

export interface FranchiseOrg {
  id: string;
  name: string;
  code: string;
  region: string;
  contact_email: string;
  contact_phone: string;
  status: 'active' | 'suspended' | 'pending_approval' | 'closed';
  royalty_pct: number;
  active_terminals: number;
}

export interface PlatformBillingRecord {
  id: string;
  invoice_number: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paid_at?: string;
  created_at?: string;
  billing_cycle?: string;
}

export const adminOperationsService = {
  getSystemStatus: async (): Promise<SystemHealthNode[]> => {
    const res = await api.get('/operations/system-status');
    return res.data?.data || [];
  },

  triggerHealthCheck: async (serviceName?: string): Promise<SystemHealthNode[]> => {
    const res = await api.post('/operations/system-status/check', { service_name: serviceName });
    return res.data?.data || [];
  },

  getDashboardStats: async (): Promise<PlatformDashboardStats> => {
    const res = await api.get('/operations/dashboard-stats');
    return res.data?.data || {
      totalUsers: 0,
      totalTransactions: 0,
      pendingModeration: 0,
      totalModeration: 0,
      totalAuditLogs: 0,
      totalFranchises: 0,
      systemUptime: 99.98,
      activeSessions: 0
    };
  },

  getSiteMenus: async (): Promise<SiteMenu[]> => {
    const res = await api.get('/operations/site/menus');
    return res.data?.data || [];
  },

  createSiteMenu: async (data: Partial<SiteMenu>): Promise<SiteMenu> => {
    const res = await api.post('/operations/site/menus', data);
    return res.data?.data;
  },

  updateSiteMenu: async (id: string, data: Partial<SiteMenu>): Promise<SiteMenu> => {
    const res = await api.put(`/operations/site/menus/${id}`, data);
    return res.data?.data;
  },

  deleteSiteMenu: async (id: string): Promise<void> => {
    await api.delete(`/operations/site/menus/${id}`);
  },

  getSitePages: async (): Promise<SitePage[]> => {
    const res = await api.get('/operations/site/pages');
    return res.data?.data || [];
  },

  createSitePage: async (data: Partial<SitePage>): Promise<SitePage> => {
    const res = await api.post('/operations/site/pages', data);
    return res.data?.data;
  },

  updateSitePage: async (id: string, data: Partial<SitePage>): Promise<SitePage> => {
    const res = await api.put(`/operations/site/pages/${id}`, data);
    return res.data?.data;
  },

  deleteSitePage: async (id: string): Promise<void> => {
    await api.delete(`/operations/site/pages/${id}`);
  },

  getDomains: async (): Promise<PlatformDomain[]> => {
    const res = await api.get('/operations/domains');
    return res.data?.data || [];
  },

  createDomain: async (data: Partial<PlatformDomain>): Promise<PlatformDomain> => {
    const res = await api.post('/operations/domains', data);
    return res.data?.data;
  },

  deleteDomain: async (id: string): Promise<void> => {
    await api.delete(`/operations/domains/${id}`);
  },

  getFranchises: async (): Promise<FranchiseOrg[]> => {
    const res = await api.get('/operations/franchises');
    return res.data?.data || [];
  },

  createFranchise: async (data: Partial<FranchiseOrg>): Promise<FranchiseOrg> => {
    const res = await api.post('/operations/franchises', data);
    return res.data?.data;
  },

  getSettings: async (): Promise<any[]> => {
    const res = await api.get('/operations/settings');
    return res.data?.data || [];
  },

  updateSetting: async (key: string, value: any, group?: string, description?: string): Promise<any> => {
    const res = await api.put(`/operations/settings/${key}`, {
      config_value: value,
      config_group: group,
      description
    });
    return res.data?.data;
  },

  getBillingRecords: async (): Promise<PlatformBillingRecord[]> => {
    const res = await api.get('/operations/billing');
    return res.data?.data || [];
  },

  getMembers: async (): Promise<AdminMember[]> => {
    const res = await api.get('/admin/members');
    return res.data?.members || res.data?.data || [];
  },

  createMember: async (data: Partial<AdminMember>): Promise<AdminMember> => {
    const res = await api.post('/admin/members', data);
    return res.data?.member || res.data?.data;
  },

  updateMember: async (memberId: string, data: Partial<AdminMember>): Promise<AdminMember> => {
    const res = await api.put(`/admin/members/${memberId}`, data);
    return res.data?.member || res.data?.data;
  },

  deleteMember: async (memberId: string, permanent: boolean = false): Promise<void> => {
    await api.delete(`/admin/members/${memberId}?permanent=${permanent}`);
  },

  getUsers: async (): Promise<PlatformUser[]> => {
    const res = await api.get('/admin/users');
    return res.data?.users || res.data?.data || [];
  },

  strikeUser: async (userId: string, reason?: string): Promise<any> => {
    const res = await api.post(`/admin/users/${userId}/strike`, { reason });
    return res.data;
  },

  banUser: async (userId: string): Promise<any> => {
    const res = await api.post(`/admin/users/${userId}/ban`);
    return res.data;
  },

  refundUser: async (userId: string, amount: number = 50): Promise<any> => {
    const res = await api.post(`/admin/users/${userId}/refund`, { amount });
    return res.data;
  },

  creditUser: async (userId: string, amount: number = 100): Promise<any> => {
    const res = await api.post(`/admin/users/${userId}/credits`, { amount });
    return res.data;
  }
};

export interface AdminMember {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface PlatformUser {
  id: string;
  uuid: string;
  username: string;
  email: string;
  role: string;
  status: string;
  fiatBalance?: number;
  cryptoBalance?: number;
  aiCredits?: number;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default adminOperationsService;
