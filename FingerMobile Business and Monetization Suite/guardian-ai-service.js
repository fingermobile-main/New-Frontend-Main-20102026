/* eslint-disable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardianAI = exports.GuardianAIService = void 0;
exports.generateAccessKey = generateAccessKey;
exports.validateAccessKeyFormat = validateAccessKeyFormat;
exports.generateCouponCode = generateCouponCode;
exports.validateCouponCode = validateCouponCode;
exports.validateBusinessName = validateBusinessName;
exports.generateBiometricHash = generateBiometricHash;
exports.validateBiometricHash = validateBiometricHash;
exports.isTokenUnique = isTokenUnique;
const crypto_1 = require("crypto");
/**
 * Guardian AI Services
 * Implements core AI-powered validation and generation features
 * - Access Key Generator (16-char alphanumeric, unique, non-recyclable)
 * - Coupon Code Generator (unique, non-recyclable)
 * - Naming Validator (8-30 chars, grammar rules, prohibited terms)
 * - Biometric Hash Generator
 */
// ============================================================
// Configuration Constants
// ============================================================
const ACCESS_KEY_LENGTH = 16;
const COUPON_CODE_LENGTH = 12;
const ALPHANUMERIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const PROHIBITED_TERMS = [
    'best', 'official', 'cheap', 'free', '24x7',
    'fingermobile', 'finger', 'protocol', 'whatsapp', 'meta',
    'clothing', 'bakery', 'real estate' // Generic terms
];
const GRAMMAR_RULES = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 30,
    ALLOWED_SPECIAL_CHARS: [], // No special characters allowed
    MAX_CONSECUTIVE_CAPS: 1, // Only first letter of each word
};
// ============================================================
// Access Key Generator
// ============================================================
/**
 * Generates a unique 16-character alphanumeric access key
 * Format: XXXX-XXXX-XXXX-XXXX (with dashes for readability)
 * Uses cryptographically secure random generation
 */
function generateAccessKey() {
    const rawToken = generateRandomToken(ACCESS_KEY_LENGTH);
    // Format with dashes for readability: A1B2-C3D4-E5F6-G7H8
    return `${rawToken.slice(0, 4)}-${rawToken.slice(4, 8)}-${rawToken.slice(8, 12)}-${rawToken.slice(12, 16)}`;
}
/**
 * Generates a raw random token without formatting
 */
function generateRandomToken(length) {
    let token = '';
    const bytes = crypto_1.default.randomBytes(length);
    for (let i = 0; i < length; i++) {
        const index = bytes[i] % ALPHANUMERIC_CHARS.length;
        token += ALPHANUMERIC_CHARS[index];
    }
    return token;
}
/**
 * Validates access key format
 */
function validateAccessKeyFormat(key) {
    // Check format: XXXX-XXXX-XXXX-XXXX (4 groups of 4 chars separated by dashes)
    const formatRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!formatRegex.test(key)) {
        return false;
    }
    // Remove dashes and check length
    const cleanKey = key.replace(/-/g, '');
    if (cleanKey.length !== ACCESS_KEY_LENGTH) {
        return false;
    }
    // Check alphanumeric only (already validated by regex, but double-check)
    const alphanumericRegex = /^[A-Z0-9]+$/;
    return alphanumericRegex.test(cleanKey);
}
// ============================================================
// Coupon Code Generator
// ============================================================
/**
 * Generates a unique coupon code
 * Format: PREFIX-RANDOM (e.g., TECH-A1B2C3D4E5F6)
 */
function generateCouponCode(prefix = '') {
    const randomPart = generateRandomToken(COUPON_CODE_LENGTH).toUpperCase();
    if (prefix) {
        // Convert to uppercase first, then remove non-alphanumeric characters
        const cleanPrefix = prefix.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
        return `${cleanPrefix}-${randomPart}`;
    }
    return randomPart;
}
/**
 * Validates coupon code format
 */
function validateCouponCode(code) {
    // Allow formats like "TECH-A1B2C3D4E5F6" or just "A1B2C3D4E5F6"
    const parts = code.split('-');
    if (parts.length === 2) {
        // Prefix + random format
        const prefixValid = /^[A-Z0-9]{1,12}$/.test(parts[0]); // Allow up to 12 chars for flexibility
        const randomValid = /^[A-Z0-9]{12}$/.test(parts[1]);
        return prefixValid && randomValid;
    }
    else if (parts.length === 1) {
        // Just random part
        return /^[A-Z0-9]{12}$/.test(parts[0]);
    }
    return false;
}
/**
 * Validates business/page name according to platform rules
 * Rules:
 * - 8-30 characters
 * - Proper capitalization (only first letter of each word)
 * - No ALL CAPS except acronyms
 * - No special characters, emojis, URLs
 * - No generic terms, locations, promotional words
 * - No platform references (FingerMobile, WhatsApp, Meta, etc.)
 */
function validateBusinessName(name) {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
    };
    // Trim whitespace
    const trimmedName = name.trim();
    // Check length
    if (trimmedName.length < GRAMMAR_RULES.MIN_LENGTH) {
        result.isValid = false;
        result.errors.push(`Name must be at least ${GRAMMAR_RULES.MIN_LENGTH} characters long`);
    }
    if (trimmedName.length > GRAMMAR_RULES.MAX_LENGTH) {
        result.isValid = false;
        result.errors.push(`Name must not exceed ${GRAMMAR_RULES.MAX_LENGTH} characters`);
    }
    // Check for special characters
    const specialCharRegex = /[~!@#$%^&*()_+:;"'{}[\]\\|<>,/?®™©]/;
    if (specialCharRegex.test(trimmedName)) {
        result.isValid = false;
        result.errors.push('Special characters, emojis, and symbols are not allowed');
    }
    // Check for URLs
    const urlRegex = /(https?:\/\/|www\.)/i;
    if (urlRegex.test(trimmedName)) {
        result.isValid = false;
        result.errors.push('URLs are not allowed in names');
    }
    // Check for extra spaces
    if (/\s{2,}/.test(trimmedName)) {
        result.isValid = false;
        result.errors.push('Multiple consecutive spaces are not allowed');
    }
    // Convert to lowercase for term checking
    const lowerName = trimmedName.toLowerCase();
    // Check for prohibited terms
    for (const term of PROHIBITED_TERMS) {
        if (lowerName.includes(term)) {
            result.isValid = false;
            result.errors.push(`Prohibited term found: "${term}"`);
        }
    }
    // Check for geographical locations (basic check)
    const locationPattern = /\b(new york|nigeria|london|paris|tokyo|china|india|usa|uk)\b/i;
    if (locationPattern.test(trimmedName)) {
        result.warnings.push('Geographical locations alone are not recommended');
    }
    // Check capitalization (should not be ALL CAPS unless acronym)
    if (trimmedName === trimmedName.toUpperCase() && trimmedName.length > 3) {
        result.warnings.push('ALL CAPS names should only be used for recognized acronyms');
    }
    // Sanitize name if valid
    if (result.isValid) {
        result.sanitizedName = sanitizeName(trimmedName);
    }
    return result;
}
/**
 * Sanitizes a name by applying proper capitalization rules
 */
function sanitizeName(name) {
    // Title case: capitalize first letter of each word
    return name
        .split(' ')
        .map(word => {
        if (word.length === 0)
            return word;
        // Keep acronyms (all caps) as-is if they're short
        if (word === word.toUpperCase() && word.length <= 4) {
            return word;
        }
        // Otherwise, title case
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
        .join(' ');
}
// ============================================================
// Biometric Hash Generator
// ============================================================
/**
 * Generates a SHA-256 hash for biometric face data
 * In production, this would process actual biometric data
 * For now, it creates a deterministic hash from input
 */
function generateBiometricHash(faceData) {
    const hash = crypto_1.default.createHash('sha256');
    if (typeof faceData === 'string') {
        hash.update(faceData);
    }
    else {
        hash.update(faceData);
    }
    return `sha256:${hash.digest('hex')}`;
}
/**
 * Validates biometric hash format
 */
function validateBiometricHash(hash) {
    const hashRegex = /^sha256:[a-f0-9]{64}$/;
    return hashRegex.test(hash);
}
// ============================================================
// Token Uniqueness Checker
// ============================================================
/**
 * Checks if a token is unique (to be implemented with database query)
 * This is a placeholder that should be replaced with actual DB check
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function isTokenUnique(_token, _type) {
    // TODO: Implement database query to check uniqueness
    // For now, assume all generated tokens are unique
    // In production, query the appropriate table:
    // - access_keys table for access_key type
    // - coupons table for coupon type
    console.warn('Token uniqueness check not implemented - using mock validation');
    return true;
}
// ============================================================
// Guardian AI Service Class
// ============================================================
class GuardianAIService {
    /**
     * Generate and validate a new access key
     */
    async createAccessKey(seshatPageId, keyType, expiryDays = 30) {
        const keyToken = generateAccessKey();
        // Validate format
        if (!validateAccessKeyFormat(keyToken)) {
            throw new Error('Generated access key has invalid format');
        }
        // Check uniqueness
        const isUnique = await isTokenUnique(keyToken, 'access_key');
        if (!isUnique) {
            // Regenerate if not unique (extremely rare)
            return this.createAccessKey(seshatPageId, keyType, expiryDays);
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiryDays);
        return {
            keyToken,
            expiresAt,
        };
    }
    /**
     * Generate and validate a new coupon code
     */
    async createCoupon(seshatPageId, prefix) {
        const couponCode = generateCouponCode(prefix);
        // Validate format
        if (!validateCouponCode(couponCode)) {
            throw new Error('Generated coupon code has invalid format');
        }
        // Check uniqueness
        const isUnique = await isTokenUnique(couponCode, 'coupon');
        if (!isUnique) {
            // Regenerate if not unique
            return this.createCoupon(seshatPageId, prefix);
        }
        return couponCode;
    }
    /**
     * Validate a business name
     */
    validateName(name) {
        return validateBusinessName(name);
    }
    /**
     * Generate biometric hash
     */
    generateBiometricHash(faceData) {
        return generateBiometricHash(faceData);
    }
}
exports.GuardianAIService = GuardianAIService;
// Export singleton instance
exports.guardianAI = new GuardianAIService();
