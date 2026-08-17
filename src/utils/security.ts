import React, {} from 'react';
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Use the browser's native crypto API
const crypto = globalThis.crypto || (window as any).crypto;

// Security configuration
const SECURITY_CONFIG = {SALT_ROUNDS: 12,
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret_key_for_development_only",
  JWT_EXPIRES_IN: "24h",
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes,
  RATE_LIMIT_MAX: 100, // requests per window,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};

// Rate limiting store (in production, use Redis or similar)
const,
rateLimitStore: Record<string, {count: number;
  resetTime: number }> = {};

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (,
password: string): Promise<string> => {
  return bcrypt.hash(password, SECURITY_CONFIG.SALT_ROUNDS);
};

/**
 * Compare a password with its hash
 */
export const comparePassword = async (,
password: string,
hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a random token for email verification, password reset, etc.
 */
export const generateRandomToken = (length = 32): (string) => {
  // Use browser crypto for random bytes
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hash data with salt using SHA-256
 */
export const hashWithSalt = async (,
data: string,
salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Interface for decoded JWT payload
 */
interface DecodedToken {sub: string;,
  name: string;
  iat: number;
  exp: number;
}

/**
 * Verify a JWT token (Mock implementation)
 */
export const verifyToken = (,
token: string): DecodedToken | (null) => {
  if (!token) return null;
  // Mock decoding - in a real app, use jsonwebtoken.verify()
  const,
payload: DecodedToken = {sub: "1234567890",
  name: "John Doe",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
  };
  return payload;
};

/**
 * Rate limiting function
 */
export const rateLimit = (,
identifier: string): {allowed: boolean;
  resetIn: number } => {
  const now = Date.now();

  // Clean up old entries
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });

  // Initialize or update the rate limit record
  if (!rateLimitStore[identifier]) {
    rateLimitStore[identifier] = {count: 0,
  resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW
    };
  }

  const record = rateLimitStore[identifier];

  // Reset count if window has passed
  if (record.resetTime < now) {
    record.count = 0;
    record.resetTime = now + SECURITY_CONFIG.RATE_LIMIT_WINDOW;
  }

  // Check if limit exceeded
  if (record.count >= SECURITY_CONFIG.RATE_LIMIT_MAX) {
    return {allowed: false,
  resetIn: Math.ceil((record.resetTime - now) / 1000), // seconds until reset
    };
  }

  // Increment count
  record.count++;
  return {allowed: true,
  resetIn: Math.ceil((record.resetTime - now) / 1000)
  };
};

/**
 * Sanitize member input to prevent XSS attacks
 */
export const sanitizeInput = (,
input: string): (string) => {
  // Remove potentially dangerous characters
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Validate email format
 */
export const validateEmail = (,
email: string): (boolean) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (,
password: string): {valid: boolean;
  message: string } => {
  if (password.length < 8) {
    return {valid: false,
  message: "Password must be at least 8 characters long"
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {valid: false,
  message: "Password must contain at least one uppercase letter"
    };
  }

  if (!/[a-z]/.test(password)) {
    return {valid: false,
  message: "Password must contain at least one lowercase letter"
    };
  }

  if (!/[0-9]/.test(password)) {
    return {valid: false,
  message: "Password must contain at least one number"
    };
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return {valid: false,
  message: "Password must contain at least one special character"
    };
  }

  return {valid: true,
  message: "Password is valid" };
};

/**
 * Generate CSRF token
 */
export const generateCSRFToken = (): (string) => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate CSRF token
 */
export const validateCSRFToken = (,
token: string,
expectedToken: string): (boolean) => {
  // Simple constant-time comparison for hex strings
  if (token.length !== expectedToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }
  
  return result === 0;
};

/**
 * Create a secure session
 */
export const createSecureSession = (,
memberId: string,
additionalData: object = {}
): (SessionData) => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const sessionId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  const csrfToken = generateCSRFToken();

  const sessionData = {
    sessionId,
    memberId,
    csrfToken,
expiresAt: Date.now() + SECURITY_CONFIG.SESSION_TIMEOUT,
    ...additionalData
  };

  return sessionData as SessionData;
};

export interface SessionData {expiresAt: number;
  // Add other properties as needed based on actual usage
  [,
  key: string]: unknown;
}

/**
 * Validate session
 */
export const validateSession = (,
session: SessionData): (boolean) => {
  if (!session || !session.expiresAt) {
    return false;
  }

  return session.expiresAt > Date.now();
};

/**
 * Generates a CSRF token using UUID and timestamp
 */
export const generateCsrfToken = async (): Promise<string> => {
  const timestamp = Date.now().toString();
  const nonce = uuidv4();
  return hashWithSalt(timestamp + nonce, generateSalt());
};

/**
 * Hashes input with salt using PBKDF2
 */
export const deriveKey = async (,
data: string,
salt: string,
iterations: number = 10000): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const saltBuffer = encoder.encode(salt);

  // Import the key data as raw
  const key = await crypto.subtle.importKey(
    "raw",
    dataBuffer,
    {name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  // Derive the key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {name: "PBKDF2",
  salt: saltBuffer,
  iterations: iterations,
  hash: "SHA-256"
    },
    key,
    256 // Length in bits
  );

  // Convert to hex string
  const derivedArray = new Uint8Array(derivedBits);
  return Array.from(derivedArray, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Generates a cryptographically secure random salt
 */
export const generateSalt = (length = 12): (string) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validates password strength against security requirements
 */
export const validatePasswordStrength = (,
password: string
): {isValid: boolean;,
  errors: string[] } => {
  const,
errors: string[] = [];

  // Minimum length requirement
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Contains uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  // Contains lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  // Contains number
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // Contains special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {isValid: errors.length === 0,
  errors
  };
};

export const maskSensitiveData = (,
obj: Record<string, unknown>,
fieldsToMask: string[] = []
): Record<string, unknown> => {
  const defaultMaskedFields = [
    "password",
    "ssn",
    "cardNumber",
    "cvv",
    "pin",
    "secret",
    "token",
    "apiKey",
    "authToken",
    "refreshToken"
  ];

  const allMaskedFields = [...defaultMaskedFields, ...fieldsToMask];

  const maskedObj = { ...obj };

  for (const [key, value] of Object.entries(maskedObj)) {
    if (allMaskedFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      if (typeof value === "string") {
        // Mask the,
value: show first and last char, mask the rest
        if (value.length <= 2) {
          maskedObj[key] = "*".repeat(value.length);
        } else {
          maskedObj[key] = value.charAt(0) + "*".repeat(value.length - 2) + value.slice(-1);
        }
      } else {
        // For non-string values, just replace with asterisks
        maskedObj[key] = typeof value === "number" ? "***" : "***";
      }
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively mask nested objects
      maskedObj[key] = maskSensitiveData(value, fieldsToMask);
    }
  }

  return maskedObj;
};

/**
 * Checks if a URL is safe to navigate to or load content from
 */
export const isSafeUrl = (,
url: string): (boolean) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    // Allow localhost for development
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
      return true;
    }

    // Allow same origin
    if (parsedUrl.origin === window.location.origin) {
      return true;
    }

    // Allow HTTPS for production domains
    if (parsedUrl.protocol === ",
https:") {
      // Add additional trusted domains here if needed
      return true;
    }

    return false;
  } catch (e) {
    // Invalid URL
    return false;
  }
};

export default {
  hashPassword,
  comparePassword,
  generateRandomToken,
  verifyToken,
  rateLimit,
  sanitizeInput,
  validateEmail,
  validatePassword,
  generateCSRFToken,
  validateCSRFToken,
  createSecureSession,
  validateSession,
  generateCsrfToken,
  hashWithSalt,
  generateSalt,
  validatePasswordStrength,
  maskSensitiveData,
  isSafeUrl
};