import ApiService from './api';

export interface FirewallRule {
  id: string;
  name: string;
  action: 'allow' | 'deny' | 'log';
  protocol: 'tcp' | 'udp' | 'icmp' | 'any';
  sourceIp: string;
  destinationIp: string;
  sourcePort?: number;
  destinationPort?: number;
  enabled: boolean;
  priority: number;
  description: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

export interface IntrusionDetection {
  id: string;
  type: 'port_scan' | 'brute_force' | 'dos_attack' | 'malware' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceIp: string;
  destinationIp: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'blocked' | 'resolved';
  details: {
    attackVector: string;
    indicators: string[];
    affectedSystems: string[];
  };
}

export interface NetworkTrafficAnalysis {
  id: string;
  sourceIp: string;
  destinationIp: string;
  protocol: string;
  port: number;
  bytesTransferred: number;
  sessionDuration: number; // in seconds
  timestamp: string;
  anomalyScore: number; // 0-1 scale
  classification: 'normal' | 'suspicious' | 'malicious';
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export interface VPNConnection {
  id: string;
  userId: string;
  userName: string;
  connectedAt: string;
  disconnectedAt?: string;
  ipAddress: string;
  clientVersion: string;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  status: 'connected' | 'disconnected' | 'reconnecting';
  bandwidthUsed: number; // in MB
}

export interface DNSSecurity {
  id: string;
  domain: string;
  type: 'blacklist' | 'whitelist' | 'monitor';
  status: 'active' | 'inactive' | 'pending';
  addedAt: string;
  addedBy: string;
  reason: string;
  ttl: number;
}

export interface NetworkSegment {
  id: string;
  name: string;
  cidrBlock: string;
  description: string;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  accessControlList: string[];
  vpnAccess: boolean;
  monitoringEnabled: boolean;
  createdAt: string;
}

class NetworkSecurityService {
  private static instance: NetworkSecurityService;
  
  private constructor() {}
  
  public static getInstance(): NetworkSecurityService {
    if (!NetworkSecurityService.instance) {
      NetworkSecurityService.instance = new NetworkSecurityService();
    }
    return NetworkSecurityService.instance;
  }

  async getFirewallRules(params: { 
    enabled?: boolean; 
    action?: string; 
    protocol?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: FirewallRule[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.enabled !== undefined) queryParams.append('enabled', params.enabled.toString());
    if (params.action) queryParams.append('action', params.action);
    if (params.protocol) queryParams.append('protocol', params.protocol);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/network-security/firewall-rules?${queryParams.toString()}`);
  }

  async createFirewallRule(ruleData: Omit<FirewallRule, 'id' | 'createdBy' | 'createdAt' | 'lastModified'>): Promise<FirewallRule> {
    return ApiService.post('/network-security/firewall-rules', ruleData);
  }

  async updateFirewallRule(id: string, updateData: Partial<FirewallRule>): Promise<FirewallRule> {
    return ApiService.put(`/network-security/firewall-rules/${id}`, updateData);
  }

  async deleteFirewallRule(id: string): Promise<void> {
    return ApiService.delete(`/network-security/firewall-rules/${id}`);
  }

  async getIntrusionDetectionEvents(params: { 
    status?: string; 
    severity?: string; 
    type?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: IntrusionDetection[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.severity) queryParams.append('severity', params.severity);
    if (params.type) queryParams.append('type', params.type);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/network-security/intrusion-detection?${queryParams.toString()}`);
  }

  async blockIp(ipAddress: string, reason: string, durationHours?: number): Promise<void> {
    return ApiService.post('/network-security/block-ip', { 
      ipAddress, 
      reason, 
      durationHours 
    });
  }

  async unblockIp(ipAddress: string): Promise<void> {
    return ApiService.delete(`/network-security/block-ip/${ipAddress}`);
  }

  async getNetworkTraffic(params: { 
    classification?: string; 
    threatLevel?: string; 
    sourceIp?: string; 
    destinationIp?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: NetworkTrafficAnalysis[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.classification) queryParams.append('classification', params.classification);
    if (params.threatLevel) queryParams.append('threatLevel', params.threatLevel);
    if (params.sourceIp) queryParams.append('sourceIp', params.sourceIp);
    if (params.destinationIp) queryParams.append('destinationIp', params.destinationIp);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/network-security/traffic-analysis?${queryParams.toString()}`);
  }

  async getVpnConnections(params: { 
    status?: string; 
    userId?: string; 
    country?: string; 
    startDate?: string; 
    endDate?: string; 
    limit?: number; 
    offset?: number; 
  } = {}): Promise<{ data: VPNConnection[]; totalCount: number }> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.country) queryParams.append('country', params.country);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    return ApiService.get(`/network-security/vpn-connections?${queryParams.toString()}`);
  }

  async getDnsSecurityRules(): Promise<DNSSecurity[]> {
    return ApiService.get('/network-security/dns-security');
  }

  async createDnsSecurityRule(ruleData: Omit<DNSSecurity, 'id' | 'addedAt' | 'addedBy'>): Promise<DNSSecurity> {
    return ApiService.post('/network-security/dns-security', ruleData);
  }

  async deleteDnsSecurityRule(id: string): Promise<void> {
    return ApiService.delete(`/network-security/dns-security/${id}`);
  }

  async getNetworkSegments(): Promise<NetworkSegment[]> {
    return ApiService.get('/network-security/network-segments');
  }

  async createNetworkSegment(segmentData: Omit<NetworkSegment, 'id' | 'createdAt'>): Promise<NetworkSegment> {
    return ApiService.post('/network-security/network-segments', segmentData);
  }

  async updateNetworkSegment(id: string, updateData: Partial<NetworkSegment>): Promise<NetworkSegment> {
    return ApiService.put(`/network-security/network-segments/${id}`, updateData);
  }

  async getSecurityStatistics(): Promise<{
    totalBlockedIps: number;
    totalFirewallRules: number;
    activeVpnConnections: number;
    intrusionAttempts: number;
    suspiciousDomains: number;
  }> {
    return ApiService.get('/network-security/statistics');
  }
}

export default NetworkSecurityService.getInstance();