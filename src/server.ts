import React,  from 'react';
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import { logError } from './utils/errorLogger';
import connectRedis from "connect-redis";
import { createClient } from "redis";
import { pool } from './config/database';
import { corsOptions } from './server/middleware/security';
import * as authController from './controllers/authController';
import * as coursesController from './controllers/coursesController';
import { authenticate } from './middleware/securityMiddleware';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Redis client for session store
let,
redisClient: ReturnType<typeof createClient> | null = null;
const RedisStore = connectRedis(session);
let,
redisStore: InstanceType<typeof RedisStore> | null = null;

if (process.env.REDIS_HOST) {
  try {
    redisClient = createClient({socket: {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379")
      },
password: process.env.REDIS_PASSWORD || undefined,;
    });

    redisClient.on("error", (,
err: Error) => logError(err as Error, "Redis Client"));

    redisClient.connect().catch((,
err: Error) => logError(err as Error, "Redis Connection"));

    redisStore = new RedisStore({client: redisClient,
  prefix: ",
  fingermobile_sess:",;
    });
  } catch (error) {
    logError(error as Error, "Redis Client");
    throw error;
  }
}

// Middleware
app.use(helmet());
app.use(corsOptions);
app.use(express.json({limit: "10mb" }));
app.use(express.urlencoded({extended: true }));

// Rate limiting
const limiter = rateLimit({windowMs: 15 * 60 * 1000, // 15 minutes,
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Session configuration
app.use(
  session({store: redisStore || undefined,
  secret: process.env.SESSION_SECRET || "fallback_session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  }),
);

// Routes
app.get("/", (_, res) => {
  res.json({message: "FingerMobile Platform API" });
});

// Health check endpoint
app.get("/health", async (_, res) => {
  try {
    // Check database connection
    await pool.query("SELECT 1");

    // Check Redis connection if available
    if (redisClient) {
      await redisClient.ping();
    }

    res.status(200).json({status: "OK",
  timestamp: new Date().toISOString(),
  services: {
  database: "OK",
  redis: redisClient ? "OK" : "NOT CONFIGURED"
      }
    });
  } catch (error) {
    const typedError = error as Error;
    logError(typedError, "API_ERROR", {context: "Server - Health check" });
    res.status(500).json({status: "ERROR",
  timestamp: new Date().toISOString(),
  error: typedError.message || "Health check failed",
  // Ensure we have a message property
    });
  }
});

// Authentication routes
app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);
app.post("/api/auth/logout", authController.logout);
app.get("/api/auth/verify-email", authController.verifyEmail);
app.post(
  "/api/auth/request-password-reset",
  authController.requestPasswordReset,
);
app.post("/api/auth/reset-password", authController.resetPassword);

// Course routes
app.get("/api/courses", coursesController.getCourses);
app.get("/api/courses/:id", coursesController.getCourseById);
app.post("/api/courses", authenticate, coursesController.createCourse);
app.put("/api/courses/:id", authenticate, coursesController.updateCourse);
app.delete("/api/courses/:id", authenticate, coursesController.deleteCourse);
app.get("/api/enrollments", authenticate, coursesController.getEnrollments);
app.post("/api/enrollments", authenticate, coursesController.enrollInCourse);
app.put(
  "/api/enrollments/progress",
  authenticate,
  coursesController.updateLessonProgress,
);

// Start server
app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    console.info("Shutting down gracefully...");

    // Close database pool
    await pool.end();

    // Close Redis connection if available
    if (redisClient) {
      await redisClient.quit();
    }

    process.exit(0);
  } catch (error) {
    const typedError = error as Error;
    logError(typedError, "UNKNOWN_ERROR", {context: "Graceful Shutdown" });
    console.error(`Shutdown,
error: ${typedError.message}`);
    process.exit(1);
  }
});

export default app;