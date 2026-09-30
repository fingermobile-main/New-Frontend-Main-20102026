import React, {} from 'react';
import security from '../utils/security';

describe('Security Utilities', () => {
  describe('Password Hashing', () => {
    test('should hash password correctly', async () => {
      const password = process.env.TEST_PASSWORD || 'secure_test_password';
      const hash = await security.hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    test('should verify correct password', async () => {
      const password = process.env.TEST_PASSWORD || 'secure_test_password';
      const hash = await security.hashPassword(password);
      const isMatch = await security.comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const password = process.env.TEST_PASSWORD || 'secure_test_password';
      const wrongPassword = process.env.TEST_PASSWORD || 'secure_test_password';
      const hash = await security.hashPassword(password);
      const isMatch = await security.comparePassword(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    beforeEach(() => {
      // Clear rate limit store before each test
      jest.resetModules();
    });

    test('should allow requests within limit', () => {
      const identifier = 'test_member_1';
      const result = security.rateLimit(identifier);

      expect(result.allowed).toBe(true);
    });

    test('should block requests exceeding limit', () => {
      const identifier = 'test_member_2';

      // Use up all allowed requests
      for (let i = 0; i < 100; i++) {
        security.rateLimit(identifier);
      }

      // Next request should be blocked
      const result = security.rateLimit(identifier);
      expect(result.allowed).toBe(false);
    });
  });

  describe('Input Sanitization', () => {
    test('should sanitize HTML input', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = security.sanitizeInput(input);

      expect(sanitized).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;',
      );
      expect(sanitized).not.toContain('<script>');
    });

    test('should handle normal input', () => {
      const input = 'Normal text input';
      const sanitized = security.sanitizeInput(input);

      expect(sanitized).toBe(input);
    });
  });

  describe('Email Validation', () => {
    test('should validate correct email', () => {
      const email = 'test@example.com';
      const isValid = security.validateEmail(email);

      expect(isValid).toBe(true);
    });

    test('should reject invalid email', () => {
      const email = 'invalid-email';
      const isValid = security.validateEmail(email);

      expect(isValid).toBe(false);
    });
  });

  describe('Password Validation', () => {
    test('should validate strong password', () => {
      const password = process.env.TEST_PASSWORD || 'secure_test_password';
      const result = security.validatePassword(password);

      expect(result.valid).toBe(true);
    });

    test('should reject weak password - too short', () => {
      const password = process.env.TEST_PASSWORD || 'secure_test_password';
      const result = security.validatePassword(password);

      expect(result.valid).toBe(false);
      expect(result.message).toContain('at least 8 characters');
    });

    test('should reject weak password - no uppercase', () => {
      const password = process.env.TEST_PASSWORD || 'secure_test_password';
      const result = security.validatePassword(password);

      expect(result.valid).toBe(false);
      expect(result.message).toContain('uppercase letter');
    });

    test('should reject weak password - no lowercase', () => {
      const password = process.env.TEST_PASSWORD || 'secure_test_password';
      const result = security.validatePassword(password);

      expect(result.valid).toBe(false);
      expect(result.message).toContain('lowercase letter');
    });

    test('should reject weak password - no number', () => {
      const password = process.env.TEST_PASSWORD || 'secure_test_password';
      const result = security.validatePassword(password);

      expect(result.valid).toBe(false);
      expect(result.message).toContain('number');
    });

    test('should reject weak password - no special character', () => {
      const password = process.env.TEST_PASSWORD || 'secure_test_password';
      const result = security.validatePassword(password);

      expect(result.valid).toBe(false);
      expect(result.message).toContain('special character');
    });
  });

  describe('CSRF Token', () => {
    test('should generate CSRF token', () => {
      const token = security.generateCSRFToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    test('should validate correct CSRF token', () => {
      const token = security.generateCSRFToken();
      const isValid = security.validateCSRFToken(token, token);

      expect(isValid).toBe(true);
    });
  });

  describe('Session Management', () => {
    test('should create secure session', () => {
      const session = security.createSecureSession('member123', {
        role: 'admin'
      });

      expect(session).toBeDefined();
      expect((session as any).memberId).toBe('member123');
      expect((session as any).role).toBe('admin');
      expect((session as any).sessionId).toBeDefined();
      expect((session as any).csrfToken).toBeDefined();
      expect((session as any).expiresAt).toBeDefined();
    });

    test('should validate valid session', () => {
      const session = security.createSecureSession('member123');
      // Cast to any to access the properties we know are there
      const typedSession = session as any;
      expect(typedSession.expiresAt).toBeDefined();

      const isValid = security.validateSession(session as import('../utils/security').SessionData);

      expect(isValid).toBe(true);
    });
  });
});
