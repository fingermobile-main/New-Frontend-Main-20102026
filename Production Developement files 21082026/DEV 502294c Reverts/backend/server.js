// Set this before requiring dotenv to prevent the logger issue
process.env.DEBUG_DOTENV = '0';

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require('passport');
const rateLimit = require("express-rate-limit");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require('http');
const compression = require('compression'); // Add compression middleware
const validator = require('validator'); // Add input validation library

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Now import logger after environment variables are loaded
const logger = require('./config/logger');

// Import config and middleware
const { PORT, SESSION_SECRET } = require("./config") || {
  PORT: process.env.PORT || 5000,
  SESSION_SECRET: process.env.SESSION_SECRET || "default_secret"
};
const { identityDb, testConnections } = require("./db/db");
const { initializeDatabase } = require("./db/initialize");
const apiRoutes = require("./routes/index");
const oauth2Routes = require('./routes/oauth2');
const authRoutes = require('./routes/auth');
const WebSocketService = require('./websocket/server');
const BackupService = require('./services/BackupService');

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
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "https://api.mixpanel.com", "https://*.sentry.io"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
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
  }
}));

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001",
      "http://localhost:3002",
      // Add production domains here
    ].filter(url => url && validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })), // Validate URLs
    credentials: true,
    optionsSuccessStatus: 200
  })
);

// Rate limiting - Enhanced with more specific limits
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 sensitive requests per windowMs
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
  limit: "10mb",
  // Add custom error handling for JSON parsing
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      logger.error('JSON parsing error:', {
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        error: e.message
      });
      res.status(400).json({
        success: false,
        message: 'Invalid JSON format'
      });
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
    secret: SESSION_SECRET || "a_very_secret_session_key_of_32_chars_!!!!",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
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
    message: "FingerMobile Backend API is running successfully!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage ? process.cpuUsage() : 'N/A'
  };

  // Add database connection status if available
  identityDb.query("SELECT NOW()")
    .then(() => {
      healthCheck.db_connection = "ok";
      res.status(200).json(healthCheck);
    })
    .catch((err) => {
      healthCheck.db_connection = "error";
      healthCheck.db_error = err.message;
      res.status(200).json(healthCheck);
    });
});

// API Routes (Unified Registration)
app.use("/api", apiRoutes);

// Authentication Routes (Dual Credential Verification - Email + Phone + 2FA)
app.use("/api/auth", sensitiveLimiter, authRoutes);

// OAuth2 Routes (no /api prefix for compatibility with Passport redirects)
app.use("/auth", sensitiveLimiter, oauth2Routes);

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
      ? "Something went wrong!" 
      : err.message,
    timestamp: new Date().toISOString()
  };
  
  // Only include error details in development
  if (process.env.NODE_ENV === "development" && err.message) {
    errorResponse.error = err.message;
  }
  
  res.status(statusCode).json(errorResponse);
});

// 404 handler
app.use("*", (req, res) => {
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
    logger.info("🚀 Starting FingerMobile Protocol Backend Server...");
    
    // Initialize Sequelize database connection for models (User, Wallet, etc.)
    logger.info("🔧 Initializing Sequelize database connection...");
    try {
      const dbConnection = require("./dist/database/connection");
      // Call connectDB to establish the connection and initialize models
      if (dbConnection.connectDB) {
        await dbConnection.connectDB();
        logger.info("✅ Sequelize connection established and models initialized");
      } else {
        logger.warn("⚠️ connectDB function not found in database connection module");
      }
    } catch (error) {
      logger.error("❌ Sequelize initialization failed:", {
        error: error.message,
        stack: error.stack
      });
    }

    // Test database connections (optional for development/testing)
    logger.info("🔍 Testing database connections...");
    try {
      await testConnections();
      logger.info("✅ All database connections verified");
    } catch (dbError) {
      logger.warn("⚠️ Database connections failed - continuing without database (development mode)", {
        error: dbError.message
      });
    }

    // Initialize the database tables (optional for development/testing)
    logger.info("💾 Initializing database tables...");
    try {
      await initializeDatabase();
      logger.info("✅ Database initialization completed");
    } catch (dbError) {
      logger.warn("⚠️ Database initialization failed - continuing without database initialization", {
        error: dbError.message
      });
    }

    // Verify database connection (optional)
    try {
      await identityDb.query("SELECT NOW()");
      logger.info("✅ Database connection successful");
    } catch (dbError) {
      logger.warn("⚠️ Database verification failed - continuing in development mode", {
        error: dbError.message
      });
    }

    // Rotate expiring certificates for sealed sender
    try {
      const rotatedCount =
        await require("./services/sealedSenderService").rotateExpiringCertificates();
      logger.info(`🔄 Rotated ${rotatedCount} expiring sender certificates`);
    } catch (error) {
      logger.error("⚠️ Error rotating certificates:", {
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

    // Start listening
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔌 WebSocket: ${process.env.ENABLE_WEBSOCKET !== 'false' ? 'enabled' : 'disabled'}`);
      logger.info(`💾 Auto Backup: ${process.env.ENABLE_AUTO_BACKUP !== 'false' ? 'enabled' : 'disabled'}`);
      
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
    logger.error("💥 Failed to start server:", {
      error: error.message,
      stack: error.stack
    });
    
    // Exit with error code
    process.exit(1);
  }
}

// Global error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', {
    error: err.message,
    stack: err.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
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