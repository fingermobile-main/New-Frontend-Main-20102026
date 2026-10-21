/**
 * Metrics Middleware
 * Prometheus metrics collection for Node.js application
 */

const promClient = require('prom-client');

// Create a Registry to register metrics
const register = new promClient.Registry();

// Enable default metrics (process stats)
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const databaseQueryDuration = new promClient.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1]
});

const errorTotal = new promClient.Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'endpoint']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(databaseQueryDuration);
register.registerMetric(errorTotal);

/**
 * Metrics middleware - track request duration and count
 */
function metricsMiddleware(req, res, next) {
  const start = Date.now();

  // Track active connections
  activeConnections.inc();

  // Intercept response finish
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const route = req.route ? req.route.path : req.path;

    // Record metrics
    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);

    httpRequestTotal
      .labels(req.method, route, res.statusCode.toString())
      .inc();

    // Decrement active connections
    activeConnections.dec();
  });

  next();
}

/**
 * Record database query duration
 */
function recordDatabaseQuery(operation, table, duration) {
  databaseQueryDuration
    .labels(operation, table)
    .observe(duration);
}

/**
 * Record error
 */
function recordError(type, endpoint) {
  errorTotal.labels(type, endpoint).inc();
}

module.exports = {
  metricsMiddleware,
  register,
  recordDatabaseQuery,
  recordError,
  requestTracker: () => metricsMiddleware,
  collectSystemMetrics: () => {}
};
