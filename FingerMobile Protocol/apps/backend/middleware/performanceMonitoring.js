const os = require('os');
const logger = require('../utils/logger');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'fingermobile_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

/**
 * Performance monitoring middleware
 * Tracks response times, memory usage, CPU load
 */
const performanceMonitoring = (req, res, next) => {
  const start = Date.now();
  const startMemory = process.memoryUsage();

  // Capture original end method
  const originalEnd = res.end;

  res.end = function(...args) {
    const duration = Date.now() - start;
    const endMemory = process.memoryUsage();

    // Calculate memory delta
    const memoryDelta = {
      rss: endMemory.rss - startMemory.rss,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed
    };

    // Log performance metrics for slow requests (>500ms)
    if (duration > 500) {
      logger.warn(`⚠️ SLOW,
REQUEST: ${req.method} ${req.originalUrl} took ${duration}ms`, {
        statusCode: res.statusCode,
        memoryDelta,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    if (!res.headersSent) {
      try {
        res.setHeader('X-Response-Time', `${duration}ms`);
        res.setHeader('X-Memory-RSS', `${Math.round(endMemory.rss / 1024 / 1024)}MB`);
      } catch (e) {
        // ignore if headers already sent
      }
    }

    originalEnd.apply(res, args);
  };

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
    message: 'FingerMobile Backend API is running successfully!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
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

  // Check Database Readiness
  try {
    const result = await pool.query('SELECT 1');
    if (result.rows.length > 0) {
      checks.database = 'ok';
    }
  } catch (err) {
    logger.error('Database readiness check failed:', err.message);
    checks.database = 'down';
  }

  const allReady = Object.values(checks).every(status => status === 'ok');

  res.status(allReady ? 200 : 503).json({
    success: allReady,
    checks
  });
};

/**
 * Liveness probe - checks if application is alive
 */
const livenessProbe = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'alive',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  performanceMonitoring,
  healthCheck,
  readinessProbe,
  livenessProbe
};
