const os = require('os');
const logger = require('../utils/logger');

/**
 * Performance monitoring middleware
 * Tracks response times, memory usage, CPU load
 */
const performanceMonitoring = (req, res, next) => {
  const start = Date.now();
  const startMemory = process.memoryUsage();
  
  // Capture original end method
  const originalEnd = res.end
  
  res.end = function(...args) {
    const duration = Date.now() - start
    const endMemory = process.memoryUsage()
    
    // Calculate memory delta
    const memoryDelta = {
rss: endMemory.rss - startMemory.rss,
heapTotal: endMemory.heapTotal - startMemory.heapTotal,
heapUsed: endMemory.heapUsed - startMemory.heapUsed
    }
    
    // Log performance metrics for slow requests (>500ms)
    if (duration > 500) {
      logger.warn(`⚠️ SLOW,
REQUEST: ${req.method} ${req.originalUrl} took ${duration}ms`, {
statusCode: res.statusCode,
        memoryDelta,
ip: req.ip,
userAgent: req.get('User-Agent')
      })
    }
    
    // Add performance headers
    res.setHeader('X-Response-Time', `${duration}ms`)
    res.setHeader('X-Memory-RSS', `${Math.round(endMemory.rss / 1024 / 1024)}MB`)
    
    originalEnd.apply(res, args)
  }
  
  next();
};

/**
 * System health check endpoint handler
 */
const healthCheck = async (req, res) => {
  const health = {
status: 'ok',
timestamp: new Date().toISOString(),
uptime: process.uptime(),
memory: process.memoryUsage(),
cpu: os.loadavg(),
platform: os.platform(),
nodeVersion: process.version,
environment: process.env.NODE_ENV
  };
  
  res.status(200).json({
success: true,
    health
  });
};

/**
 * Readiness probe - checks if all dependencies are ready
 */
const readinessProbe = async (req, res) => {
  const checks = {
database: 'unknown',
redis: 'unknown',
elasticsearch: 'unknown'
  };
  
  // TODO: Add actual dependency checks
  // For now, assume all are ready
  
  const allReady = Object.values(checks).every(status => status === 'ok')
  
  res.status(allReady ? 200 : 503).json({
success: allReady,
    checks
  })
}

/**
 * Liveness probe - checks if application is alive
 */
const livenessProbe = (req, res) => {
  res.status(200).json({
success: true,
status: 'alive',
timestamp: new Date().toISOString()
  })
};

module.exports = {
  performanceMonitoring,
  healthCheck,
  readinessProbe,
  livenessProbe
};
