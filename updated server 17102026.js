/* eslint-disable no-unused-vars */
'use strict';

const path = require('path');

// 1. Load environment variables FIRST before any other module imports
process.env.DEBUG_DOTENV = '0';
require('dotenv').config({ path: path.join(__dirname, '.env') });

// 2. Polyfill globalThis.File for Node < 20 compatibility
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

// 3. Core & Third-Party Imports
const http = require('http');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const validator = require('validator');

// 4. Internal Config & Logger Imports (Loaded before process.exit override to prevent TDZ errors)
const logger = require('./config/logger');
const backendConfig = require('./config') || {};

// Safe process.exit interceptor for debugging unexpected exits
const originalExit = process.exit;
process.exit = function (code) {
  const stack = new Error().stack;
  if (logger && typeof logger.error === 'function') {
    logger.error(`process.exit called with code: ${code}`, { stack });
  } else {
    console.error(`process.exit called with code: ${code}`, stack);
  }
  originalExit.apply(process, arguments);
};

// 5. Database, Services & Route Imports
const { identityDb, testConnections } = require('./db/db');
const { initializeDatabase } = require('./db/initialize');
const { autoInitDatabase } = require('./database/autoInit');

const WebSocketService = require('./websocket/server');
const BackupService = require('./services/BackupService');
const mediaExpiryService = require('./services/mediaExpiryService');
const platformDomainExpiryService = require('./services/platformDomainExpiryService');
const brandingRotationService = require('./services/brandingRotationService');
const sealedSenderService = require('./services/sealedSenderService');

const apiRoutes = require('./routes/index');
const oauth2Routes = require('./routes/oauth2');
const authRoutes = require('./routes/auth');
const biometricRoutes = require('./routes/biometric');
const brandingRoutes = require('./routes/brandingRoutes');
const creatorRulesRoutes = require('./routes/creatorRules');
const profileCharterRoutes = require('./routes/profileCharterRoutes');

// Initialize OAuth2 strategies
require('./config/oauth2-strategies');

// 6. Environment & Constants Validation
const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || backendConfig.PORT || '5001', 10);
const SESSION_SECRET = process.env.SESSION_SECRET || backendConfig.SESSION_SECRET;

if (IS_PROD && (!SESSION_SECRET || SESSION_SECRET === 'default_secret')) {
  logger.error('❌ FATAL: SESSION_SECRET must be explicitly set in production.');
  process.exit(1);
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// 7. Global Middleware
app.use(compression());
app.use(morgan('combined', { stream: logger.stream }));

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        // Note: Remove unsafe-eval in production if your frontend bundler allows it
        scriptSrc: ["'self'", "'unsafe-inline'", ...(IS_PROD ? [] : ["'unsafe-eval'"])],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https:', 'data:'],
        connectSrc: ["'self'", 'https://api.mixpanel.com', 'https://*.sentry.io'],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: IS_PROD ? [] : null
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  })
);

// CORS Configuration (Using Set for O(1) lookups)
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3002'
  ].filter(
    (url) =>
      url &&
      validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_tld: false
      })
  )
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !IS_PROD || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      const corsError = new Error('Not allowed by CORS');
      corsError.status = 403;
      return callback(corsError);
    },
    credentials: true,
    optionsSuccessStatus: 200
  })
);

// Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PROD ? 1000 : 10000,
  skip: (req) => req.path === '/health' || req.path === '/',
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PROD ? 30 : 1000, // Tightened for production auth/biometric protection
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(generalLimiter);

// Body Parsers (Removed redundant JSON.parse in verify to avoid double-parsing 10MB payloads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session Configuration
// NOTE: Plug in a persistent store (e.g., connect-redis or connect-pg-simple) for production
app.use(
  session({
    name: 'fm.sid',
    secret: SESSION_SECRET || 'dev_fallback_secret_only',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: IS_PROD,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 8. Health & Root Endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'FingerMobile Protocol Backend API is running!',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (req, res) => {
  const healthCheck = {
    success: true,
    message: 'FingerMobile Backend API is running successfully!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };

  // Only expose internal memory/CPU metrics outside production
  if (!IS_PROD) {
    healthCheck.memoryUsage = process.memoryUsage();
    healthCheck.cpuUsage = process.cpuUsage ? process.cpuUsage() : 'N/A';
  }

  try {
    await identityDb.query('SELECT 1');
    healthCheck.db_connection = 'ok';
    return res.status(200).json(healthCheck);
  } catch (err) {
    logger.error('Health check DB probe failed:', { error: err.message });
    healthCheck.success = false;
    healthCheck.db_connection = 'error';
    if (!IS_PROD) healthCheck.db_error = err.message;
    return res.status(503).json(healthCheck);
  }
});

// 9. Application Routes
app.use('/api/auth', sensitiveLimiter, authRoutes);
app.use(['/api/biometrics', '/api/biometric'], sensitiveLimiter, biometricRoutes);
app.use(['/api/v1/branding', '/api/branding'], brandingRoutes);
app.use(['/api/v1/creators', '/api/creators'], creatorRulesRoutes);
app.use(['/api/v1/profiles', '/api/profiles/charter'], profileCharterRoutes);
app.use('/auth', sensitiveLimiter, oauth2Routes);

// Static Uploads (Hardened with dotfile protection and no-sniff headers)
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    dotfiles: 'deny',
    index: false,
    maxAge: '1d',
    setHeaders: (res) => {
      res.set('X-Content-Type-Options', 'nosniff');
    }
  })
);

// Main Unified API Routes
app.use('/api', apiRoutes);

// 10. 404 & Error Handling Middleware
app.use((req, res) => {
  const isApi = req.originalUrl.startsWith('/api/');
  res.status(404).json({
    success: false,
    message: isApi
      ? `API endpoint ${req.originalUrl} not found`
      : `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  // Handle malformed JSON errors from express.json() cleanly
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      timestamp: new Date().toISOString()
    });
  }

  if (typeof logger.logError === 'function') {
    logger.logError(err, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous'
    });
  } else {
    logger.error('Unhandled request error:', {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const errorResponse = {
    success: false,
    message: statusCode === 500 && IS_PROD ? 'Something went wrong!' : err.message,
    timestamp: new Date().toISOString()
  };

  if (!IS_PROD && err.message) {
    errorResponse.error = err.message;
  }

  return res.status(statusCode).json(errorResponse);
});

// 11. Server Initialization & Lifecycle Management
let httpServer = null;
let isShuttingDown = false;

async function startServer() {
  try {
    logger.info('🚀 Starting FingerMobile Protocol Backend Server...');

    // Database connection & Sequelize setup
    try {
      const dbConnection = require('./dist/database/connection');
      require('./dist/models');
      if (typeof dbConnection.connectDB === 'function') {
        await dbConnection.connectDB();
        logger.info('✅ Sequelize connection established and models initialized');
      } else {
        logger.warn('⚠️ connectDB function not found in database connection module');
      }
    } catch (error) {
      logger.error('❌ Sequelize initialization failed:', { error: error.message, stack: error.stack });
      if (IS_PROD) throw error;
    }

    // Verify primary DB connections
    try {
      await testConnections();
      logger.info('✅ All database connections verified');
    } catch (dbError) {
      logger.warn('⚠️ Database connections failed', { error: dbError.message });
      if (IS_PROD) throw dbError;
    }

    // Run schema/table initializers
    try {
      await initializeDatabase();
      await autoInitDatabase();
      logger.info('✅ Database initialization completed');
    } catch (dbError) {
      logger.warn('⚠️ Database initialization failed', { error: dbError.message });
      if (IS_PROD) throw dbError;
    }

    // Rotate expiring certificates
    try {
      const rotatedCount = await sealedSenderService.rotateExpiringCertificates();
      logger.info(`🔄 Rotated ${rotatedCount} expiring sender certificates`);
    } catch (error) {
      logger.error('⚠️ Error rotating certificates:', { error: error.message });
    }

    httpServer = http.createServer(app);

    if (process.env.ENABLE_WEBSOCKET !== 'false') {
      WebSocketService.initialize(httpServer);
      logger.info('✅ WebSocket server enabled');
    }

    if (process.env.ENABLE_AUTO_BACKUP !== 'false') {
      BackupService.scheduleAutomaticBackups();
      logger.info('✅ Automatic backup scheduling enabled');
    }

    try {
      brandingRotationService.startScheduler();
      logger.info('✅ 48-Hour Branding Rotation Engine scheduler enabled');
    } catch (bErr) {
      logger.warn('⚠️ Could not start branding rotation scheduler:', { error: bErr.message });
    }

    httpServer.on('error', (err) => {
      logger.error('💥 HTTP Server error:', { error: err.message, code: err.code });
      process.exit(1);
    });

    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔌 WebSocket: ${process.env.ENABLE_WEBSOCKET !== 'false' ? 'enabled' : 'disabled'}`);
      logger.info(`💾 Auto Backup: ${process.env.ENABLE_AUTO_BACKUP !== 'false' ? 'enabled' : 'disabled'}`);

      try {
        mediaExpiryService.startScheduler();
        logger.info('✅ BeatwaveNG and Dancia-4Tv expiry archival scheduler enabled');
      } catch (mErr) {
        logger.warn('⚠️ Could not start media expiry scheduler:', { error: mErr.message });
      }

      try {
        platformDomainExpiryService.startScheduler();
        logger.info('✅ Platform domain expiry archival scheduler enabled');
      } catch (pErr) {
        logger.warn('⚠️ Could not start platform domain expiry scheduler:', { error: pErr.message });
      }
    });
  } catch (error) {
    logger.error('💥 Failed to start server:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

// 12. Graceful Shutdown & Process Exception Handlers
async function gracefulShutdown(signal, exitCode = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info(`${signal} received, initiating graceful shutdown...`);

  // Force shutdown if connections hang longer than 10 seconds
  const forceExitTimer = setTimeout(() => {
    logger.error('⚠️ Graceful shutdown timed out after 10s, forcing exit.');
    process.exit(exitCode || 1);
  }, 10000);
  forceExitTimer.unref();

  try {
    if (httpServer) {
      await new Promise((resolve) => httpServer.close(resolve));
      logger.info('✅ HTTP server closed.');
    }

    // Stop background schedulers if stop methods exist
    for (const svc of [brandingRotationService, mediaExpiryService, platformDomainExpiryService]) {
      if (svc && typeof svc.stopScheduler === 'function') {
        svc.stopScheduler();
      }
    }

    // Close DB pool cleanly if supported
    if (identityDb && typeof identityDb.end === 'function') {
      await identityDb.end();
      logger.info('✅ Database pool closed.');
    }

    process.exit(exitCode);
  } catch (err) {
    logger.error('Error during graceful shutdown:', { error: err.message });
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM', 0));
process.on('SIGINT', () => gracefulShutdown('SIGINT', 0));

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', { error: err.message, stack: err.stack });
  gracefulShutdown('uncaughtException', 1);
});

process.on('unhandledRejection', (reason) => {
  const errorMsg = reason instanceof Error ? reason.message : String(reason);
  const errorStack = reason instanceof Error ? reason.stack : undefined;
  logger.error('Unhandled Rejection:', { reason: errorMsg, stack: errorStack });
  gracefulShutdown('unhandledRejection', 1);
});

if (require.main === module) {
  startServer();
}

module.exports = app;
