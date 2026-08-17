import React from 'react';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Middleware to log HTTP requests
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log the request
  logger.http(`${req.method} ${req.path} - IP: ${req.ip}`);

  // Log the response when it's finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Determine log level based on status code
    let level = "http";
    if (statusCode >= 500) {
      level = "error";
    } else if (statusCode >= 400) {
      level = "warn";
    }

    // Use the appropriate logger method based on level
    const message = `${req.method} ${req.path} ${statusCode} - ${duration}ms, IP: ${req.ip}`;
    switch (level) {
      case 'error':
        logger.error(message);
        break;
      case 'warn':
        logger.warn(message);
        break;
      default:
        logger.http(message);
    }
  });

  next();
};

// Middleware to log errors
export const errorLogger = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  const errorObj = err as Error & { status?: number };
  
  logger.error(
    `Error ${errorObj.status || 500} - ${errorObj.message} - ${req.method} ${req.path}, IP: ${req.ip}`
  );

  // Log stack trace in development
  if (process.env.NODE_ENV === "development" && errorObj.stack) {
    logger.debug(errorObj.stack);
  }

  next(err);
};

// Middleware to collect metrics
export const metricsCollector = (req: Request, res: Response, next: NextFunction) => {
  // In a production environment, you would integrate with monitoring services,
  // like:
  // - Prometheus
  // - New Relic
  // - DataDog
  // - Sentry

  // For now, we'll just log some basic metrics
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const memberAgent = req.get("Member-Agent") || "Unknown";
    const referer = req.get("Referer") || "Direct";

    // Log request metrics using logger instead of console
    logger.http(
      `METRIC - Path: ${req.path}, Method: ${req.method}, Status: ${res.statusCode}, Duration: ${duration}ms, MemberAgent: ${memberAgent}, Referer: ${referer}`
    );
  });

  next();
};

export default {
  requestLogger,
  errorLogger,
  metricsCollector
};
