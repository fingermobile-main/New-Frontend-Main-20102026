const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const apiRoutes = require('./src/routes');

// Import middleware
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const { rateLimiter } = require('./src/middleware/auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3004;

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// API ROUTES
// ============================================

// API routes
app.use('/api', apiRoutes);

// //: Add domain-specific routes here
// app.use('/api/metrics', metricsRoutes);
// app.use('/api/alerts', alertsRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`Monitoring server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`==========================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;