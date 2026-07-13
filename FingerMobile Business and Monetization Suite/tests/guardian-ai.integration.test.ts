/**
 * Integration Tests for Guardian AI Services
 * Tests access key generation, coupon generation, naming validation, and biometric hashing
 */

import { describe, it, expect } from 'vitest';
import {
  guardianAI,
  generateAccessKey,
  generateCouponCode,
  validateBusinessName,
  generateBiometricHash,
  validateAccessKeyFormat,
  validateCouponCode,
  validateBiometricHash,
} from '../guardian-ai-service.js';

describe('Guardian AI Services - Integration Tests', () => {
  
  // ============================================================
  // Access Key Generator Tests
  // ============================================================
  
  describe('Access Key Generation', () => {
    it('should generate a valid 16-character access key with dashes', () => {
      const key = generateAccessKey();
      
      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
      expect(key.length).toBe(19); // 16 chars + 3 dashes
      
      // Check format: XXXX-XXXX-XXXX-XXXX
      const parts = key.split('-');
      expect(parts.length).toBe(4);
      expect(parts[0].length).toBe(4);
      expect(parts[1].length).toBe(4);
      expect(parts[2].length).toBe(4);
      expect(parts[3].length).toBe(4);
    });

    it('should generate unique keys on multiple calls', () => {
      const keys = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        const key = generateAccessKey();
        keys.add(key);
      }
      
      // All 100 keys should be unique
      expect(keys.size).toBe(100);
    });

    it('should validate correct access key format', () => {
      expect(validateAccessKeyFormat('A1B2-C3D4-E5F6-G7H8')).toBe(true);
      expect(validateAccessKeyFormat('ABCD-1234-EFGH-5678')).toBe(true);
      expect(validateAccessKeyFormat('ZZZZ-9999-AAAA-0000')).toBe(true);
    });

    it('should reject invalid access key formats', () => {
      expect(validateAccessKeyFormat('ABC-C3D4-E5F6-G7H8')).toBe(false); // Too short
      expect(validateAccessKeyFormat('ABCDE-C3D4-E5F6-G7H8')).toBe(false); // Too long
      expect(validateAccessKeyFormat('A1B2-C3D4-E5F6-G7H')).toBe(false); // Missing char
      expect(validateAccessKeyFormat('a1b2-c3d4-e5f6-g7h8')).toBe(false); // Lowercase
      expect(validateAccessKeyFormat('A1B2C3D4E5F6G7H8')).toBe(false); // No dashes
      expect(validateAccessKeyFormat('A1B2-C3D4-E5F6-G7H!')).toBe(false); // Special char
    });

    it('should generate keys via service method', async () => {
      const result = await guardianAI.createAccessKey('seshat_001', 'MEMBERSHIP', 90);
      
      expect(result).toBeDefined();
      expect(result.keyToken).toBeDefined();
      expect(result.expiresAt).toBeDefined();
      expect(validateAccessKeyFormat(result.keyToken)).toBe(true);
      
      // Check expiry date is approximately 90 days from now
      const now = new Date();
      const expires = new Date(result.expiresAt);
      const diffDays = (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      expect(diffDays).toBeGreaterThan(89);
      expect(diffDays).toBeLessThan(91);
    });
  });

  // ============================================================
  // Coupon Code Generator Tests
  // ============================================================
  
  describe('Coupon Code Generation', () => {
    it('should generate a valid coupon code without prefix', () => {
      const code = generateCouponCode();
      
      expect(code).toBeDefined();
      expect(typeof code).toBe('string');
      expect(code.length).toBe(12);
      expect(/^[A-Z0-9]{12}$/.test(code)).toBe(true);
    });

    it('should generate a valid coupon code with prefix', () => {
      const code = generateCouponCode('TECH');
      
      expect(code).toBeDefined();
      expect(code.startsWith('TECH-')).toBe(true);
      
      const parts = code.split('-');
      expect(parts.length).toBe(2);
      expect(parts[0]).toBe('TECH');
      expect(parts[1].length).toBe(12);
    });

    it('should sanitize prefix to uppercase alphanumeric', () => {
      const code1 = generateCouponCode('tech');
      expect(code1.startsWith('TECH-')).toBe(true);
      
      const code2 = generateCouponCode('Tech@Store!');
      // 'Tech@Store!' -> 'TECHSTORE' (9 chars) -> truncated to 'TECHSTOR' (8 chars max)
      expect(code2.startsWith('TECHSTOR-')).toBe(true);
    });

    it('should truncate long prefixes', () => {
      const code = generateCouponCode('VERYLONGPREFIX123456');
      const prefix = code.split('-')[0];
      expect(prefix.length).toBeLessThanOrEqual(8);
    });

    it('should validate correct coupon formats', () => {
      expect(validateCouponCode('TECH-A1B2C3D4E5F6')).toBe(true);
      expect(validateCouponCode('SUMMER2024-X9Y8Z7W6V5U4')).toBe(true);
      expect(validateCouponCode('A1B2C3D4E5F6')).toBe(true); // Without prefix
    });

    it('should reject invalid coupon formats', () => {
      expect(validateCouponCode('TECH-A1B2C3D4E5F')).toBe(false); // Random part too short
      expect(validateCouponCode('TECH-A1B2C3D4E5F6G')).toBe(false); // Random part too long
      expect(validateCouponCode('tech-a1b2c3d4e5f6')).toBe(false); // Lowercase
      expect(validateCouponCode('TECH_A1B2C3D4E5F6')).toBe(false); // Underscore instead of dash
      expect(validateCouponCode('TOOLONGPREFIX-A1B2C3D4E5F6')).toBe(false); // Prefix too long
    });

    it('should generate unique coupons via service method', async () => {
      const codes = new Set<string>();
      
      for (let i = 0; i < 50; i++) {
        const code = await guardianAI.createCoupon('seshat_001', 'TEST');
        codes.add(code);
      }
      
      // All 50 codes should be unique
      expect(codes.size).toBe(50);
    });
  });

  // ============================================================
  // Naming Validator Tests
  // ============================================================
  
  describe('Business Name Validation', () => {
    it('should accept valid business names', () => {
      const validNames = [
        'Tech Startup Pro',
        'Creative Studio LLC',
        'Digital Marketing Hub',
        'Innovation Labs',
        'Global Solutions Inc',
      ];

      validNames.forEach(name => {
        const result = validateBusinessName(name);
        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
      });
    });

    it('should reject names that are too short', () => {
      const result = validateBusinessName('Short');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must be at least 8 characters long');
    });

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(31);
      const result = validateBusinessName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must not exceed 30 characters');
    });

    it('should reject names with special characters', () => {
      const result = validateBusinessName('Tech@Startup!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Special characters, emojis, and symbols are not allowed');
    });

    it('should reject names with URLs', () => {
      const result = validateBusinessName('Visit www.example.com');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('URLs are not allowed in names');
    });

    it('should reject names with prohibited terms', () => {
      const prohibitedTerms = [
        'Best Tech Store',
        'Official FingerMobile Partner',
        'Cheap Products Online',
        'Free Services 24x7',
        'WhatsApp Business Tools',
      ];

      prohibitedTerms.forEach(name => {
        const result = validateBusinessName(name);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should warn about ALL CAPS names', () => {
      const result = validateBusinessName('TECH STARTUP PRO');
      expect(result.warnings).toContain('ALL CAPS names should only be used for recognized acronyms');
    });

    it('should accept short acronyms in ALL CAPS', () => {
      const result = validateBusinessName('IBM Consulting');
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBe(0);
    });

    it('should sanitize names to title case', () => {
      const result = validateBusinessName('tech startup pro');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedName).toBe('Tech Startup Pro');
    });

    it('should handle service method validation', () => {
      const result = guardianAI.validateName('My Awesome Business');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedName).toBe('My Awesome Business');
    });
  });

  // ============================================================
  // Biometric Hash Generator Tests
  // ============================================================
  
  describe('Biometric Hash Generation', () => {
    it('should generate a valid SHA-256 hash from string input', () => {
      const hash = generateBiometricHash('test_face_data');
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.startsWith('sha256:')).toBe(true);
      expect(hash.length).toBe(71); // 'sha256:' (7) + 64 hex chars
    });

    it('should generate consistent hashes for same input', () => {
      const input = 'consistent_face_data';
      const hash1 = generateBiometricHash(input);
      const hash2 = generateBiometricHash(input);
      
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = generateBiometricHash('face_data_1');
      const hash2 = generateBiometricHash('face_data_2');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should validate correct hash format', () => {
      // Valid SHA-256 hash (64 lowercase hex characters)
      const validHash = 'sha256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2';
      expect(validateBiometricHash(validHash)).toBe(true);
    });

    it('should reject invalid hash formats', () => {
      expect(validateBiometricHash('md5:a1b2c3d4')).toBe(false); // Wrong algorithm
      expect(validateBiometricHash('sha256:short')).toBe(false); // Too short
      expect(validateBiometricHash('sha256:' + 'g'.repeat(64))).toBe(false); // Invalid hex char
      expect(validateBiometricHash('a1b2c3d4e5f6...')).toBe(false); // Missing prefix
    });

    it('should generate hash via service method', () => {
      const hash = guardianAI.generateBiometricHash('service_test_data');
      expect(validateBiometricHash(hash)).toBe(true);
    });
  });

  // ============================================================
  // Edge Cases and Error Handling
  // ============================================================
  
  describe('Edge Cases and Error Handling', () => {
    it('should handle empty strings gracefully', () => {
      const result = validateBusinessName('');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle whitespace-only names', () => {
      const result = validateBusinessName('   ');
      expect(result.isValid).toBe(false);
    });

    it('should trim whitespace from names', () => {
      const result = validateBusinessName('  Tech Startup  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedName).toBe('Tech Startup');
    });

    it('should handle Buffer input for biometric hash', () => {
      const buffer = Buffer.from('binary_face_data');
      const hash = generateBiometricHash(buffer);
      expect(validateBiometricHash(hash)).toBe(true);
    });

    it('should handle very long face data', () => {
      const longData = 'a'.repeat(10000);
      const hash = generateBiometricHash(longData);
      expect(validateBiometricHash(hash)).toBe(true);
    });
  });
});
