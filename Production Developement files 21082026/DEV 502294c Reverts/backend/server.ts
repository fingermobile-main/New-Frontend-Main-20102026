import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
// Import database index first to register initialization functions
import "./database/index";
import connectDB from "./database/connection";
import { generalLimiter } from "./middleware/rateLimiter";
import { initSentry, sentryRequestHandler } from "./utils/sentry";
import logger, { logRequest } from "./utils/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

// Initialize Sentry
initSentry();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (before routes)
app.use(helmet());
app.use(cors({
origin: process.env.CORS_ORIGIN || ',
http://,
localhost:3000',
credentials: true
}));
app.use(sentryRequestHandler);
app.use(generalLimiter);
app.use(logRequest);
app.use(express.json({
limit: "10mb" }));
app.use(express.urlencoded({
extended: true }));

// Basic route
app.get("/", (
req: Request,
res: Response) => {
  res.json({
message: "Welcome to FingerMobile API",
version: "1.0.0" });
});

// Health check endpoint
app.get("/health", (
req: Request,
res: Response) => {
  res.status(200).json({
status: "healthy",
timestamp: new Date().toISOString(),
uptime: process.uptime(),
environment: process.env.NODE_ENV
  });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
explorer: true,
customCss: '.swagger-ui .topbar {
display: none }',
customSiteTitle: 'FingerMobile API Documentation'
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (
req: Request,
res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Initialize database and THEN dynamically import and register routes
connectDB()
  .then(async () => {
    // Dynamically import routes AFTER database is connected
    const routesModule = await import("./routes/index.js");
    const routes = routesModule.default as unknown as express.Router;
    
    // Register routes
    app.use("/api", routes);
    
    // 404 handler for undefined routes
    app.use(notFoundHandler);
    
    // Global error handling middleware (must be last)
    app.use(errorHandler);
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`FingerMobile API server running on port ${PORT}`, {
environment: process.env.NODE_ENV,
pid: process.pid
      });
      logger.info(`API Documentation available at,
http://,
localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    logger.error("Failed to connect to,
database:", error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection,
at:', { promise, reason });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught,
Exception:', error);
  process.exit(1);
});
