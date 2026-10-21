/**
 * Legal, Compliance, Governance & Support Service
 * FingerMobile Protocol™ - Full-Stack Integration Client
 */

import api from './api';

export interface DataSubjectRequest {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  request_type: 'access' | 'correction' | 'deletion' | 'portability' | 'restriction' | 'objection';
  message?: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountDeletionRecord {
  id: string;
  user_id?: string;
  email: string;
  reason?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  confirmed_with_password: boolean;
  scheduled_purge_at: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  department: string;
  status: 'new' | 'read' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface FeedbackSubmission {
  id: string;
  user_id?: string;
  category: string;
  rating: number;
  comment?: string;
  page_url?: string;
  created_at: string;
}

export interface LegalDocument {
  id: string;
  slug: string;
  title: string;
  version: string;
  content: string;
  summary?: string;
  effective_date: string;
  is_active: boolean;
  updated_at: string;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'support' | 'user';
  text: string;
  timestamp: string;
}

export interface SupportTicketItem {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  member?: {
    id?: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
  };
  messages: SupportTicketMessage[];
}

export interface SupportStats {
  total: number;
  open: number;
  resolved: number;
  avgResponseTimeHours: number;
}

export interface GovernancePolicy {
  id: string;
  policy_id: string;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  allowed_actions: string[];
  banned_actions: string[];
  require_explicit_consent: boolean;
  created_at: string;
}

export const legalComplianceService = {
  // 1. Data Subject Requests (DSR)
  submitDSR: async (data: {
    name: string;
    email: string;
    requestType?: string;
    message?: string;
    userId?: string;
  }): Promise<{ success: boolean; message: string; data?: DataSubjectRequest }> => {
    const res = await api.post('/legal/dsr', data);
    return res.data;
  },

  getDSRs: async (status?: string): Promise<DataSubjectRequest[]> => {
    const res = await api.get('/legal/dsr', { params: { status } });
    return res.data?.data || [];
  },

  getDSRById: async (id: string): Promise<DataSubjectRequest | null> => {
    const res = await api.get(`/legal/dsr/${id}`);
    return res.data?.data || null;
  },

  // 2. Account Deletion
  requestAccountDeletion: async (data: {
    email: string;
    password?: string;
    reason?: string;
    confirmDeletion: boolean;
  }): Promise<{ success: boolean; message: string; data?: AccountDeletionRecord }> => {
    const res = await api.post('/legal/account-deletion', data);
    return res.data;
  },

  getAccountDeletionStatus: async (email?: string): Promise<{ pending: boolean; data?: AccountDeletionRecord }> => {
    const res = await api.get('/legal/account-deletion/status', { params: { email } });
    return res.data;
  },

  getAccountDeletions: async (): Promise<AccountDeletionRecord[]> => {
    const res = await api.get('/legal/account-deletion');
    return res.data?.data || [];
  },

  // 3. Contact Us
  submitContact: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    department?: string;
  }): Promise<{ success: boolean; message: string; data?: ContactSubmission }> => {
    const res = await api.post('/legal/contact', data);
    return res.data;
  },

  getContactMessages: async (status?: string): Promise<ContactSubmission[]> => {
    const res = await api.get('/legal/contact', { params: { status } });
    return res.data?.data || [];
  },

  // 4. Feedback
  submitFeedback: async (data: {
    category?: string;
    rating?: number | string;
    comment?: string;
    pageUrl?: string;
    userId?: string;
  }): Promise<{ success: boolean; message: string; data?: FeedbackSubmission }> => {
    const res = await api.post('/legal/feedback', data);
    return res.data;
  },

  getFeedbackList: async (category?: string): Promise<FeedbackSubmission[]> => {
    const res = await api.get('/legal/feedback', { params: { category } });
    return res.data?.data || [];
  },

  // 5. Legal Documents
  getLegalDocuments: async (): Promise<LegalDocument[]> => {
    const res = await api.get('/legal/documents');
    return res.data?.data || [];
  },

  getLegalDocument: async (slug: string): Promise<LegalDocument | null> => {
    const res = await api.get(`/legal/documents/${slug}`);
    return res.data?.data || null;
  },

  updateLegalDocument: async (
    slug: string,
    data: Partial<{ title: string; version: string; content: string; summary: string }>
  ): Promise<LegalDocument> => {
    const res = await api.put(`/legal/documents/${slug}`, data);
    return res.data?.data;
  },

  // 6. DMCA
  submitDMCA: async (data: {
    claimant_name: string;
    claimant_email: string;
    infringing_url: string;
    original_work_url?: string;
    description?: string;
    signature: string;
  }): Promise<{ success: boolean; message: string; requestId?: string }> => {
    const res = await api.post('/legal/dmca', data);
    return res.data;
  },

  // 7. Support Tickets
  getTickets: async (status?: string): Promise<SupportTicketItem[]> => {
    const res = await api.get('/support/tickets', { params: { status } });
    return res.data?.data || [];
  },

  createTicket: async (data: {
    subject: string;
    description?: string;
    priority?: string;
    category?: string;
    ticketType?: string;
    email?: string;
  }): Promise<{ success: boolean; message: string; data?: any }> => {
    const res = await api.post('/support/tickets', data);
    return res.data;
  },

  getTicketById: async (id: string): Promise<SupportTicketItem | null> => {
    const res = await api.get(`/support/tickets/${id}`);
    return res.data?.data || null;
  },

  replyToTicket: async (id: string, message: string, isInternal?: boolean): Promise<{ success: boolean; data?: any }> => {
    const res = await api.post(`/support/tickets/${id}/messages`, { message, isInternal });
    return res.data;
  },

  updateTicketStatus: async (id: string, status: string): Promise<{ success: boolean; data?: any }> => {
    const res = await api.put(`/support/tickets/${id}/status`, { status });
    return res.data;
  },

  getSupportStats: async (): Promise<SupportStats> => {
    const res = await api.get('/support/stats');
    return res.data?.data || { total: 0, open: 0, resolved: 0, avgResponseTimeHours: 2.0 };
  },

  // 8. Governance Policies
  getGovernancePolicies: async (status?: string): Promise<GovernancePolicy[]> => {
    try {
      const res = await api.get('/governance/policies', { params: { status } });
      const items = res.data?.data?.policies || res.data?.data || [];
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  },

  getGovernancePolicy: async (id: string): Promise<GovernancePolicy | null> => {
    try {
      const res = await api.get(`/governance/policies/${id}`);
      return res.data?.data || null;
    } catch {
      return null;
    }
  }
};

export default legalComplianceService;
