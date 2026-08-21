/**
 * AnalyticsEnhancedController
 * Advanced analytics endpoints for cohort analysis, funnels AND retention
 */

const AnalyticsEnhancedService = require('../services/AnalyticsEnhancedService');
const logger = require('../utils/logger');

class AnalyticsEnhancedController {
    /**
     * GET /api/analytics/enhanced/cohort
     * Get cohort analysis data
     */
    async getCohortAnalysis(req, res) {
        try {
            const { 
                cohortDefinition = 'weekly',
                startDate,
                endDate,
                retentionPeriods = 12
            } = req.query;

            const timeRange = {
                start: startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                end: endDate ? new Date(endDate) : new Date()
            };

            const result = await AnalyticsEnhancedService.getCohortAnalysis({
                cohortDefinition,
                timeRange,
                retentionPeriods: parseInt(retentionPeriods)
            });

            res.json(result);
        } catch (error) {
            logger.error('Error in getCohortAnalysis:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch cohort analysis',
                error: error.message
            });
        }
    }

    /**
     * POST /api/analytics/enhanced/funnel
     * Get funnel metrics for defined steps
     */
    async getFunnelMetrics(req, res) {
        try {
            const { funnelSteps, startDate, endDate } = req.body;

            if (!funnelSteps || !Array.isArray(funnelSteps)) {
                return res.status(400).json({
                    success: false,
                    message: 'funnelSteps array is required'
                });
            }

            const timeRange = {
                start: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                end: endDate ? new Date(endDate) : new Date()
            };

            const result = await AnalyticsEnhancedService.getFunnelMetrics(funnelSteps, { timeRange });

            res.json(result);
        } catch (error) {
            logger.error('Error in getFunnelMetrics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch funnel metrics',
                error: error.message
            });
        }
    }

    /**
     * GET /api/analytics/enhanced/retention
     * Get retention metrics over time
     */
    async getRetentionMetrics(req, res) {
        try {
            const { period = 'monthly', limit = 12 } = req.query;

            const result = await AnalyticsEnhancedService.getRetentionMetrics(
                period,
                parseInt(limit)
            );

            res.json(result);
        } catch (error) {
            logger.error('Error in getRetentionMetrics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch retention metrics',
                error: error.message
            });
        }
    }

    /**
     * GET /api/analytics/enhanced/churn
     * Get churn analysis data
     */
    async getChurnAnalysis(req, res) {
        try {
            const { inactiveThreshold = 30, startDate, endDate } = req.query;

            const timeRange = {
                start: startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                end: endDate ? new Date(endDate) : new Date()
            };

            const result = await AnalyticsEnhancedService.getChurnAnalysis({
                inactiveThreshold: parseInt(inactiveThreshold),
                timeRange
            });

            res.json(result);
        } catch (error) {
            logger.error('Error in getChurnAnalysis:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch churn analysis',
                error: error.message
            });
        }
    }

    /**
     * GET /api/analytics/enhanced/ltv
     * Get lifetime value metrics
     */
    async getLifetimeValueMetrics(req, res) {
        try {
            const { cohortPeriod = 'monthly' } = req.query;

            const result = await AnalyticsEnhancedService.getLifetimeValueMetrics({
                cohortPeriod
            });

            res.json(result);
        } catch (error) {
            logger.error('Error in getLifetimeValueMetrics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch LTV metrics',
                error: error.message
            });
        }
    }

    /**
     * GET /api/analytics/enhanced/dashboard
     * Get comprehensive analytics dashboard data
     */
    async getDashboardData(req, res) {
        try {
            const { period = 'monthly' } = req.query;

            // Fetch all key metrics in parallel
            const [retention, churn, ltv] = await Promise.all([
                AnalyticsEnhancedService.getRetentionMetrics(period, 6),
                AnalyticsEnhancedService.getChurnAnalysis({ inactiveThreshold: 30 }),
                AnalyticsEnhancedService.getLifetimeValueMetrics({ cohortPeriod: period })
            ]);

            res.json({
                success: true,
                data: {
                    retention: retention,
                    churn: churn,
                    lifetime_value: ltv,
                    generated_at: new Date().toISOString()
                }
            });
        } catch (error) {
            logger.error('Error in getDashboardData:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard data',
                error: error.message
            });
        }
    }
}

module.exports = new AnalyticsEnhancedController();