/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';
import unifiedMLService from '../services/UnifiedMLService';
import { 
  AuthenticatedRequest,
  QueryParams
} from '../types/database.types';
import { 
  DeploymentFeatures as CanaryDeploymentFeatures,
  RiskAssessment as CanaryRiskAssessment,
  AnomalyRow as CanaryAnomalyRow,
  AnomalySummary as CanaryAnomalySummary,
  RolloutRecommendation as CanaryRolloutRecommendation,
  DeploymentStateWithTrend as CanaryDeploymentState,
  MetricType,
  MetricRecord as CanaryMetricRecord,
  SubscriptionUpdate as CanarySubscriptionUpdate
} from '../types/canary.types';

/**
 * CanaryController
 * Canary deployment monitoring - Feature flags, gradual rollouts, ML-based anomaly detection
 * ALSO: Trending/viral content prediction using engagement velocity analysis
 * ML-Optimized: Deployment success prediction, performance anomaly detection, viral content forecasting
 */

class CanaryController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * GET /api/canary/trending
   * Get trending/viral content using ML-based velocity analysis
   * Predicts viral potential using engagement patterns and recency
   */
  async getTrendingContent(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 20, timeframe = '24h', category, use_ml = true } = req.query;
      
      // Use ML-based viral prediction
      if (use_ml === 'true') {
        const trendingItems = await unifiedMLService.getCanaryRecommendations({
          limit: parseInt(limit as string),
          timeframe: timeframe as string,
          category: category as string,
          useML: true
        });
        
        res.json({
          success: true,
          data: trendingItems,
          algorithm: 'ml_viral_prediction',
          metadata: {
            prediction_factors: [
              'engagement_velocity',
              'interaction_ratio',
              'recency_score',
              'category_diversity'
            ],
            ml_model_version: '1.0',
            confidence_threshold: 0.7
          },
          pagination: {
            limit: parseInt(limit as string)
          }
        });
        return;
      }
      
      // Fallback to basic trending algorithm
      const timeInterval = this.parseTimeframe(timeframe as string);
      
      const query = `
        SELECT 
          c.*,
          COUNT(DISTINCT l.id) as likes_count,
          COUNT(DISTINCT cm.id) as comments_count,
          COUNT(DISTINCT s.id) as shares_count,
          COUNT(DISTINCT v.id) as views_count,
          (
            COUNT(DISTINCT l.id) * 1.0 +
            COUNT(DISTINCT cm.id) * 2.0 +
            COUNT(DISTINCT s.id) * 3.0
          ) / NULLIF(EXTRACT(EPOCH FROM (NOW() - c.created_at)) / 3600, 0) as velocity_score
        FROM content c
        LEFT JOIN likes l ON l.target_id = c.id AND l.target_type = 'content'
        LEFT JOIN comments cm ON cm.content_id = c.id
        LEFT JOIN shares s ON s.target_id = c.id AND s.target_type = 'content'
        LEFT JOIN views v ON v.content_id = c.id AND v.created_at > NOW() - INTERVAL '${timeInterval}'
        WHERE c.created_at > NOW() - INTERVAL '7 days'
        ${category ? 'AND c.category = $1' : ''}
        GROUP BY c.id
        HAVING COUNT(DISTINCT v.id) > 0
        ORDER BY velocity_score DESC
        LIMIT $${category ? 2 : 1}
      `;
      
      const params = category ? [category, parseInt(limit as string)] : [parseInt(limit as string)];
      const result = await this.db.query(query, params);
      
      res.json({
        success: true,
        data: result.rows,
        algorithm: 'velocity_based_trending',
        pagination: {
          limit: parseInt(limit as string)
        }
      });
    } catch (error) {
      logger.error('CanaryController.getTrendingContent error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve trending content',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Helper: Parse timeframe string
   */
  private parseTimeframe(timeframe: string): string {
    const mapping: Record<string, string> = {
      '1h': '1 hour',
      '6h': '6 hours',
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days'
    };
    return mapping[timeframe] || '24 hours';
  }

  /**
   * GET /api/canary/deployments/active
   * Get active canary deployments with health metrics and ML-based risk assessment
   */
  async getActiveDeployments(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 20, offset = 0, status, service_name } = req.query;
      
      const query = `
        SELECT cd.*,
               COUNT(DISTINCT ca.id) as alert_count,
               COUNT(DISTINCT CASE WHEN ca.severity = 'critical' THEN ca.id END) as critical_alerts,
               COUNT(DISTINCT CASE WHEN ca.severity = 'warning' THEN ca.id END) as warning_alerts,
               AVG(ca.response_time_ms) FILTER (WHERE ca.metric_type = 'response_time') as avg_response_time,
               AVG(ca.error_rate) FILTER (WHERE ca.metric_type = 'error_rate') as avg_error_rate,
               -- Health score calculation (0-100)
               GREATEST(0, LEAST(100,
                 100 
                 - (COUNT(DISTINCT CASE WHEN ca.severity = 'critical' THEN ca.id END) * 20)
                 - (COUNT(DISTINCT CASE WHEN ca.severity = 'warning' THEN ca.id END) * 5)
                 - (COALESCE(AVG(ca.error_rate) FILTER (WHERE ca.metric_type = 'error_rate'), 0) * 100)
               )) as health_score,
               -- Risk assessment based on metrics trends
               CASE 
                 WHEN COUNT(DISTINCT CASE WHEN ca.severity = 'critical' THEN ca.id END) > 0 THEN 'high_risk'
                 WHEN COUNT(DISTINCT CASE WHEN ca.severity = 'warning' THEN ca.id END) > 3 THEN 'medium_risk'
                 WHEN COALESCE(AVG(ca.error_rate) FILTER (WHERE ca.metric_type = 'error_rate'), 0) > 0.05 THEN 'medium_risk'
                 ELSE 'low_risk'
               END as risk_level
        FROM canary_deployments cd
        LEFT JOIN canary_alerts ca ON ca.deployment_id = cd.id 
          AND ca.created_at > NOW() - INTERVAL '1 hour'
        WHERE cd.status = 'active'
        ${status ? 'AND cd.status = $1' : ''}
        ${service_name ? 'AND cd.service_name = $' + (status ? 2 : 1) : ''}
        GROUP BY cd.id
        ORDER BY cd.created_at DESC
        LIMIT $${status && service_name ? 4 : (status || service_name ? 3 : 2)} OFFSET $${status && service_name ? 5 : (status || service_name ? 4 : 3)}
      `;
      
      const params: (string | number)[] = [parseInt(limit as string), parseInt(offset as string)];
      let paramIndex = 3;
      
      if (status) {
        params.splice(0, 0, status as string);
        paramIndex++;
      }
      
      if (service_name) {
        params.splice(status ? 1 : 0, 0, service_name as string);
      }

      const result = await this.db.query(query, params);

      // Calculate deployment success probability using historical data
      for (const deployment of result.rows) {
        deployment.success_probability = await this.calculateDeploymentSuccessProbability(deployment.id);
      }

      res.json({
        success: true,
        data: result.rows,
        algorithm: 'ml_risk_assessment',
        metadata: {
          risk_factors: [
            'critical_alert_count',
            'warning_alert_count',
            'error_rate_trend',
            'response_time_degradation',
            'historical_success_rate'
          ],
          health_score_formula: '100 - (critical_alerts * 20) - (warnings * 5) - (error_rate * 100)'
        },
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      });
    } catch (error) {
      logger.error('CanaryController.getActiveDeployments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve active deployments',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/canary/anomalies
   * Detect anomalies in deployment metrics using statistical analysis
   */
  async detectAnomalies(req: Request, res: Response): Promise<void> {
    try {
      const { deployment_id, hours = 24, threshold_stddev = 2.0 } = req.query;
      
      // Statistical anomaly detection using standard deviation
      const anomalyQuery = `
        WITH baseline_metrics AS (
          -- Calculate baseline statistics (mean and stddev) for normal operation
          SELECT 
            metric_type,
            AVG(metric_value) as baseline_mean,
            STDDEV(metric_value) as baseline_stddev,
            PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metric_value) as p95_value
          FROM canary_metrics
          WHERE deployment_id = $1
            AND created_at BETWEEN NOW() - INTERVAL '$2 hours' * 2 
                               AND NOW() - INTERVAL '$2 hours'
            AND is_anomaly = false
          GROUP BY metric_type
        ),
        recent_metrics AS (
          -- Get recent metrics to compare against baseline
          SELECT 
            cm.*,
            bm.baseline_mean,
            bm.baseline_stddev,
            bm.p95_value,
            -- Calculate z-score (standard deviations from mean)
            CASE 
              WHEN bm.baseline_stddev > 0 
              THEN (cm.metric_value - bm.baseline_mean) / bm.baseline_stddev
              ELSE 0
            END as z_score,
            -- Determine if value is anomalous
            CASE 
              WHEN bm.baseline_stddev > 0 
                   AND ABS((cm.metric_value - bm.baseline_mean) / bm.baseline_stddev) > $3
              THEN true
              ELSE false
            END as is_statistical_anomaly
          FROM canary_metrics cm
          JOIN baseline_metrics bm ON bm.metric_type = cm.metric_type
          WHERE cm.deployment_id = $1
            AND cm.created_at > NOW() - INTERVAL '$2 hours'
        )
        SELECT rm.*,
               CASE 
                 WHEN rm.z_score > 0 THEN 'above_normal'
                 ELSE 'below_normal'
               END as anomaly_direction,
               ABS(rm.z_score) as anomaly_severity
        FROM recent_metrics rm
        WHERE rm.is_statistical_anomaly = true
        ORDER BY ABS(rm.z_score) DESC, rm.created_at DESC
      `;
      
      const result = await this.db.query(anomalyQuery, [
        deployment_id,
        parseInt(hours as string),
        parseFloat(threshold_stddev as string)
      ]);

      // Group anomalies by metric type for summary
      const anomalySummary: Record<string, CanaryAnomalySummary> = {};
      result.rows.forEach((row: CanaryAnomalyRow) => {
        if (!anomalySummary[row.metric_type]) {
          anomalySummary[row.metric_type] = {
            metric_type: row.metric_type,
            anomaly_count: 0,
            max_z_score: 0,
            avg_deviation: 0,
            first_detected: row.created_at,
            latest_detected: row.created_at
          };
        }
        
        anomalySummary[row.metric_type].anomaly_count++;
        anomalySummary[row.metric_type].max_z_score = Math.max(
          anomalySummary[row.metric_type].max_z_score,
          Math.abs(row.z_score)
        );
        anomalySummary[row.metric_type].avg_deviation += Math.abs(row.z_score);
        
        if (new Date(row.created_at) < new Date(anomalySummary[row.metric_type].first_detected)) {
          anomalySummary[row.metric_type].first_detected = row.created_at;
        }
        if (new Date(row.created_at) > new Date(anomalySummary[row.metric_type].latest_detected)) {
          anomalySummary[row.metric_type].latest_detected = row.created_at;
        }
      });
      
      // Calculate averages
      Object.values(anomalySummary).forEach((summary: CanaryAnomalySummary) => {
        summary.avg_deviation = summary.avg_deviation / summary.anomaly_count;
      });

      res.json({
        success: true,
        anomalies: result.rows,
        summary: Object.values(anomalySummary),
        algorithm: 'statistical_zscore_detection',
        metadata: {
          detection_method: 'z_score_analysis',
          threshold_stddev: parseFloat(threshold_stddev as string),
          time_window_hours: parseInt(hours as string),
          total_anomalies_detected: result.rows.length,
          unique_metric_types_affected: Object.keys(anomalySummary).length
        }
      });
    } catch (error) {
      logger.error('CanaryController.detectAnomalies error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to detect anomalies',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/canary/predictions/:deployment_id
   * Predict deployment success/failure using ML model features
   */
  async predictDeploymentOutcome(req: Request, res: Response): Promise<void> {
    try {
      const { deployment_id } = req.params;
      
      // Gather features for ML prediction
      const featuresQuery = `
        WITH deployment_features AS (
          SELECT 
            cd.id,
            cd.service_name,
            cd.target_percentage,
            cd.current_percentage,
            EXTRACT(EPOCH FROM (NOW() - cd.created_at)) / 3600 as hours_elapsed,
            COUNT(DISTINCT ca.id) FILTER (WHERE ca.severity = 'critical') as critical_alerts,
            COUNT(DISTINCT ca.id) FILTER (WHERE ca.severity = 'warning') as warning_alerts,
            AVG(cm.metric_value) FILTER (WHERE cm.metric_type = 'error_rate') as avg_error_rate,
            AVG(cm.metric_value) FILTER (WHERE cm.metric_type = 'response_time') as avg_response_time,
            STDDEV(cm.metric_value) FILTER (WHERE cm.metric_type = 'error_rate') as error_rate_variance,
            MAX(cm.created_at) FILTER (WHERE cm.metric_type = 'error_rate') as last_error_update
          FROM canary_deployments cd
          LEFT JOIN canary_alerts ca ON ca.deployment_id = cd.id
            AND ca.created_at > NOW() - INTERVAL '1 hour'
          LEFT JOIN canary_metrics cm ON cm.deployment_id = cd.id
            AND cm.created_at > NOW() - INTERVAL '1 hour'
          WHERE cd.id = $1
          GROUP BY cd.id, cd.service_name, cd.target_percentage, cd.current_percentage, cd.created_at
        ),
        historical_context AS (
          -- Get historical success rate for this service
          SELECT 
            cd2.service_name,
            COUNT(*) as total_deployments,
            COUNT(*) FILTER (WHERE cd2.final_status = 'success') as successful_deployments,
            ROUND(
              COUNT(*) FILTER (WHERE cd2.final_status = 'success')::numeric / NULLIF(COUNT(*), 0) * 100,
              2
            ) as historical_success_rate
          FROM canary_deployments cd2
          WHERE cd2.service_name = (SELECT service_name FROM deployment_features)
            AND cd2.created_at > NOW() - INTERVAL '90 days'
          GROUP BY cd2.service_name
        )
        SELECT df.*, hc.*
        FROM deployment_features df
        CROSS JOIN historical_context hc
      `;
      
      const featuresResult = await this.db.query(featuresQuery, [deployment_id]);
      
      if (!featuresResult.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Deployment not found'
        });
        return;
      }
      
      const features = featuresResult.rows[0];
      
      // Calculate success probability using weighted feature scoring
      // In production, this would use a trained ML model
      const successProbability = this.calculateSuccessProbability(features);

      res.json({
        success: true,
        deployment_id,
        prediction: {
          success_probability: successProbability,
          predicted_outcome: successProbability >= 0.7 ? 'likely_success' : 
                            successProbability >= 0.4 ? 'uncertain' : 'likely_failure',
          confidence_level: this.calculateConfidenceLevel(features),
          risk_factors: this.identifyRiskFactors(features),
          recommendations: this.generateRecommendations(features, successProbability)
        },
        features_used: {
          critical_alerts: features.critical_alerts,
          warning_alerts: features.warning_alerts,
          avg_error_rate: features.avg_error_rate,
          error_rate_variance: features.error_rate_variance,
          hours_elapsed: features.hours_elapsed,
          current_percentage: features.current_percentage,
          historical_success_rate: features.historical_success_rate
        },
        algorithm: 'weighted_feature_scoring_ml_ready',
        metadata: {
          note: 'This uses heuristic scoring. For production, integrate with trained ML model (e.g., XGBoost, Random Forest)',
          ml_integration_ready: true,
          required_training_data: 'Historical deployment outcomes with feature vectors'
        }
      });
    } catch (error) {
      logger.error('CanaryController.predictDeploymentOutcome error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate prediction',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/canary/:deployment_id/metrics
   * Record deployment metrics for ML training and monitoring
   */
  async recordMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { deployment_id } = req.params;
      const { metric_type, metric_value, metadata } = req.body;
      
      const validMetricTypes = [
        'error_rate', 'response_time', 'cpu_usage', 'memory_usage',
        'request_count', 'latency_p50', 'latency_p95', 'latency_p99',
        'throughput', 'success_rate'
      ];
      
      if (!validMetricTypes.includes(metric_type)) {
        res.status(400).json({
          success: false,
          message: `Invalid metric type. Must be one of: ${validMetricTypes.join(', ')}`
        });
        return;
      }
      
      if (typeof metric_value !== 'number' || isNaN(metric_value)) {
        res.status(400).json({
          success: false,
          message: 'metric_value must be a valid number'
        });
        return;
      }
      
      const query = `
        INSERT INTO canary_metrics (
          deployment_id, metric_type, metric_value, metadata_json,
          is_anomaly, created_at
        )
        VALUES ($1, $2, $3, $4, false, NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, [
        deployment_id,
        metric_type,
        metric_value,
        metadata ? JSON.stringify(metadata) : null
      ]);

      // Check if this metric represents an anomaly
      await this.checkForAnomaly(deployment_id as string, metric_type as string, metric_value);

      res.json({
        success: true,
        message: 'Metrics recorded successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('CanaryController.recordMetrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/canary/rollout-recommendations
   * Get ML-based recommendations for rollout progression
   */
  async getRolloutRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { deployment_id } = req.query;
      
      if (!deployment_id) {
        res.status(400).json({
          success: false,
          message: 'deployment_id is required'
        });
        return;
      }
      
      // Analyze current deployment state and metrics trends
      const analysisQuery = `
        WITH current_state AS (
          SELECT 
            cd.*,
            COUNT(DISTINCT ca.id) FILTER (WHERE ca.severity = 'critical') as critical_alerts_last_hour,
            COUNT(DISTINCT ca.id) FILTER (WHERE ca.severity = 'warning') as warning_alerts_last_hour,
            AVG(cm.metric_value) FILTER (WHERE cm.metric_type = 'error_rate' 
              AND cm.created_at > NOW() - INTERVAL '30 minutes') as recent_error_rate,
            AVG(cm.metric_value) FILTER (WHERE cm.metric_type = 'response_time'
              AND cm.created_at > NOW() - INTERVAL '30 minutes') as recent_response_time
          FROM canary_deployments cd
          LEFT JOIN canary_alerts ca ON ca.deployment_id = cd.id
            AND ca.created_at > NOW() - INTERVAL '1 hour'
          LEFT JOIN canary_metrics cm ON cm.deployment_id = cd.id
            AND cm.created_at > NOW() - INTERVAL '30 minutes'
          WHERE cd.id = $1
          GROUP BY cd.id
        ),
        trend_analysis AS (
          -- Compare recent vs older metrics to detect trends
          SELECT 
            cs.*,
            AVG(cm_old.metric_value) FILTER (WHERE cm_old.metric_type = 'error_rate'
              AND cm_old.created_at BETWEEN NOW() - INTERVAL '2 hours' AND NOW() - INTERVAL '1 hour') as previous_error_rate,
            AVG(cm_old.metric_value) FILTER (WHERE cm_old.metric_type = 'response_time'
              AND cm_old.created_at BETWEEN NOW() - INTERVAL '2 hours' AND NOW() - INTERVAL '1 hour') as previous_response_time
          FROM current_state cs
          LEFT JOIN canary_metrics cm_old ON cm_old.deployment_id = cs.id
          GROUP BY cs.id, cs.service_name, cs.target_percentage, cs.current_percentage,
                   cs.status, cs.created_at, cs.updated_at, cs.critical_alerts_last_hour,
                   cs.warning_alerts_last_hour, cs.recent_error_rate, cs.recent_response_time
        )
        SELECT ta.*,
               CASE 
                 WHEN ta.previous_error_rate IS NOT NULL 
                 THEN (ta.recent_error_rate - ta.previous_error_rate) / NULLIF(ta.previous_error_rate, 0) * 100
                 ELSE 0
               END as error_rate_change_pct,
               CASE 
                 WHEN ta.previous_response_time IS NOT NULL
                 THEN (ta.recent_response_time - ta.previous_response_time) / NULLIF(ta.previous_response_time, 0) * 100
                 ELSE 0
               END as response_time_change_pct
        FROM trend_analysis ta
      `;
      
      const result = await this.db.query(analysisQuery, [deployment_id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Deployment not found'
        });
        return;
      }
      
      const deployment = result.rows[0];
      const recommendation = this.generateRolloutRecommendation(deployment);

      res.json({
        success: true,
        deployment_id,
        current_state: {
          current_percentage: deployment.current_percentage,
          target_percentage: deployment.target_percentage,
          status: deployment.status
        },
        metrics_trend: {
          error_rate_change_pct: deployment.error_rate_change_pct,
          response_time_change_pct: deployment.response_time_change_pct,
          recent_error_rate: deployment.recent_error_rate,
          recent_response_time: deployment.recent_response_time
        },
        alerts_summary: {
          critical_last_hour: deployment.critical_alerts_last_hour,
          warning_last_hour: deployment.warning_alerts_last_hour
        },
        recommendation,
        algorithm: 'trend_based_rollout_optimization',
        metadata: {
          decision_factors: [
            'alert_severity',
            'error_rate_trend',
            'response_time_trend',
            'current_rollout_percentage',
            'time_in_current_stage'
          ]
        }
      });
    } catch (error) {
      logger.error('CanaryController.getRolloutRecommendations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate rollout recommendations',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: getAll
   * Get all canary deployments with filtering
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        service_name,
        final_status,
        sort_by = 'created_at',
        order = 'DESC'
      } = req.query;
      
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      let query = `
        SELECT cd.*,
               COUNT(DISTINCT ca.id) as total_alerts,
               COUNT(DISTINCT cm.id) as total_metrics
        FROM canary_deployments cd
        LEFT JOIN canary_alerts ca ON ca.deployment_id = cd.id
        LEFT JOIN canary_metrics cm ON cm.deployment_id = cd.id
      `;
      
      const conditions: string[] = [];
      const params: (string | number)[] = [];
      let paramIndex = 1;
      
      if (status) {
        conditions.push(`cd.status = $${paramIndex}`);
        params.push(status as string);
        paramIndex++;
      }
      
      if (service_name) {
        conditions.push(`cd.service_name = $${paramIndex}`);
        params.push(service_name as string);
        paramIndex++;
      }
      
      if (final_status) {
        conditions.push(`cd.final_status = $${paramIndex}`);
        params.push(final_status as string);
        paramIndex++;
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      query += ` GROUP BY cd.id`;
      
      // Dynamic sorting
      const validSortFields = ['created_at', 'updated_at', 'current_percentage'];
      const sortField = validSortFields.includes(sort_by as string) ? sort_by : 'created_at';
      const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';
      
      query += ` ORDER BY ${sortField} ${sortOrder}`;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit as string), offset);
      
      const result = await this.db.query(query, params);
      
      // Get total count
      let countQuery = `SELECT COUNT(*) as total FROM canary_deployments cd`;
      const countParams: QueryParams = [];
      let countParamIndex = 1;
      
      if (status) {
        countQuery += ` WHERE cd.status = $${countParamIndex}`;
        countParams.push(status as string);
        countParamIndex++;
      }
      
      if (service_name) {
        countQuery += status ? ' AND' : ' WHERE';
        countQuery += ` cd.service_name = $${countParamIndex}`;
        countParams.push(service_name as string);
        countParamIndex++;
      }
      
      if (final_status) {
        countQuery += status || service_name ? ' AND' : ' WHERE';
        countQuery += ` cd.final_status = $${countParamIndex}`;
        countParams.push(final_status as string);
        countParamIndex++;
      }

      const countResult = await this.db.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].total);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
          itemsPerPage: parseInt(limit as string)
        }
      });
    } catch (error) {
      logger.error('CanaryController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve deployments',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: getById
   * Get single deployment with full details
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const query = `
        SELECT cd.*,
               COUNT(DISTINCT ca.id) as total_alerts,
               COUNT(DISTINCT CASE WHEN ca.severity = 'critical' THEN ca.id END) as critical_alerts,
               COUNT(DISTINCT CASE WHEN ca.severity = 'warning' THEN ca.id END) as warning_alerts
        FROM canary_deployments cd
        LEFT JOIN canary_alerts ca ON ca.deployment_id = cd.id
        WHERE cd.id = $1
        GROUP BY cd.id
      `;
      
      const result = await this.db.query(query, [id]);

      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Deployment not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('CanaryController.getById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve deployment',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/canary/create
   * Create new canary deployment
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const {
        service_name,
        version,
        target_percentage,
        initial_percentage = 5,
        rollout_stages,
        auto_rollback_enabled = true,
        rollback_threshold_error_rate = 5.0,
        rollback_threshold_response_time = 500
      } = req.body;
      
      if (!service_name || !version || !target_percentage) {
        res.status(400).json({
          success: false,
          message: 'service_name, version, and target_percentage are required'
        });
        return;
      }

      const query = `
        INSERT INTO canary_deployments (
          service_name, version, target_percentage, current_percentage,
          initial_percentage, rollout_stages, auto_rollback_enabled,
          rollback_threshold_error_rate, rollback_threshold_response_time,
          status, final_status, created_by, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', null, $10, NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, [
        service_name,
        version,
        parseFloat(target_percentage as string),
        parseFloat(initial_percentage as string),
        JSON.stringify(rollout_stages || [5, 10, 25, 50, 75, 100]),
        auto_rollback_enabled,
        parseFloat(rollback_threshold_error_rate as string),
        parseFloat(rollback_threshold_response_time as string),
        userId
      ]);

      res.status(201).json({
        success: true,
        message: 'Canary deployment created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('CanaryController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create deployment',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Helper: Calculate deployment success probability
   */
  private async calculateDeploymentSuccessProbability(deploymentId: string): Promise<number> {
    try {
      const query = `
        SELECT 
          COUNT(*) FILTER (WHERE severity = 'critical') as critical_alerts,
          COUNT(*) FILTER (WHERE severity = 'warning') as warning_alerts,
          AVG(metric_value) FILTER (WHERE metric_type = 'error_rate') as avg_error_rate
        FROM canary_alerts ca
        FULL OUTER JOIN canary_metrics cm ON cm.deployment_id = ca.deployment_id
        WHERE ca.deployment_id = $1 OR cm.deployment_id = $1
      `;
      
      const result = await this.db.query(query, [deploymentId]);
      const stats = result.rows[0];
      
      // Heuristic probability calculation
      let probability = 1.0;
      
      // Reduce probability based on critical alerts
      probability -= (stats.critical_alerts || 0) * 0.15;
      
      // Reduce probability based on warning alerts
      probability -= (stats.warning_alerts || 0) * 0.05;
      
      // Reduce probability based on error rate
      probability -= (stats.avg_error_rate || 0) * 2;
      
      return Math.max(0, Math.min(1, probability));
    } catch (error) {
      logger.error('calculateDeploymentSuccessProbability error:', error);
      return 0.5; // Default to uncertain
    }
  }

  /**
   * Helper: Calculate success probability using feature scoring
   */
  private calculateSuccessProbability(features: CanaryDeploymentFeatures): number {
    let probability = 0.8; // Base probability
    
    // Critical alerts have highest negative impact
    probability -= (features.critical_alerts || 0) * 0.2;
    
    // Warning alerts have moderate impact
    probability -= (features.warning_alerts || 0) * 0.05;
    
    // Error rate impact
    const errorRate = features.avg_error_rate || 0;
    if (errorRate > 0.1) probability -= 0.3;
    else if (errorRate > 0.05) probability -= 0.15;
    else if (errorRate > 0.02) probability -= 0.05;
    
    // Historical success rate boost
    const historicalRate = features.historical_success_rate || 50;
    probability += (historicalRate - 50) * 0.002;
    
    return Math.max(0, Math.min(1, probability));
  }

  /**
   * Helper: Calculate confidence level
   */
  private calculateConfidenceLevel(features: CanaryDeploymentFeatures): string {
    const dataPoints = (features.critical_alerts || 0) + 
                      (features.warning_alerts || 0) +
                      ((features.total_deployments || 0) * 10); // Approximate metric count
    
    if (dataPoints > 50) return 'high';
    if (dataPoints > 20) return 'medium';
    return 'low';
  }

  /**
   * Helper: Identify risk factors
   */
  private identifyRiskFactors(features: CanaryDeploymentFeatures): string[] {
    const risks: string[] = [];
    
    if (features.critical_alerts > 0) {
      risks.push('critical_alerts_present');
    }
    
    if (features.warning_alerts > 3) {
      risks.push('high_warning_count');
    }
    
    if (features.avg_error_rate && features.avg_error_rate > 0.05) {
      risks.push('elevated_error_rate');
    }
    
    if (features.error_rate_variance && features.error_rate_variance > 0.02) {
      risks.push('unstable_error_rate');
    }
    
    if (features.historical_success_rate && features.historical_success_rate < 70) {
      risks.push('low_historical_success_rate');
    }
    
    return risks;
  }

  /**
   * Helper: Generate recommendations
   */
  private generateRecommendations(features: CanaryDeploymentFeatures, probability: number): string[] {
    const recommendations: string[] = [];
    
    if (probability < 0.4) {
      recommendations.push('Consider immediate rollback');
      recommendations.push('Investigate critical alerts before proceeding');
    } else if (probability < 0.7) {
      recommendations.push('Proceed with caution - monitor closely');
      recommendations.push('Consider slowing rollout pace');
    } else {
      recommendations.push('Safe to proceed with rollout');
      recommendations.push('Continue monitoring metrics');
    }
    
    if (features.avg_error_rate && features.avg_error_rate > 0.05) {
      recommendations.push('Address elevated error rate before increasing traffic');
    }
    
    return recommendations;
  }

  /**
   * Helper: Generate rollout recommendation
   */
  private generateRolloutRecommendation(deployment: CanaryDeploymentState): CanaryRolloutRecommendation {
    const {
      current_percentage,
      target_percentage,
      critical_alerts_last_hour,
      warning_alerts_last_hour,
      error_rate_change_pct,
      response_time_change_pct
    } = deployment;
    
    let action: 'proceed' | 'pause' | 'rollback' | 'complete' = 'proceed';
    let next_percentage: number | null = current_percentage;
    let reasoning: string[] = [];
    
    // Check for critical issues
    if (critical_alerts_last_hour > 0) {
      action = 'rollback';
      reasoning.push('Critical alerts detected - immediate rollback recommended');
    } else if (warning_alerts_last_hour > 5) {
      action = 'pause';
      reasoning.push('High warning count - pause and investigate');
    } else if (error_rate_change_pct > 50) {
      action = 'pause';
      reasoning.push('Error rate increasing significantly');
    } else if (response_time_change_pct > 30) {
      action = 'pause';
      reasoning.push('Response time degrading');
    } else if (current_percentage < target_percentage) {
      // Safe to proceed
      const stages = [5, 10, 25, 50, 75, 100];
      const nextStage = stages.find(s => s > current_percentage) || target_percentage;
      next_percentage = Math.min(nextStage, target_percentage);
      action = 'proceed';
      reasoning.push('Metrics stable - safe to increase traffic');
    } else {
      action = 'complete';
      reasoning.push('Target percentage reached - deployment complete');
    }
    
    return {
      action,
      next_percentage: action === 'proceed' ? next_percentage : null,
      reasoning,
      estimated_time_to_complete: action === 'proceed' ? '2-4 hours' : null
    };
  }

  /**
   * Helper: Check for anomaly
   */
  private async checkForAnomaly(deploymentId: string, metricType: string, value: number): Promise<void> {
    try {
      // Simple anomaly detection: check if value deviates significantly from recent average
      const query = `
        SELECT AVG(metric_value) as avg_value, STDDEV(metric_value) as stddev_value
        FROM canary_metrics
        WHERE deployment_id = $1
          AND metric_type = $2
          AND created_at > NOW() - INTERVAL '2 hours'
      `;
      
      const result = await this.db.query(query, [deploymentId, metricType]);
      const stats = result.rows[0];
      
      if (stats.stddev_value && stats.stddev_value > 0) {
        const zScore = Math.abs((value - stats.avg_value) / stats.stddev_value);
        
        if (zScore > 3.0) {
          // Mark as anomaly
          await this.db.query(
            `UPDATE canary_metrics 
             SET is_anomaly = true 
             WHERE deployment_id = $1 AND metric_type = $2 
             AND metric_value = $3 AND created_at > NOW() - INTERVAL '5 minutes'`,
            [deploymentId, metricType, value]
          );
          
          // Create alert
          await this.db.query(
            `INSERT INTO canary_alerts (deployment_id, severity, alert_type, message, created_at)
             VALUES ($1, 'warning', 'anomaly_detected', 
                     $2, NOW())`,
            [deploymentId, `Anomaly detected in ${metricType}: value=${value} z_score=${zScore.toFixed(2)}`]
          );
        }
      }
    } catch (error) {
      logger.error('checkForAnomaly error:', error);
    }
  }

  /**
   * GET /api/canary/metrics/algorithm
   * Get algorithm performance metrics for Canary trending predictions
   */
  async getAlgorithmMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { timeframe = '24h' } = req.query;
      
      const metrics = await unifiedMLService.getAlgorithmMetrics('canary', timeframe as string);
      
      res.json({
        success: true,
        data: metrics,
        feed_type: 'canary'
      });
    } catch (error) {
      logger.error('CanaryController.getAlgorithmMetrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve algorithm metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/canary/track-interaction
   * Track user interaction with trending content for ML training
   */
  async trackInteraction(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { item_id, interaction_type, metadata } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }
      
      await unifiedMLService.trackInteraction(userId, item_id as string, interaction_type as string, {
        ...metadata,
        feed_type: 'canary'
      });
      
      res.json({
        success: true,
        message: 'Interaction tracked successfully'
      });
    } catch (error) {
      logger.error('CanaryController.trackInteraction error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track interaction',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new CanaryController();
