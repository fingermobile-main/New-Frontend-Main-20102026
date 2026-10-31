/* eslint-disable no-unused-vars */
if (typeof globalThis.File === 'undefined') {
  try {
    const { File, Blob } = require('node:buffer');
    if (File) globalThis.File = File;
    if (Blob && typeof globalThis.Blob === 'undefined') globalThis.Blob = Blob;
  } catch (_) {
    class FilePolyfill extends (globalThis.Blob || class {}) {
      constructor(chunks, name, opts) {
        super(chunks, opts);
        this.name = name;
        this.lastModified = opts?.lastModified || Date.now();
      }
    }
    globalThis.File = FilePolyfill;
  }
}

// Override process.exit for debugging
const originalExit = process.exit;
process.exit = function(code) {
  if (typeof logger !== 'undefined' && logger && typeof logger.error === 'function') {
    logger.error('process.exit called with code:', code);
    logger.error(new Error().stack);
  } else {
    console.error('process.exit called with code:', code);
    console.error(new Error().stack);
  }
  originalExit.apply(process, arguments);
};
process.env.DEBUG_DOTENV = '0';

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const compression = require('compression'); // Add compression middleware
const validator = require('validator'); // Add input validation library

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Now import logger after environment variables are loaded
const logger = require('./config/logger');

// Import config and middleware
const backendConfig = require('./config') || {};
const PORT = process.env.PORT || backendConfig.PORT || 5001;
const SESSION_SECRET = process.env.SESSION_SECRET || backendConfig.SESSION_SECRET || 'default_secret';
const { identityDb, testConnections } = require('./db/db');
const { initializeDatabase } = require('./db/initialize');
const { autoInitDatabase } = require('./database/autoInit');
const apiRoutes = require('./routes/index');
const oauth2Routes = require('./routes/oauth2');
const authRoutes = require('./routes/auth');
const biometricRoutes = require('./routes/biometric');
const WebSocketService = require('./websocket/server');
const BackupService = require('./services/BackupService');
const mediaExpiryService = require('./services/mediaExpiryService');
const platformDomainExpiryService = require('./services/platformDomainExpiryService');

// Initialize OAuth2 strategies
require('./config/oauth2-strategies');

const app = express();

// Compression middleware
app.use(compression());

// Enhanced logging middleware - Use Winston with Morgan
app.use(morgan('combined', {
  stream: logger.stream
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      styleSrc: ['\'self\'', '\'unsafe-inline\''],
      scriptSrc: ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\''],
      imgSrc: ['\'self\'', 'data:', 'https:'],
      fontSrc: ['\'self\'', 'https:', 'data:'],
      connectSrc: ['\'self\'', 'https://api.mixpanel.com', 'https://*.sentry.io'],
      frameSrc: ['\'self\''],
      objectSrc: ['\'none\''],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  },
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:8000',
].filter(Boolean);

const isAllowedLanOrLocalOrigin = (origin) => {
  if (!origin) return true; // Allow curl, mobile apps, Postman, server-to-server
  try {
    const parsed = new URL(origin);
    const host = parsed.hostname;
    // Allow localhost, loopback, and local mDNS
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.local')) {
      return true;
    }
    // Allow RFC 1918 Private IPv4 Networks (192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12)
    if (
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)
    ) {
      return true;
    }
    return allowedOrigins.includes(origin);
  } catch (_e) {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedLanOrLocalOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  })
);


// Rate limiting - Enhanced with more specific limits
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 10 sensitive requests per windowMs
  message: {
    success: false,
    message: 'Too many sensitive requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply general rate limiter to all requests
app.use(generalLimiter);

// Enhanced security headers
app.use((req, res, next) => {
  // Prevent XSS
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    if (buf && buf.length > 0) {
      try {
        JSON.parse(buf.toString());
      } catch (e) {
        const err = new Error('Invalid JSON format');
        err.status = 400;
        throw err;
      }
    }
  }
}));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// Session configuration
app.use(
  session({
    secret: SESSION_SECRET || 'a_very_secret_session_key_of_32_chars_!!!!',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    }
  })
);

// Input sanitization middleware
app.use((req, res, next) => {
  // Sanitize input parameters
  if (req.body) {
    sanitizeObject(req.body);
  }
  if (req.query) {
    sanitizeObject(req.query);
  }
  if (req.params) {
    sanitizeObject(req.params);
  }
  next();
});

// Helper function to sanitize objects against XSS
function sanitizeObject(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove potentially dangerous characters
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/vbscript:/gi, '') // Remove vbscript: protocol
        .replace(/on\w+\s*=/gi, ''); // Remove event handlers like onclick, onload, etc.
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]); // Recursively sanitize nested objects
    }
  }
}

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'FingerMobile Protocol Backend API is running!',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint with enhanced monitoring
app.get('/health', (req, res) => {
  const healthCheck = {
    success: true,
    message: 'FingerMobile Backend API is running successfully!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage ? process.cpuUsage() : 'N/A'
  };

  // Add database connection status if available
  identityDb.query('SELECT NOW()')
    .then(() => {
      healthCheck.db_connection = 'ok';
      res.status(200).json(healthCheck);
    })
    .catch((err) => {
      healthCheck.db_connection = 'error';
      healthCheck.db_error = err.message;
      res.status(200).json(healthCheck);
    });
});

// Authentication Routes (Dual Credential Verification - Email + Phone + 2FA)
app.use('/api/auth', sensitiveLimiter, authRoutes);

// Biometric Routes (Face Login, WebAuthn, 1:N & 1:1)
app.use('/api/biometrics', sensitiveLimiter, biometricRoutes);
app.use('/api/biometric', sensitiveLimiter, biometricRoutes);

// Universal QR Code Engine Routes (Tier 1 & Tier 2)
const qrRoutes = require('./routes/qr');
app.use('/api/qr', qrRoutes);

// Phone Intelligence & OSINT Reconnaissance Routes (PhoneInfoga Engine)
const phoneIntelligenceRoutes = require('./routes/phoneIntelligence');
app.use('/api/phone', sensitiveLimiter, phoneIntelligenceRoutes);

// Web3 & MetaMask Sovereign Authentication Routes
const web3Routes = require('./routes/web3');
app.use('/api/web3', web3Routes);
app.use('/api/v1/web3', web3Routes);

// Branding & 48-Hour Rotation Routes
const brandingRoutes = require('./routes/brandingRoutes');
const brandingRotationService = require('./services/brandingRotationService');
app.use('/api/v1/branding', brandingRoutes);
app.use('/api/branding', brandingRoutes);

// Regional Creator & Onboarding Quota Routes
const creatorRulesRoutes = require('./routes/creatorRules');
app.use('/api/creators', creatorRulesRoutes);
app.use('/api/v1/creators', creatorRulesRoutes);

// Member/Users Profile Page & Wall Charter Routes (Charter Specification)
const profileCharterRoutes = require('./routes/profileCharterRoutes');
app.use('/api/v1/profiles', profileCharterRoutes);
app.use('/api/profiles/charter', profileCharterRoutes);

// Privacy Consent & CMP Routes (NDPA 2023, GDPR, EU AI Act)
const userConsentRoutes = require('./routes/userConsentRoutes');
app.use('/api/v1/users', userConsentRoutes);
app.use('/v1/users', userConsentRoutes);
app.use('/api/users', userConsentRoutes);

// P2P Matching, Mesh Calibration & Sovereign Member Profiles
const p2pMatchingRoutes = require('./routes/p2p-matching');
app.use('/api/p2p-matching', p2pMatchingRoutes);
app.use('/api/v1/p2p-matching', p2pMatchingRoutes);

// OAuth2 Routes (no /api prefix for compatibility with Passport redirects)
app.use('/auth', sensitiveLimiter, oauth2Routes);

// Static uploads directory serving with CORS and byte-range support
const staticUploadOptions = {
  maxAge: '1d',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Accept-Ranges', 'bytes');
  }
};
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), staticUploadOptions));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), staticUploadOptions));
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads'), staticUploadOptions));

// Metrics & Prometheus Telemetry
const metricsRoutes = require('./routes/metrics');
app.use('/metrics', metricsRoutes);
app.use('/api/metrics', metricsRoutes);

// Main Unified API Routes (mounted after auth/biometric to prevent catch-all interception)
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  // Use Winston for structured error logging
  logger.logError(err, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous'
  });

  // Determine appropriate status code
  const statusCode = err.status || 500;

  // Don't expose sensitive error details in production
  const errorResponse = {
    success: false,
    message: statusCode === 500
      ? 'Something went wrong!'
      : err.message,
    timestamp: new Date().toISOString()
  };

  // Only include error details in development
  if (process.env.NODE_ENV === 'development' && err.message) {
    errorResponse.error = err.message;
  }

  res.status(statusCode).json(errorResponse);
});

// 404 handler
app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      message: `API endpoint ${req.originalUrl} not found`,
      timestamp: new Date().toISOString()
    });
    return;
  }

  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Start server with proper error handling
async function startServer() {
  try {
    logger.info('🚀 Starting FingerMobile Protocol Backend Server...');

    // Initialize Sequelize database connection for models (User, Wallet, etc.)
    logger.info('🔧 Initializing Sequelize database connection...');
    try {
      const dbConnection = require('./dist/database/connection');
      // Require models so they can register their init functions
      require('./dist/models');
      // Call connectDB to establish the connection and initialize models
      if (dbConnection.connectDB) {
        await dbConnection.connectDB();
        logger.info('✅ Sequelize connection established and models initialized');
      } else {
        logger.warn('⚠️ connectDB function not found in database connection module');
      }
    } catch (error) {
      logger.error('❌ Sequelize initialization failed:', {
        error: error.message,
        stack: error.stack
      });
    }

    // Test database connections (optional for development/testing)
    logger.info('🔍 Testing database connections...');
    try {
      await testConnections();
      logger.info('✅ All database connections verified');
    } catch (dbError) {
      logger.warn('⚠️ Database connections failed - continuing without database (development mode)', {
        error: dbError.message
      });
    }

    // Initialize the database tables (optional for development/testing)
    logger.info('💾 Initializing database tables...');
    try {
      await initializeDatabase();
      await autoInitDatabase();
      logger.info('✅ Database initialization completed');
    } catch (dbError) {
      logger.warn('⚠️ Database initialization failed - continuing without database initialization', {
        error: dbError.message
      });
    }

    // Verify database connection (optional)
    try {
      await identityDb.query('SELECT NOW()');
      logger.info('✅ Database connection successful');
    } catch (dbError) {
      logger.warn('⚠️ Database verification failed - continuing in development mode', {
        error: dbError.message
      });
    }

    // Rotate expiring certificates for sealed sender
    try {
      const rotatedCount =
        await require('./services/sealedSenderService').rotateExpiringCertificates();
      logger.info(`🔄 Rotated ${rotatedCount} expiring sender certificates`);
    } catch (error) {
      logger.error('⚠️ Error rotating certificates:', {
        error: error.message
      });
    }

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize WebSocket server
    if (process.env.ENABLE_WEBSOCKET !== 'false') {
      WebSocketService.initialize(server);
      logger.info('✅ WebSocket server enabled');
    }

    // Start automatic backups
    if (process.env.ENABLE_AUTO_BACKUP !== 'false') {
      BackupService.scheduleAutomaticBackups();
      logger.info('✅ Automatic backup scheduling enabled');
    }

    // Start 48-Hour Branding Asset Rotation Engine
    try {
      brandingRotationService.startScheduler();
      logger.info('✅ 48-Hour Branding Rotation Engine scheduler enabled');
    } catch (bErr) {
      logger.warn('⚠️ Could not start branding rotation scheduler:', bErr.message);
    }

    // Start listening on 0.0.0.0 for full local and LAN accessibility
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on http://0.0.0.0:${PORT} (LAN accessible via host IP)`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔌 WebSocket: ${process.env.ENABLE_WEBSOCKET !== 'false' ? 'enabled' : 'disabled'}`);
      logger.info(`💾 Auto Backup: ${process.env.ENABLE_AUTO_BACKUP !== 'false' ? 'enabled' : 'disabled'}`);
      mediaExpiryService.startScheduler();
      logger.info('✅ BeatwaveNG and Dancia-4Tv expiry archival scheduler enabled');
      platformDomainExpiryService.startScheduler();
      logger.info('✅ Platform domain expiry archival scheduler enabled');

      // Graceful shutdown
      process.on('SIGTERM', () => {
        logger.info('SIGTERM received, shutting down gracefully');
        server.close(() => {
          logger.info('Process terminated');
        });
      });

      process.on('SIGINT', () => {
        logger.info('SIGINT received, shutting down gracefully');
        server.close(() => {
          logger.info('Process terminated');
        });
      });
    });

  } catch (error) {
    logger.error('💥 Failed to start server:', {
      error: error.message,
      stack: error.stack
    });

    // Exit with error code
    process.exit(1);
  }
}

// Global error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  logger.error('Uncaught Exception:', {
    error: err.message,
    stack: err.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Actually start the server if this file is run directly
if (require.main === module) {
  startServer().catch((error) => {
    logger.error('Failed to start server:', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  });
}

module.exports = app;
