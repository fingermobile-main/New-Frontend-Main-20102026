import React, {} from 'react';
/**
 * AnalyticsEnhancedService
 * Frontend service for advanced analytics endpoints
 */

import api from './api';

export interface CohortData {
  cohort_period: string;
  cohort_size: number;
  retention_data: Array<{
    period_number: number;
    active_users: number;
    retention_rate: number;
  }>;
}

export interface FunnelStep {
  step_number: number;
  step_name: string;
  step_type: string;
  count: number;
  conversion_rate: number;
  drop_off: number;
  drop_off_rate: number;
}

export interface RetentionPeriod {
  period: string;
  active_users: number;
  total_events: number;
  returning_users: number;
  new_users: number;
  retention_rate: number;
}

export interface ChurnData {
  churn_week: string;
  churned_count: number;
  avg_days_inactive: number;
  early_churn: number;
}

export interface LTVData {
  cohort: string;
  user_count: number;
  total_revenue: string;
  avg_transaction_value: string;
  transaction_count: number;
  ltv_per_user: string;
}

class AnalyticsEnhancedService {
  /**
   * Get cohort analysis data
   */
  async getCohortAnalysis(params: {
    cohortDefinition?: 'weekly' | 'monthly' | 'quarterly';
    startDate?: string;
    endDate?: string;
    retentionPeriods?: number;
  } = {}) {
    const response = await api.get('/analytics/enhanced/cohort', { params });
    return response.data;
  }

  /**
   * Get funnel metrics for defined steps
   */
  async getFunnelMetrics(funnelSteps: Array<{ name: string; type: string; action?: string; event_type?: string }>, options: {
    startDate?: string;
    endDate?: string;
  } = {}) {
    const response = await api.post('/analytics/enhanced/funnel', {
      funnelSteps,
      ...options
    });
    return response.data;
  }

  /**
   * Get retention metrics over time
   */
  async getRetentionMetrics(params: {
    period?: 'daily' | 'weekly' | 'monthly';
    limit?: number;
  } = {}) {
    const response = await api.get('/analytics/enhanced/retention', { params });
    return response.data;
  }

  /**
   * Get churn analysis data
   */
  async getChurnAnalysis(params: {
    inactiveThreshold?: number;
    startDate?: string;
    endDate?: string;
  } = {}) {
    const response = await api.get('/analytics/enhanced/churn', { params });
    return response.data;
  }

  /**
   * Get lifetime value metrics
   */
  async getLifetimeValueMetrics(params: {
    cohortPeriod?: 'weekly' | 'monthly' | 'quarterly';
  } = {}) {
    const response = await api.get('/analytics/enhanced/ltv', { params });
    return response.data;
  }

  /**
   * Get comprehensive analytics dashboard data
   */
  async getDashboardData(params: {
    period?: 'daily' | 'weekly' | 'monthly';
  } = {}) {
    const response = await api.get('/analytics/enhanced/dashboard', { params });
    return response.data;
  }
}

export default new AnalyticsEnhancedService();
