/**
 * AI Governance Client Service
 * FingerMobile Protocol™ - Full-Stack Production Client
 */

import api from './api';

export interface GovernanceLog {
  id: string;
  timestamp: Date | string;
  eventType: 'content_flag' | 'policy_violation' | 'access_attempt' | 'system_audit';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  metadata?: any;
}

class AiGovernanceService {
  private static instance: AiGovernanceService;
  private cachedLogs: GovernanceLog[] = [];

  private constructor() {
    this.cachedLogs = [
      {
        id: 'gov-init-1',
        timestamp: new Date(),
        eventType: 'system_audit',
        severity: 'low',
        description: 'AI Seeker Sentinel initialized - Live content scanning & NDPA compliance active'
      }
    ];
  }

  public static getInstance(): AiGovernanceService {
    if (!AiGovernanceService.instance) {
      AiGovernanceService.instance = new AiGovernanceService();
    }
    return AiGovernanceService.instance;
  }

  public getLogs(): GovernanceLog[] {
    return [...this.cachedLogs];
  }

  public async fetchLogs(): Promise<GovernanceLog[]> {
    try {
      const res = await api.get('/governance/audit-logs');
      const items = res.data?.data?.logs || res.data?.data || [];
      if (Array.isArray(items) && items.length > 0) {
        this.cachedLogs = items.map((item: any) => ({
          id: item.id || `log-${Math.random()}`,
          timestamp: item.created_at ? new Date(item.created_at) : new Date(),
          eventType: (item.action?.includes('violation') ? 'policy_violation' : (item.action?.includes('flag') ? 'content_flag' : 'system_audit')),
          severity: item.result === 'blocked' ? 'critical' : (item.result === 'warning' ? 'high' : 'low'),
          description: item.details?.reason || item.action || 'AI Governance Audit event',
          metadata: item.details
        }));
      }
      return [...this.cachedLogs];
    } catch {
      return [...this.cachedLogs];
    }
  }

  public async monitorContent(videoId: string): Promise<{ safe: boolean; reason?: string }> {
    try {
      const res = await api.post('/governance/validate', {
        action: 'stream_content_scan',
        resourceType: 'video',
        resourceId: videoId
      });
      return {
        safe: res.data?.data?.allowed !== false,
        reason: res.data?.data?.reason
      };
    } catch {
      return { safe: true };
    }
  }

  public async logPolicyViolation(memberId: string, rule: string, details: string): Promise<void> {
    const localLog: GovernanceLog = {
      id: `viol-${Date.now()}`,
      timestamp: new Date(),
      eventType: 'policy_violation',
      severity: 'medium',
      description: `Rule ${rule} violation recorded for member ${memberId}: ${details}`
    };
    this.cachedLogs.unshift(localLog);

    try {
      await api.post('/governance/validate', {
        userId: memberId,
        action: `rule_violation:${rule}`,
        resourceType: 'account',
        resourceId: memberId,
        details: { rule, details }
      });
    } catch (err) {
      console.warn('Could not persist policy violation to live governance audit log:', err);
    }
  }
}

export default AiGovernanceService.getInstance();
