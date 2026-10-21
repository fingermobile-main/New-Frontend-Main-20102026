import ApiService from './api';

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
  ipAddress: string;
  userAgent: string;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  deviceInfo: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
  };
  actions: UserAction[];
  riskScore: number; // 0-1 scale
  status: 'active' | 'ended' | 'suspicious';
}

export interface UserAction {
  id: string;
  sessionId: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  metadata: {
    [key: string]: any;
  };
  ip: string;
  userAgent: string;
  riskScore: number; // 0-1 scale
}

export interface AnomalousBehavior {
  id: string;
  userId: string;
  userName: string;
  type: 'unusual_login' | 'unusual_activity' | 'potential_breach' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  evidence: string[];
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  riskScore: number; // 0-1 scale
  recommendedAction: string;
}

export interface RiskProfile {
  id: string;
  userId: string;
  userName: string;
  riskScore: number; // 0-1 scale
  riskFactors: {
    factor: string;
    score: number; // 0-1 scale
    weight: number; // 0-1 scale
    description: string;
  }[];
  lastUpdated: string;
  profile: {
    typicalLoginTimes: string[];
    commonLocations: string[];
    preferredDevices: string[];
    usualActivities: string[];
  };
}

export interface BehaviorPattern {
  id: string;
  name: string;
  description: string;
  criteria: {
    condition: string;
    value: any;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  }[];
  riskWeight: number; // 0-1 scale
  actions: ('alert' | 'block' | 'quarantine' | 'investigate')[];
  enabled: boolean;
  lastModified: string;
}

export interface PrivilegedAccess {
  id: string;
  userId: string;
  userName: string;
  privilegeLevel: 'admin' | 'moderator' | 'power_user' | 'limited_admin';
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
  reason: string;
  justification: string;
  status: 'active' | 'expired' | 'revoked' | 'pending_approval';
  auditTrail: {
    action: string;
    timestamp: string;
    performedBy: string;
    details: string;
  }[];
}

export interface AccessReview {
  id: string;
  reviewerId: string;
  reviewedUserId: string;
  privilegeLevel: string;
  reviewDate: string;
  status: 'approved' | 'denied' | 'requires_attention';
  notes: string;
  nextReviewDate: string;
}

class UserBehaviorAnalyticsService {
  private static instance: UserBehaviorAnalyticsService;
  
  private constructor() {}
  
  public static getInstance(): UserBehaviorAnalyticsService {
    if (!UserBehaviorAnalyticsService.instance) {
      UserBehaviorAnalyticsService.instance = new UserBehaviorAnalyticsService();
    }
    return UserBehaviorAnalyticsService.instance;
  }

  async getUserSessions(params: { 
    userId?: string; 
    status?: string; 
    startDate?: string; 
    endDate?: string; 
    minRiskScore?: number; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: UserSession[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.minRiskScore) queryParams.append('minRiskScore', params.minRiskScore.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/behavior-analytics/sessions?${queryParams.toString()}`);
  }

  async getUserActions(userId: string, params: { 
    startDate?: string; 
    endDate?: string; 
    action?: string; 
    minRiskScore?: number; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: UserAction[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    queryParams.append('userId', userId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.action) queryParams.append('action', params.action);
    if (params.minRiskScore) queryParams.append('minRiskScore', params.minRiskScore.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/behavior-analytics/actions?${queryParams.toString()}`);
  }

  async getAnomalousBehaviors(params: { 
    userId?: string; 
    type?: string; 
    severity?: string; 
    status?: string; 
    startDate?: string; 
    endDate?: string; 
    minRiskScore?: number; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: AnomalousBehavior[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.type) queryParams.append('type', params.type);
    if (params.severity) queryParams.append('severity', params.severity);
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.minRiskScore) queryParams.append('minRiskScore', params.minRiskScore.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/behavior-analytics/anomalies?${queryParams.toString()}`);
  }

  async getUserRiskProfiles(params: { 
    userId?: string; 
    minRiskScore?: number; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: RiskProfile[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.minRiskScore) queryParams.append('minRiskScore', params.minRiskScore.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/behavior-analytics/risk-profiles?${queryParams.toString()}`);
  }

  async getBehaviorPatterns(): Promise<BehaviorPattern[]> {
    return ApiService.get('/behavior-analytics/patterns');
  }

  async createBehaviorPattern(patternData: Omit<BehaviorPattern, 'id' | 'lastModified'>): Promise<BehaviorPattern> {
    return ApiService.post('/behavior-analytics/patterns', patternData);
  }

  async updateBehaviorPattern(id: string, updateData: Partial<BehaviorPattern>): Promise<BehaviorPattern> {
    return ApiService.put(`/behavior-analytics/patterns/${id}`, updateData);
  }

  async toggleBehaviorPattern(id: string, enabled: boolean): Promise<BehaviorPattern> {
    return ApiService.put(`/behavior-analytics/patterns/${id}/toggle`, { enabled });
  }

  async getPrivilegedAccess(params: { 
    userId?: string; 
    privilegeLevel?: string; 
    status?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: PrivilegedAccess[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.privilegeLevel) queryParams.append('privilegeLevel', params.privilegeLevel);
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/behavior-analytics/privileged-access?${queryParams.toString()}`);
  }

  async grantPrivilegedAccess(accessData: Omit<PrivilegedAccess, 'id' | 'status' | 'auditTrail'>): Promise<PrivilegedAccess> {
    return ApiService.post('/behavior-analytics/privileged-access', accessData);
  }

  async revokePrivilegedAccess(id: string, reason: string): Promise<PrivilegedAccess> {
    return ApiService.put(`/behavior-analytics/privileged-access/${id}/revoke`, { reason });
  }

  async getAccessReviews(params: { 
    userId?: string; 
    reviewerId?: string; 
    status?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: AccessReview[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.reviewerId) queryParams.append('reviewerId', params.reviewerId);
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/behavior-analytics/access-reviews?${queryParams.toString()}`);
  }

  async createAccessReview(reviewData: Omit<AccessReview, 'id' | 'reviewDate'>): Promise<AccessReview> {
    return ApiService.post('/behavior-analytics/access-reviews', reviewData);
  }

  async triggerRiskAssessment(userId: string): Promise<RiskProfile> {
    return ApiService.post(`/behavior-analytics/users/${userId}/risk-assessment`, {});
  }

  async generateBehaviorReport(userId: string, startDate: string, endDate: string): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', startDate);
    queryParams.append('endDate', endDate);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    const response = await fetch(`${API_BASE_URL}/behavior-analytics/users/${userId}/report?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ApiService.getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to generate behavior report');
    }

    return response.blob();
  }
}

export default UserBehaviorAnalyticsService.getInstance();