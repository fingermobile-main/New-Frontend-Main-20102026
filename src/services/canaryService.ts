import React, {} from 'react';
/**
 * Canary Service - Monitoring and Alerting
 * Handles system health checks and alert notifications
 */

import { api } from './api';

export interface CanaryCheck {id: string; name: string;
  endpoint: string;
  status: 'healthy' | 'degraded' | 'down';
  response_time: number;
  last_checked: string;
  uptime_percentage: number;
}

export interface CanaryAlert {id: string; check_id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface CanaryMetrics {total_checks: number; healthy_checks: number;
  degraded_checks: number;
  down_checks: number;
  average_response_time: number;
  overall_uptime: number;
}

class CanaryService {
  private baseUrl = '/api/canary';

  async getAllChecks(): Promise<CanaryCheck[]> {
    const response = await api.get(`${this.baseUrl}/checks`);
    return response.data;
  }

  async getCheck(checkId: string): Promise<CanaryCheck> {
    const response = await api.get(`${this.baseUrl}/checks/${checkId}`);
    return response.data;
  }

  async runCheck(checkId: string): Promise<CanaryCheck> {
    const response = await api.post(`${this.baseUrl}/checks/${checkId}/run`);
    return response.data;
  }

  async getAlerts(page = 1, limit = 20): Promise<{alerts: CanaryAlert[], total: number }> {
    const response = await api.get(`${this.baseUrl}/alerts`, {params: { page,
  limit }
    });
    return response.data;
  }

  async resolveAlert(alertId: string): Promise<void> {
    await api.post(`${this.baseUrl}/alerts/${alertId}/resolve`);
  }

  async getMetrics(): Promise<CanaryMetrics> {
    const response = await api.get(`${this.baseUrl}/metrics`);
    return response.data;
  }

  async getStatus(): Promise<{status: string; checks_count: number;
  alerts_count: number }> {
    const response = await api.get(`${this.baseUrl}/status`);
    return response.data;
  }
}

export const canaryService = new CanaryService();
