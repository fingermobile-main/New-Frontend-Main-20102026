import ApiService from './api';

export interface DataClassification {
  id: string;
  name: string;
  sensitivityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  description: string;
  applicableRegions: string[];
  retentionPeriod: number; // in days
  complianceRequirements: string[];
}

export interface DataBreach {
  id: string;
  incidentDate: string;
  detectionDate: string;
  description: string;
  affectedRecords: number;
  dataTypes: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'investigating' | 'contained' | 'remediated' | 'closed';
  notificationRequired: boolean;
  notificationSentDate?: string;
  regulatoryNotifications: {
    authority: string;
    notifiedDate: string;
    details: string;
  }[];
  remediationSteps: string[];
}

export interface PrivacyRequest {
  id: string;
  userId: string;
  type: 'access' | 'deletion' | 'correction' | 'portability';
  status: 'pending' | 'in_progress' | 'fulfilled' | 'rejected';
  requestedDate: string;
  completedDate?: string;
  details: string;
  assignedTo?: string;
}

export interface DataLossPreventionPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: {
    field: string;
    operator: 'contains' | 'equals' | 'starts_with' | 'ends_with';
    value: string;
  }[];
  actions: ('block' | 'alert' | 'encrypt' | 'quarantine')[];
  scope: 'all' | 'specific_users' | 'specific_groups';
  scopeIds?: string[];
  lastModified: string;
}

export interface DataEncryptionKey {
  id: string;
  name: string;
  algorithm: string;
  creationDate: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'revoked';
  purpose: 'at_rest' | 'in_transit' | 'both';
  rotationInterval: number; // in days
}

export interface AuditTrailEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  outcome: 'success' | 'failure';
  details: {
    before?: any;
    after?: any;
    reason?: string;
  };
}

class DataProtectionService {
  private static instance: DataProtectionService;
  
  private constructor() {}
  
  public static getInstance(): DataProtectionService {
    if (!DataProtectionService.instance) {
      DataProtectionService.instance = new DataProtectionService();
    }
    return DataProtectionService.instance;
  }

  async getDataClassifications(): Promise<DataClassification[]> {
    return ApiService.get('/data-protection/classifications');
  }

  async createDataClassification(classificationData: Omit<DataClassification, 'id'>): Promise<DataClassification> {
    return ApiService.post('/data-protection/classifications', classificationData);
  }

  async updateDataClassification(id: string, updateData: Partial<DataClassification>): Promise<DataClassification> {
    return ApiService.put(`/data-protection/classifications/${id}`, updateData);
  }

  async getDataBreaches(params: { 
    status?: string; 
    severity?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: DataBreach[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.severity) queryParams.append('severity', params.severity);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/data-protection/breaches?${queryParams.toString()}`);
  }

  async createDataBreach(breachData: Omit<DataBreach, 'id' | 'status'>): Promise<DataBreach> {
    return ApiService.post('/data-protection/breaches', breachData);
  }

  async updateDataBreach(id: string, updateData: Partial<DataBreach>): Promise<DataBreach> {
    return ApiService.put(`/data-protection/breaches/${id}`, updateData);
  }

  async getPrivacyRequests(params: { 
    status?: string; 
    type?: string; 
    userId?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: PrivacyRequest[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/data-protection/requests?${queryParams.toString()}`);
  }

  async createPrivacyRequest(requestData: Omit<PrivacyRequest, 'id' | 'status' | 'requestedDate'>): Promise<PrivacyRequest> {
    return ApiService.post('/data-protection/requests', requestData);
  }

  async updatePrivacyRequest(id: string, updateData: Partial<PrivacyRequest>): Promise<PrivacyRequest> {
    return ApiService.put(`/data-protection/requests/${id}`, updateData);
  }

  async getDlpPolicies(): Promise<DataLossPreventionPolicy[]> {
    return ApiService.get('/data-protection/dlp-policies');
  }

  async createDlpPolicy(policyData: Omit<DataLossPreventionPolicy, 'id' | 'lastModified'>): Promise<DataLossPreventionPolicy> {
    return ApiService.post('/data-protection/dlp-policies', policyData);
  }

  async updateDlpPolicy(id: string, updateData: Partial<DataLossPreventionPolicy>): Promise<DataLossPreventionPolicy> {
    return ApiService.put(`/data-protection/dlp-policies/${id}`, updateData);
  }

  async toggleDlpPolicy(id: string, enabled: boolean): Promise<DataLossPreventionPolicy> {
    return ApiService.put(`/data-protection/dlp-policies/${id}/toggle`, { enabled });
  }

  async getEncryptionKeys(): Promise<DataEncryptionKey[]> {
    return ApiService.get('/data-protection/encryption-keys');
  }

  async rotateEncryptionKey(id: string): Promise<DataEncryptionKey> {
    return ApiService.put(`/data-protection/encryption-keys/${id}/rotate`, {});
  }

  async getAuditTrail(params: { 
    userId?: string; 
    action?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: AuditTrailEntry[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.action) queryParams.append('action', params.action);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/data-protection/audit-trail?${queryParams.toString()}`);
  }

  async exportAuditTrail(startDate: string, endDate: string): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', startDate);
    queryParams.append('endDate', endDate);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    const token = ApiService.getToken();
    const response = await fetch(`${API_BASE_URL}/data-protection/audit-trail/export?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to export audit trail');
    }

    return response.blob();
  }
}

export default DataProtectionService.getInstance();