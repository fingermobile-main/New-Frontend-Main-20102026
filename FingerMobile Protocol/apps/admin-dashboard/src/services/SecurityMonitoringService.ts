import ApiService from './api';

export interface SecurityAlert {
  id: string;
  type: 'malware' | 'unauthorized_access' | 'data_breach' | 'ddos' | 'phishing' | 'vulnerability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  sourceIp?: string;
  targetResource?: string;
}

export interface ThreatIntelligence {
  id: string;
  threatType: string;
  indicator: string;
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  description: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'closed' | 'resolved';
  assignedTo?: string;
  reportedAt: string;
  resolvedAt?: string;
  affectedResources: string[];
  evidence: string[];
}

export interface ComplianceReport {
  id: string;
  standard: 'gdpr' | 'hipaa' | 'sox' | 'pci_dss' | 'iso_27001' | 'soc2';
  status: 'compliant' | 'non_compliant' | 'pending';
  lastAssessment: string;
  nextAssessment: string;
  findings: {
    id: string;
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    status: 'open' | 'in_progress' | 'resolved';
  }[];
}

export interface VulnerabilityScan {
  id: string;
  name: string;
  target: string;
  status: 'scheduled' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  vulnerabilities: {
    id: string;
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    cvssScore: number;
    description: string;
    remediation: string;
  }[];
}

export interface AccessControlLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  result: 'success' | 'failure';
  reason?: string;
}

class SecurityMonitoringService {
  private static instance: SecurityMonitoringService;
  
  private constructor() {}
  
  public static getInstance(): SecurityMonitoringService {
    if (!SecurityMonitoringService.instance) {
      SecurityMonitoringService.instance = new SecurityMonitoringService();
    }
    return SecurityMonitoringService.instance;
  }

  async getSecurityAlerts(params: { 
    status?: string; 
    severity?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: SecurityAlert[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.severity) queryParams.append('severity', params.severity);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/security/alerts?${queryParams.toString()}`);
  }

  async getThreatIntelligence(params: { 
    threatType?: string; 
    confidenceMin?: number; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: ThreatIntelligence[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.threatType) queryParams.append('threatType', params.threatType);
    if (params.confidenceMin) queryParams.append('confidenceMin', params.confidenceMin.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/security/threat-intelligence?${queryParams.toString()}`);
  }

  async getSecurityIncidents(params: { 
    status?: string; 
    severity?: string; 
    assignedTo?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: SecurityIncident[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.severity) queryParams.append('severity', params.severity);
    if (params.assignedTo) queryParams.append('assignedTo', params.assignedTo);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/security/incidents?${queryParams.toString()}`);
  }

  async getComplianceReports(): Promise<ComplianceReport[]> {
    return ApiService.get('/security/compliance-reports');
  }

  async getVulnerabilityScans(params: { 
    status?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: VulnerabilityScan[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/security/vulnerability-scans?${queryParams.toString()}`);
  }

  async getAccessControlLogs(params: { 
    userId?: string; 
    action?: string; 
    result?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: AccessControlLog[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.action) queryParams.append('action', params.action);
    if (params.result) queryParams.append('result', params.result);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/security/access-control-logs?${queryParams.toString()}`);
  }

  async createSecurityAlert(alertData: Omit<SecurityAlert, 'id' | 'timestamp' | 'status'>): Promise<SecurityAlert> {
    return ApiService.post('/security/alerts', alertData);
  }

  async updateSecurityAlert(alertId: string, updateData: Partial<SecurityAlert>): Promise<SecurityAlert> {
    return ApiService.put(`/security/alerts/${alertId}`, updateData);
  }

  async resolveSecurityIncident(incidentId: string, resolutionData: { 
    resolutionNotes: string; 
    resolvedBy: string; 
  }): Promise<SecurityIncident> {
    return ApiService.put(`/security/incidents/${incidentId}/resolve`, resolutionData);
  }

  async runVulnerabilityScan(scanConfig: { 
    name: string; 
    target: string; 
    schedule?: string; 
  }): Promise<VulnerabilityScan> {
    return ApiService.post('/security/vulnerability-scans', scanConfig);
  }
}

export default SecurityMonitoringService.getInstance();