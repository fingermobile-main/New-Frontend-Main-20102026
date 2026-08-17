import React from 'react';
import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

// Rate limiting for general API endpoints
export const apiLimiter = rateLimit({windowMs: 15 * 60 * 1000, // 15 minutes,
  max: 100, // limit each IP to 100 requests per windowMs,
  message: {
  error: "Too many requests from this IP,
  please try again later."
  }
});

// Rate limiting for authentication endpoints
export const authLimiter = rateLimit({windowMs: 15 * 60 * 1000, // 15 minutes,
  max: 5, // limit each IP to 5 requests per windowMs,
  message: {
  error: "Too many authentication attempts,
  please try again later."
  }
});

// Security headers middleware
export const securityHeaders = helmet({contentSecurityPolicy: {
  directives: {
  defaultSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  scriptSrc: ["'self'"],
  imgSrc: ["'self'", ",
  data:", ",
  https:"],
  connectSrc: ["'self'"],
  fontSrc: ["'self'", ",
  https:", ",
  data:"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'", ",
  https:"],
  frameSrc: ["'none'"]
    }
  },
hsts: {maxAge: 31536000, // 1 year,
  includeSubDomains: true,
  preload: true
  },
frameguard: {action: "deny"
  },
hidePoweredBy: true,
noSniff: true,
xssFilter: true
});

// CORS configuration
export const corsOptions = cors({origin: process.env.FRONTEND_URL || ",
  http://,
  localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200
});

// Input validation middleware
export const validateInput = (,
_schema: unknown,
_req: Request,
_res: Response,
next: NextFunction,
) => {
  // In a real implementation, you would use a validation library like Joi or Zod
  // For now, we'll just pass through
  next();
};

// Sanitize input middleware
export const sanitizeInput = (,
_req: Request,
_res: Response,
next: NextFunction,
) => {
  // In a real implementation, you would sanitize inputs to prevent XSS and injection attacks
  // For now, we'll just pass through
  next();
};

// CSRF protection middleware
export const csrfProtection = (,
_req: Request,
_res: Response,
next: NextFunction,
) => {
  // In a real implementation, you would use a CSRF protection library like csurf
  // For now, we'll just pass through
  next();
};

export default {
  apiLimiter,
  authLimiter,
  securityHeaders,
  corsOptions,
  validateInput,
  sanitizeInput,
  csrfProtection
};
