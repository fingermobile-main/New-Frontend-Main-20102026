import ApiService from './api';

export interface Report {
  id: string;
  reporterUserId?: string;
  reportedUserId?: string;
  reportedPostId?: string;
  reportedCommentId?: string;
  reportedConversationId?: string;
  reportedGroupId?: string;
  type: 'spam' | 'harassment' | 'hate_speech' | 'violence' | 'nudity' | 'fake_news' | 'copyright' | 'other';
  reason: string;
  evidenceUrls?: string[];
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  reviewedByUserId?: string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
  reporterUser?: {
    id: string;
    username: string;
    email: string;
  };
  reportedUser?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface CreateReportRequest {
  reporterUserId?: string;
  reportedUserId?: string;
  reportedPostId?: string;
  reportedCommentId?: string;
  reportedConversationId?: string;
  reportedGroupId?: string;
  type: 'spam' | 'harassment' | 'hate_speech' | 'violence' | 'nudity' | 'fake_news' | 'copyright' | 'other';
  reason: string;
  evidenceUrls?: string[];
}

export interface ReviewReportRequest {
  status: 'reviewed' | 'dismissed' | 'action_taken';
  notes?: string;
  actionTaken?: string; // Description of action taken
}

export interface ModerationAction {
  id: string;
  moderatorUserId: string;
  targetUserId?: string;
  targetPostId?: string;
  targetCommentId?: string;
  actionType: 'warning' | 'temporary_ban' | 'permanent_ban' | 'content_removed' | 'account_suspended';
  duration?: string; // Duration for temporary actions
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface CreateModerationActionRequest {
  targetUserId?: string;
  targetPostId?: string;
  targetCommentId?: string;
  actionType: 'warning' | 'temporary_ban' | 'permanent_ban' | 'content_removed' | 'account_suspended';
  duration?: string;
  reason: string;
  notes?: string;
}

export interface ReportListResponse {
  data: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ModerationActionListResponse {
  data: ModerationAction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ReportService {
  private static instance: ReportService;
  
  private constructor() {}
  
  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  async getReports(params: { 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc'; 
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ReportListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return ApiService.get(`/reports?${queryParams.toString()}`);
  }

  async getReportById(id: string): Promise<Report> {
    return ApiService.get(`/reports/${id}`);
  }

  async createReport(reportData: CreateReportRequest): Promise<Report> {
    return ApiService.post('/reports', reportData);
  }

  async updateReport(id: string, reportData: ReviewReportRequest): Promise<Report> {
    return ApiService.put(`/reports/${id}`, reportData);
  }

  async getModerationActions(params: { 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc'; 
    actionType?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ModerationActionListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.actionType) queryParams.append('actionType', params.actionType);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return ApiService.get(`/moderation-actions?${queryParams.toString()}`);
  }

  async createModerationAction(actionData: CreateModerationActionRequest): Promise<ModerationAction> {
    return ApiService.post('/moderation-actions', actionData);
  }

  async getModerationStats(): Promise<any> {
    return ApiService.get('/moderation/stats');
  }
}

export default ReportService.getInstance();