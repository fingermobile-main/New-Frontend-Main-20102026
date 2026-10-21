/**
 * Canary Deployment Type Definitions
 * Type interfaces for canary deployment monitoring, anomaly detection, and ML predictions
 */

// ============================================================================
// DEPLOYMENT FEATURE TYPES
// ============================================================================

/**
 * Deployment features used for ML-based success prediction
 */
export interface DeploymentFeatures {
  id: string;
  service_name: string;
  target_percentage: number;
  current_percentage: number;
  hours_elapsed: number;
  critical_alerts: number;
  warning_alerts: number;
  avg_error_rate?: number;
  avg_response_time?: number;
  error_rate_variance?: number;
  last_error_update?: Date;
  historical_success_rate?: number;
  total_deployments?: number;
  successful_deployments?: number;
}

/**
 * Risk assessment result from ML prediction
 */
export interface RiskAssessment {
  success_probability: number;
  predicted_outcome: 'likely_success' | 'uncertain' | 'likely_failure';
  confidence_level: 'low' | 'medium' | 'high';
  risk_factors: string[];
  recommendations: string[];
}

// ============================================================================
// ANOMALY DETECTION TYPES
// ============================================================================

/**
 * Anomaly row from statistical detection
 */
export interface AnomalyRow {
  id: string;
  deployment_id: string;
  metric_type: string;
  metric_value: number;
  baseline_mean: number;
  baseline_stddev: number;
  p95_value: number;
  z_score: number;
  is_statistical_anomaly: boolean;
  anomaly_direction: 'above_normal' | 'below_normal';
  anomaly_severity: number;
  created_at: Date;
  metadata_json?: Record<string, unknown>;
}

/**
 * Anomaly summary grouped by metric type
 */
export interface AnomalySummary {
  metric_type: string;
  anomaly_count: number;
  max_z_score: number;
  avg_deviation: number;
  first_detected: Date;
  latest_detected: Date;
}

// ============================================================================
// ROLLOUT RECOMMENDATION TYPES
// ============================================================================

/**
 * Rollout recommendation with action and reasoning
 */
export interface RolloutRecommendation {
  action: 'proceed' | 'pause' | 'rollback' | 'complete';
  next_percentage: number | null;
  reasoning: string[];
  estimated_time_to_complete: string | null;
}

/**
 * Deployment state with metrics trend analysis
 */
export interface DeploymentStateWithTrend {
  id: string;
  service_name: string;
  target_percentage: number;
  current_percentage: number;
  status: string;
  critical_alerts_last_hour: number;
  warning_alerts_last_hour: number;
  recent_error_rate?: number;
  recent_response_time?: number;
  previous_error_rate?: number;
  previous_response_time?: number;
  error_rate_change_pct: number;
  response_time_change_pct: number;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// DEPLOYMENT METRICS TYPES
// ============================================================================

/**
 * Valid metric types for canary monitoring
 */
export type MetricType =
  | 'error_rate'
  | 'response_time'
  | 'cpu_usage'
  | 'memory_usage'
  | 'request_count'
  | 'latency_p50'
  | 'latency_p95'
  | 'latency_p99'
  | 'throughput'
  | 'success_rate';

/**
 * Metric recording payload
 */
export interface MetricRecord {
  metric_type: MetricType;
  metric_value: number;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// ALERT SUBSCRIPTION TYPES
// ============================================================================

/**
 * Alert subscription update fields
 */
export interface SubscriptionUpdate {
  notification_method?: 'email' | 'sms' | 'webhook' | 'slack';
  alert_threshold?: number;
  is_active?: boolean;
}
