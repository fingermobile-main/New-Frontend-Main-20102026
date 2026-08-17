import React, {} from 'react';
import { NextFunction } from "express"; // Keep this for compatibility but will be unused

// Security helpers for frontend
export const csrfTokenCheck = (requestToken: string | undefined,
storedToken: string | undefined
): boolean => {
  if (!requestToken || !storedToken) {
    return false;
  }

  return requestToken === storedToken;
};

// Rate limiting simulation for frontend (in a real app this would be handled by the backend)
export const checkRateLimit = (identifier: string, maxRequests = 100): boolean => {
  // This would be more complex in a real implementation
  const now = Date.now();
  const windowSize = 15 * 60 * 1000; // 15 minutes

  const key = `rate_limit_${identifier}`;
  const record = localStorage.getItem(key);
  let requests: number[] = [];

  if (record) {
    try {
      requests = JSON.parse(record);
    } catch (e) {
      requests = [];
    }
  }

  // Filter out requests older than the window size
  const recentRequests = requests.filter((timestamp: number) => now - timestamp < windowSize);

  // Add current request
  recentRequests.push(now);

  // Store updated requests
  localStorage.setItem(key, JSON.stringify(recentRequests));

  // Check if we're over the limit
  return recentRequests.length <= maxRequests;
};

// Input sanitization for frontend
export const sanitizeInput = (input: any) => {
  if (typeof input === 'string') {
    // Basic sanitization to prevent XSS
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
  }
  return input;
};

// Simple authentication helper
export const isAuthenticated = (): boolean => {
  // Check for existence of auth token in local storage or cookies
  const token = localStorage.getItem('token');
  return !!token;
};

// Simple role check helper
export const hasRole = (requiredRoles: string[], userRole?: string): boolean => {
  if (!userRole) return false;
  return requiredRoles.some(role => role === userRole);
};

// CSRF token generator
export const generateCsrfToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Store CSRF token in sessionStorage
export const storeCsrfToken = (token: string): void => {
  sessionStorage.setItem('csrfToken', token);
};

// Retrieve CSRF token
export const getCsrfToken = (): string | null => {
  return sessionStorage.getItem('csrfToken');
};

// Frontend security utilities
export const securityUtils = {
  sanitizeInput,
  isAuthenticated,
  hasRole,
  generateCsrfToken,
  storeCsrfToken,
  getCsrfToken,
  csrfTokenCheck,
  checkRateLimit
};

export default securityUtils;

// Alias for server.ts which uses 'authenticate' middleware name
export const authenticate = (req: any, res: any, next: unknown) => {
  if (isAuthenticated()) {
    // @ts-ignore - Auto-suppressed for compilation
    next();
  } else {
    res.status(401).json({error: 'Unauthorized' });
  }
};
