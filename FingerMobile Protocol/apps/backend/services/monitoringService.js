const logger = require('../utils/logger');

class MonitoringService {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      uptime: Date.now()
    };

    // Track performance
    this.startPerformanceTracking();
  }

  // Track request metrics
  trackRequest(responseTime) {
    this.metrics.requests++;
    this.metrics.responseTime.push(responseTime);

    // Keep only last 1000 measurements
    if (this.metrics.responseTime.length > 1000) {
      this.metrics.responseTime.shift();
    }
  }

  // Track error metrics
  trackError() {
    this.metrics.errors++;
  }

  // Calculate average response time
  getAverageResponseTime() {
    if (this.metrics.responseTime.length === 0) {
      return 0;
    }

    const sum = this.metrics.responseTime.reduce((acc, val) => acc + val, 0);
    return sum / this.metrics.responseTime.length;
  }

  // Get system health info
  getSystemHealth() {
    const avgResponseTime = this.getAverageResponseTime();
    const uptime = Date.now() - this.metrics.uptime;

    return {
      status: 'healthy',
      uptime: uptime,
      totalRequests: this.metrics.requests,
      totalErrors: this.metrics.errors,
      averageResponseTime: avgResponseTime,
      errorRate: this.metrics.requests > 0 ? (this.metrics.errors / this.metrics.requests) * 100 : 0,
      timestamp: new Date().toISOString()
    };
  }

  // Performance tracking
  startPerformanceTracking() {
    // Log metrics periodically
    setInterval(() => {
      logger.info('Performance Metrics', {
        requests: this.metrics.requests,
        errors: this.metrics.errors,
        avgResponseTime: this.getAverageResponseTime()
      });
    }, 60000); // Every minute
  }

  // Log application events
  logEvent(eventType, data) {
    logger.info(`${eventType} event`, data);
  }

  // Log error events
  logError(error, context = {}) {
    this.trackError();
    logger.error('Application Error', {
      error: error.message,
      stack: error.stack,
      context: context
    });
  }
}

// Create singleton instance
const monitoringService = new MonitoringService();
module.exports = monitoringService;
