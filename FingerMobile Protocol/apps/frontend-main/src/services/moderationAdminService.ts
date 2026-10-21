import { api } from './api';

export interface ModerationQueueItem {
  id: string;
  content_type: string;
  content_id: string;
  reason: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  reported_by?: string;
  reporter_username?: string;
  contentPreview?: string;
  created_at: string;
}

export interface ModerationStats {
  pending: number;
  approved: number;
  rejected: number;
  highPriorityPending: number;
  avgReviewTimeSeconds: number;
}

export interface UserReportItem {
  id: string;
  reporter_id?: string;
  target_type: string;
  target_id: string;
  reason: string;
  description?: string;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  resolution_action?: string;
  created_at: string;
}

export const moderationAdminService = {
  getQueue: async (params?: { contentType?: string; priority?: string }): Promise<ModerationQueueItem[]> => {
    const res = await api.get('/moderation/queue', { params });
    return res.data?.data || [];
  },

  getStats: async (): Promise<ModerationStats> => {
    const res = await api.get('/moderation/stats');
    return res.data?.data || {
      pending: 0,
      approved: 0,
      rejected: 0,
      highPriorityPending: 0,
      avgReviewTimeSeconds: 0
    };
  },

  approveItem: async (id: string, notes?: string): Promise<void> => {
    await api.post(`/moderation/${id}/approve`, { notes });
  },

  rejectItem: async (id: string, action: string = 'remove_content', notes?: string): Promise<void> => {
    await api.post(`/moderation/${id}/reject`, { action, notes });
  },

  getReports: async (status: string = 'all'): Promise<UserReportItem[]> => {
    const res = await api.get('/moderation/reports', { params: { status } });
    return res.data?.data || [];
  },

  updateReport: async (id: string, data: { status: string; resolutionNotes?: string; resolutionAction?: string }): Promise<UserReportItem> => {
    const res = await api.put(`/moderation/reports/${id}`, data);
    return res.data?.data;
  },

  getCategoryItems: async (category: string, status: string = 'pending'): Promise<ModerationQueueItem[]> => {
    const res = await api.get(`/moderation/category/${category}`, { params: { status } });
    return res.data?.data || [];
  },

  approveCategoryItem: async (category: string, id: string, notes?: string): Promise<void> => {
    await api.post(`/moderation/category/${category}/${id}/approve`, { notes });
  },

  rejectCategoryItem: async (category: string, id: string, notes?: string): Promise<void> => {
    await api.post(`/moderation/category/${category}/${id}/reject`, { notes });
  }
};

export default moderationAdminService;
