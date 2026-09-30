import { api } from './api';

export interface GuardianRule {
  id: string;
  name: string;
  category: 'fraud' | 'content' | 'security' | 'identity' | 'stercs';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  threshold_value: number;
  action: 'flag' | 'quarantine' | 'block' | 'require_2fa' | 'escalate';
  is_active: boolean;
  conditions?: Record<string, any>;
  created_at?: string;
}

export interface GuardianLog {
  id: string;
  rule_id: string;
  rule_name: string;
  target_user_id?: string;
  entity_type?: string;
  entity_id?: string;
  severity: string;
  action_taken: string;
  score?: number;
  details?: Record<string, any>;
  created_at: string;
}

export interface GuardianStatus {
  status: string;
  version: string;
  rulesTotal: number;
  rulesActive: number;
  eventsLogged: number;
  engineLatencyMs: number;
  threatLevel: string;
}

export class GuardianService {
  async getStatus(): Promise<GuardianStatus> {
    const res = await api.get('/guardian/status');
    return res.data?.data || {
      status: 'operational',
      version: 'v2.4.0',
      rulesTotal: 0,
      rulesActive: 0,
      eventsLogged: 0,
      engineLatencyMs: 14,
      threatLevel: 'low'
    };
  }

  async getRules(category?: string): Promise<GuardianRule[]> {
    const res = await api.get('/guardian/rules', { params: { category } });
    return res.data?.data || [];
  }

  async createRule(rule: Partial<GuardianRule>): Promise<GuardianRule> {
    const res = await api.post('/guardian/rules', rule);
    return res.data?.data;
  }

  async updateRule(id: string, rule: Partial<GuardianRule>): Promise<GuardianRule> {
    const res = await api.put(`/guardian/rules/${id}`, rule);
    return res.data?.data;
  }

  async deleteRule(id: string): Promise<void> {
    await api.delete(`/guardian/rules/${id}`);
  }

  async getLogs(limit: number = 50): Promise<GuardianLog[]> {
    const res = await api.get('/guardian/logs', { params: { limit } });
    return res.data?.data || [];
  }

  // Backward compatibility methods
  async assessThreats(telemetryData: any): Promise<any[]> {
    try {
      const status = await this.getStatus();
      return [
        {
          id: 'threat-1',
          severity: status.threatLevel || 'low',
          description: `Telemetry online. Active rules: ${status.rulesActive}/${status.rulesTotal}`,
          recommendations: ['Monitor auth rate limits', 'Review high velocity alerts'],
          timestamp: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  }

  async scanVulnerabilities(systemData: unknown): Promise<any[]> {
    try {
      const res = await api.get('/guardian/logs');
      return res.data?.data || [];
    } catch {
      return [];
    }
  }

  correlateEvents(events: any[]): any[] {
    return (events || []).filter(e => e.severity === 'high' || e.severity === 'critical');
  }
}

export const guardianService = new GuardianService();
export default guardianService;
