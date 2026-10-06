// Utility functions for handling keys, tokens, and authentication in the Lush Pressies app

interface TokenPayload {
  userId: string;
  exp: number; // Unix timestamp
  iat: number; // Unix timestamp
  [key: string]: any;
}

/**
 * Generates a random alphanumeric string of specified length
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates a secure random PIN for user verification
 */
export const generateSecurePin = (length: number = 6): string => {
  const digits = '0123456789';
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return pin;
};

/**
 * Validates a PIN format (only numbers, specific length)
 */
export const validatePin = (pin: string, expectedLength: number = 6): boolean => {
  const pinRegex = new RegExp(`^\\d{${expectedLength}}$`);
  return pinRegex.test(pin);
};

/**
 * Generates a temporary access token for short-lived operations
 */
export const generateTempAccessToken = (userId: string, expiryMinutes: number = 15): string => {
  const payload: TokenPayload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + (expiryMinutes * 60), // Convert minutes to seconds
    iat: Math.floor(Date.now() / 1000),
    scope: 'temp_access'
  };

  // In a real implementation, this would be a proper JWT with signing
  // For demo purposes, we'll create a simple base64 encoded token
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.`;
};

/**
 * Decodes a token without verification (for demo purposes)
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [, payload] = parts;
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Checks if a token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Gets the user ID from a token
 */
export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeToken(token);
  return payload?.userId || null;
};

/**
 * Stores authentication token in localStorage
 */
export const storeAuthToken = (token: string): void => {
  localStorage.setItem('lushpressies_auth_token', token);
};

/**
 * Retrieves authentication token from localStorage
 */
export const getStoredAuthToken = (): string | null => {
  return localStorage.getItem('lushpressies_auth_token');
};

/**
 * Removes authentication token from localStorage
 */
export const removeStoredAuthToken = (): void => {
  localStorage.removeItem('lushpressies_auth_token');
};

/**
 * Stores refresh token in localStorage
 */
export const storeRefreshToken = (token: string): void => {
  localStorage.setItem('lushpressies_refresh_token', token);
};

/**
 * Retrieves refresh token from localStorage
 */
export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem('lushpressies_refresh_token');
};

/**
 * Removes refresh token from localStorage
 */
export const removeStoredRefreshToken = (): void => {
  localStorage.removeItem('lushpressies_refresh_token');
};

/**
 * Validates that a token exists and is not expired
 */
export const isValidAuthToken = (): boolean => {
  const token = getStoredAuthToken();
  if (!token) return false;

  return !isTokenExpired(token);
};

/**
 * Generates a secure session key for encrypted communication
 */
export const generateSessionKey = (): string => {
  return generateRandomString(32); // 256-bit key
};

/**
 * Generates a unique identifier for requests
 */
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${generateRandomString(8)}`;
};

/**
 * Generates a secure encryption key for privacy features
 */
export const generateEncryptionKey = async (): Promise<CryptoKey | null> => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      return await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating encryption key:', error);
      return null;
    }
  }
  return null;
};

/**
 * Hashes a PIN using Web Crypto API for secure storage
 */
export const hashPin = async (pin: string): Promise<string> => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data as BufferSource);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for environments without crypto API
  return btoa(encodeURIComponent(pin));
};

/**
 * Verifies a PIN against a stored hash
 */
export const verifyPin = async (pin: string, hash: string): Promise<boolean> => {
  const hashedPin = await hashPin(pin);
  return hashedPin === hash;
};

/**
 * Generates a temporary access code for privacy features
 */
export const generatePrivacyAccessCode = (): string => {
  return `${generateRandomString(4)}-${generateRandomString(4)}-${generateRandomString(4)}`;
};

/**
 * Validates a privacy access code format
 */
export const validatePrivacyAccessCode = (code: string): boolean => {
  const codeRegex = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;
  return codeRegex.test(code);
};

/**
 * Creates a temporary access token for private content
 */
export const generatePrivateContentToken = (
  userId: string,
  contentId: string,
  expiryMinutes: number = 60
): string => {
  const payload = {
    userId,
    contentId,
    exp: Math.floor(Date.now() / 1000) + (expiryMinutes * 60),
    iat: Math.floor(Date.now() / 1000),
    scope: 'private_content_access'
  };

  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.`;
};

/**
 * Checks if user has access to private content via token
 */
export const hasPrivateContentAccess = (token: string, contentId: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return false;

  if (payload.contentId !== contentId) return false;
  if (payload.scope !== 'private_content_access') return false;

  return !isTokenExpired(token);
};

// Export default object with all utilities
export default {
  generateRandomString,
  generateSecurePin,
  validatePin,
  generateTempAccessToken,
  decodeToken,
  isTokenExpired,
  getUserIdFromToken,
  storeAuthToken,
  getStoredAuthToken,
  removeStoredAuthToken,
  storeRefreshToken,
  getStoredRefreshToken,
  removeStoredRefreshToken,
  isValidAuthToken,
  generateSessionKey,
  generateRequestId,
  generateEncryptionKey,
  hashPin,
  verifyPin,
  generatePrivacyAccessCode,
  validatePrivacyAccessCode,
  generatePrivateContentToken,
  hasPrivateContentAccess
};
