import React, {} from 'react';
import securityMiddleware from '../middleware/securityMiddleware';

describe("Frontend Security Middleware", () => {
  afterEach(() => {
    // Clean up localStorage/sessionStorage after each test
    localStorage.clear();
    sessionStorage.clear();
  });

  describe("CSRF Protection", () => {
    test("should validate matching tokens", () => {
      const isValid = securityMiddleware.csrfTokenCheck("token123", "token123");
      expect(isValid).toBe(true);
    });

    test("should invalidate non-matching tokens", () => {
      const isValid = securityMiddleware.csrfTokenCheck("token123", "differentToken");
      expect(isValid).toBe(false);
    });

    test("should invalidate when either token is missing", () => {
      const isMissingRequestToken = securityMiddleware.csrfTokenCheck(undefined, "token123");
      const isMissingStoredToken = securityMiddleware.csrfTokenCheck("token123", undefined);
      
      expect(isMissingRequestToken).toBe(false);
      expect(isMissingStoredToken).toBe(false);
    });
  });

  describe("Rate Limiting", () => {
    test("should allow requests under the limit", () => {
      const allowed = securityMiddleware.checkRateLimit("test_user", 5);
      expect(allowed).toBe(true);
    });

    test("should block requests exceeding the limit", () => {
      // Simulate reaching the rate limit
      for (let i = 0; i < 101; i++) {
        securityMiddleware.checkRateLimit("limited_user", 100);
      }
      
      const allowed = securityMiddleware.checkRateLimit("limited_user", 100);
      expect(allowed).toBe(false);
    });
  });

  describe("Input Sanitization", () => {
    test("should sanitize HTML input", () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = securityMiddleware.sanitizeInput(input);

      expect(sanitized).toBe(
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
      );
      expect(sanitized).not.toContain("<script>");
    });

    test("should handle normal input", () => {
      const input = "Normal text input";
      const sanitized = securityMiddleware.sanitizeInput(input);

      expect(sanitized).toBe(input);
    });

    test("should handle non-string inputs", () => {
      const input = 12345;
      const sanitized = securityMiddleware.sanitizeInput(input);

      expect(sanitized).toBe(input);
    });
  });

  describe("Authentication", () => {
    test("should detect authenticated user", () => {
      localStorage.setItem("token", "valid_token");
      const isAuthenticated = securityMiddleware.isAuthenticated();
      
      expect(isAuthenticated).toBe(true);
    });

    test("should detect unauthenticated user", () => {
      const isAuthenticated = securityMiddleware.isAuthenticated();
      
      expect(isAuthenticated).toBe(false);
    });
  });

  describe("Role-based Access Control", () => {
    test("should grant access to authorized roles", () => {
      const hasPermission = securityMiddleware.hasRole(["admin", "moderator"], "admin");
      expect(hasPermission).toBe(true);
    });

    test("should deny access to unauthorized roles", () => {
      const hasPermission = securityMiddleware.hasRole(["admin", "moderator"], "user");
      expect(hasPermission).toBe(false);
    });

    test("should deny access when user has no role", () => {
      const hasPermission = securityMiddleware.hasRole(["admin", "moderator"], undefined);
      expect(hasPermission).toBe(false);
    });
  });

  describe("CSRF Token Management", () => {
    test("should generate a valid CSRF token", () => {
      const token = securityMiddleware.generateCsrfToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    test("should store and retrieve CSRF token", () => {
      const token = securityMiddleware.generateCsrfToken();
      securityMiddleware.storeCsrfToken(token);
      
      const retrievedToken = securityMiddleware.getCsrfToken();
      expect(retrievedToken).toBe(token);
    });
  });
});
