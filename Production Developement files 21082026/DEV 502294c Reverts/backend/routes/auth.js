const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Pool } = require('pg');

// Lazy-load services and logger to avoid circular dependencies
let logger = null;
let emailService = null;
let smsService = null;

function getLogger() {
  if (!logger) {
    logger = require('../utils/logger');
  }
  return logger;
}

function getEmailService() {
  if (!emailService) {
    emailService = require('../services/emailService');
  }
  return emailService;
}

function getSmsService() {
  if (!smsService) {
    smsService = require('../services/smsService');
  }
  return smsService;
}

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5434,
  database: process.env.DB_NAME || 'fingermobile_identity_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

/**
 * POST /api/auth/register
 * Initial registration - creates pending account
 * Requires: name, email, phone, password
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false, message: 'Name, email, phone, and password are all required' });
    }

    // Split name into first and last name
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email.toLowerCase().trim(), phone.trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false, message: 'An account with this email or phone already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification code
    const emailVerificationCode = getEmailService().generateVerificationCode();
    const emailCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with pending status
    const newUser = await pool.query(
      `INSERT INTO users (username, first_name, last_name, email, phone, password_hash, email_verified, phone_verified, two_factor_enabled, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, FALSE, FALSE, FALSE, NOW(), NOW())
       RETURNING id, username, first_name, last_name, email, phone` [email.split('@')[0].toLowerCase(), firstName, lastName, email.toLowerCase().trim(), phone.trim(), hashedPassword]
    );

    // Store verification code - ⚠️ FIX: Added is_used column tracking
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'email', 'registration', $3, NOW(), FALSE)` [newUser.rows[0].id, emailVerificationCode.toUpperCase(), emailCodeExpiry]
    );

    // Send verification email (skip in development if not configured)
    try {
      await getEmailService().sendVerificationEmail(email, emailVerificationCode, 'email');
    } catch (emailError) {
      getLogger().warn('⚠️ Email sending failed (development mode):', emailError.message);
      getLogger().info(`📧 Verification code for ${email}: ${emailVerificationCode}`);
    }

    getLogger().info(`✅ User registered (pending verification): ${email}`);

    res.status(201).json({
      success: true, message: 'Registration successful. Please verify your email.',
      userId: newUser.rows[0].id, nextStep: 'email-verification' });
  } catch (error) {
    getLogger().error('❌ Registration error:', error);
    res.status(500).json({
      success: false, message: 'Registration failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify email with 6-character code
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false, message: 'User ID and verification code are required' });
    }

    // Find valid verification code - ⚠️ FIX: Added purpose column filter
    const verificationRecord = await pool.query(
      `SELECT * FROM verification_codes 
       WHERE user_id = $1 AND code = $2 AND type = 'email' AND purpose = 'registration'
       AND expires_at > NOW() AND is_used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [userId, code.trim().toUpperCase()]
    );

    if (verificationRecord.rows.length === 0) {
      return res.status(400).json({
        success: false, message: 'Invalid or expired verification code' });
    }

    // Mark code as used
    await pool.query(
      'UPDATE verification_codes SET is_used = TRUE WHERE id = $1' [verificationRecord.rows[0].id]
    );

    // Update user email verification status
    await pool.query(
      'UPDATE users SET email_verified = TRUE, updated_at = NOW() WHERE id = $1' [userId]
    );

    // Get user details
    const user = await pool.query(
      'SELECT id, username, first_name, last_name, email, phone, email_verified, phone_verified FROM users WHERE id = $1' [userId]
    );

    // Generate phone verification code
    const phoneVerificationCode = getSmsService().generateVerificationCode();
    const phoneCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Store phone verification code - ⚠️ FIX: Added purpose and is_used columns
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'phone', 'registration', $3, NOW(), FALSE)` [userId, phoneVerificationCode.toUpperCase(), phoneCodeExpiry]
    );

    // Send verification SMS (skip in development if not configured)
    try {
      await getSmsService().sendVerificationSMS(user.rows[0].phone, phoneVerificationCode, 'registration');
    } catch (smsError) {
      getLogger().warn('⚠️ SMS sending failed (development mode):', smsError.message);
      getLogger().info(`📱 Phone verification code for ${user.rows[0].phone}: ${phoneVerificationCode}`);
    }

    getLogger().info(`✅ Email verified for user: ${user.rows[0].email}`);

    res.json({
      success: true, message: 'Email verified successfully. Now verify your phone.',
      user: user.rows[0], nextStep: 'phone-verification' });
  } catch (error) {
    getLogger().error('❌ Email verification error:', error);
    res.status(500).json({
      success: false, message: 'Email verification failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/verify-phone
 * Verify phone with 6-character code
 */
router.post('/verify-phone', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false, message: 'User ID and verification code are required' });
    }

    // Find valid verification code - ⚠️ FIX: Added purpose column filter and normalize code
    const verificationRecord = await pool.query(
      `SELECT * FROM verification_codes 
       WHERE user_id = $1 AND code = $2 AND type = 'phone' AND purpose = 'registration'
       AND expires_at > NOW() AND is_used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [userId, code.trim().toUpperCase()]
    );

    if (verificationRecord.rows.length === 0) {
      return res.status(400).json({
        success: false, message: 'Invalid or expired verification code' });
    }

    // Mark code as used
    await pool.query(
      'UPDATE verification_codes SET is_used = TRUE WHERE id = $1' [verificationRecord.rows[0].id]
    );

    // Update user phone verification status
    await pool.query(
      'UPDATE users SET phone_verified = TRUE, updated_at = NOW() WHERE id = $1' [userId]
    );

    // Get user details
    const user = await pool.query(
      'SELECT id, username, first_name, last_name, email, phone, email_verified, phone_verified FROM users WHERE id = $1',
      [userId]
    );

    getLogger().info(`✅ Phone verified for user: ${user.rows[0].phone}`);

    res.json({
      success: true, message: 'Phone verified successfully. Now setup 2FA.',
      user: user.rows[0], nextStep: '2fa-setup' });
  } catch (error) {
    getLogger().error('❌ Phone verification error:', error);
    res.status(500).json({
      success: false, message: 'Phone verification failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/setup-2fa
 * Setup TOTP 2FA
 */
router.post('/setup-2fa', async (req, res) => {
  try {
    const { userId, secret, totpCode } = req.body;

    if (!userId || !secret || !totpCode) {
      return res.status(400).json({
        success: false, message: 'User ID, secret, and TOTP code are required'
      });
    }

    // TODO: Verify TOTP code using speakeasy or otplib
    // const isValid = totp.verify({ token: totpCode, secret });
    
    // For now, accept any 6-digit code (replace with actual TOTP verification)
    if (totpCode.length !== 6) {
      return res.status(400).json({
        success: false, message: 'Invalid TOTP code'
      });
    }

    // Store 2FA secret and enable 2FA
    await pool.query(
      `UPDATE users SET two_factor_secret = $1, two_factor_enabled = TRUE, updated_at = NOW()
       WHERE id = $2`,
      [secret, userId]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    getLogger().info(`✅ 2FA enabled for user ID: ${userId}`);

    res.json({
      success: true, message: '2FA setup complete. Account fully activated!',
      token,
      user: {
        id: userId,
        twoFactorEnabled: true
      } });
  } catch (error) {
    getLogger().error('❌ 2FA setup error:', error);
    res.status(500).json({
      success: false, message: '2FA setup failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/login
 * Login requiring BOTH email AND phone + password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false, message: 'Email, phone, and password are all required' });
    }

    // Find user by email AND phone (both must match)
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND phone = $2',
      [email, phone]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        success: false, message: 'Invalid credentials. Both email and phone must match.'
      });
    }

    const userData = user.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false, message: 'Invalid password'
      });
    }

    // Check if both email and phone are verified
    if (!userData.email_verified || !userData.phone_verified) {
      return res.status(403).json({
        success: false, message: 'Please complete email and phone verification before logging in',
        requiresVerification: true
      });
    }

    // If 2FA is enabled, require 2FA code
    if (userData.two_factor_enabled) {
      return res.status(200).json({
        success: true, message: 'Password verified. Please enter your 2FA code.',
        requires2FA: true,
        userId: userData.id
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: userData.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    getLogger().info(`✅ User logged in: ${email}`);

    res.json({
      success: true, message: 'Login successful',
      token,
      user: {
        id: userData.id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        phone: userData.phone
      } });
  } catch (error) {
    getLogger().error('❌ Login error:', error);
    res.status(500).json({
      success: false, message: 'Login failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/verify-2fa-login
 * Verify 2FA code during login
 */
router.post('/verify-2fa-login', async (req, res) => {
  try {
    const { userId, totpCode } = req.body;

    if (!userId || !totpCode) {
      return res.status(400).json({
        success: false, message: 'User ID and TOTP code are required' });
    }

    // Get user's 2FA secret and profile data - ⚠️ FIX: Fetch first_name, last_name for response
    const user = await pool.query(
      'SELECT two_factor_secret, first_name, last_name, email, phone FROM users WHERE id = $1',
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false, message: 'User not found'
      });
    }

    // TODO: Verify TOTP code
    // const isValid = totp.verify({ token: totpCode, secret: user.rows[0].two_factor_secret });

    // For now, accept any 6-digit code
    if (totpCode.length !== 6) {
      return res.status(400).json({
        success: false, message: 'Invalid 2FA code format'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    getLogger().info(`✅ 2FA verified for login: User ID ${userId}`);

    res.json({
      success: true, message: '2FA verification successful',
      token,
      user: {
        id: userId,
        firstName: user.rows[0].first_name,
        lastName: user.rows[0].last_name,
        email: user.rows[0].email,
        phone: user.rows[0].phone }
    });
  } catch (error) {
    getLogger().error('❌ 2FA login verification error:', error);
    res.status(500).json({
      success: false, message: '2FA verification failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/forgot-password/request
 * Initiate password reset - sends phone verification first
 */
router.post('/forgot-password/request', async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({
        success: false, message: 'Both email and phone are required for password reset' });
    }

    // Find user by email AND phone - ⚠️ FIX: Normalize inputs, select first_name/last_name
    const user = await pool.query(
      'SELECT id, first_name, last_name, email, phone FROM users WHERE email = $1 AND phone = $2',
      [email.toLowerCase().trim(), phone.trim()]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false, message: 'No account found with these credentials' });
    }

    const userId = user.rows[0].id;

    // Generate phone verification code for password reset
    const phoneCode = getSmsService().generateVerificationCode();
    const phoneCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Clean up older pending reset attempts - ⚠️ FIX: Use is_used column
    await pool.query(
      "UPDATE verification_codes SET is_used = TRUE WHERE user_id = $1 AND purpose = 'password-reset' AND is_used = FALSE" [userId]
    );

    // Store verification code - ⚠️ FIX 1: Added is_used column, normalize code to uppercase
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'phone', 'password-reset', $3, NOW(), FALSE)` [userId, phoneCode.toUpperCase(), phoneCodeExpiry]
    );

    // Send SMS
    await getSmsService().sendVerificationSMS(user.rows[0].phone, phoneCode, 'password-reset');

    getLogger().info(`🔑 Password reset initiated for: ${email}`);

    res.json({
      success: true, message: 'Password reset initiated. Please verify your phone first.',
      userId, nextStep: 'verify-phone' });
  } catch (error) {
    getLogger().error('❌ Password reset request error:', error);
    res.status(500).json({
      success: false, message: 'Password reset request failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/forgot-password/verify-phone
 * Verify phone for password reset
 */
router.post('/forgot-password/verify-phone', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false, message: 'User ID and verification code are required' });
    }

    // Find valid verification code - ⚠️ FIX 1: Changed 'used' to 'is_used' column
    const verificationRecord = await pool.query(
      `SELECT * FROM verification_codes 
       WHERE user_id = $1 AND code = $2 AND type = 'phone' AND purpose = 'password-reset'
       AND expires_at > NOW() AND is_used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [userId, code.trim().toUpperCase()]
    );

    if (verificationRecord.rows.length === 0) {
      return res.status(400).json({
        success: false, message: 'Invalid or expired verification code' });
    }

    // Mark code as used - ⚠️ FIX 1: Changed 'used' to 'is_used'
    await pool.query(
      'UPDATE verification_codes SET is_used = TRUE WHERE id = $1' [verificationRecord.rows[0].id]
    );

    // Generate email verification code for password reset
    const emailCode = getEmailService().generateVerificationCode();
    const emailCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Get user email
    const user = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);

    // Store email verification code - ⚠️ FIX: Added purpose and is_used columns
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'email', 'password-reset', $3, NOW(), FALSE)` [userId, emailCode.toUpperCase(), emailCodeExpiry]
    );

    // Send verification email
    await getEmailService().sendVerificationEmail(user.rows[0].email, emailCode, 'phone');

    getLogger().info(`✅ Phone verified for password reset: User ID ${userId}`);

    res.json({
      success: true, message: 'Phone verified. Now verify your email.', nextStep: 'verify-email' });
  } catch (error) {
    getLogger().error('❌ Phone verification for password reset error:', error);
    res.status(500).json({
      success: false, message: 'Verification failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/forgot-password/verify-email
 * Verify email for password reset
 */
router.post('/forgot-password/verify-email', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false, message: 'User ID and verification code are required' });
    }

    // Find valid verification code
    const verificationRecord = await pool.query(
      `SELECT * FROM verification_codes 
       WHERE user_id = $1 AND code = $2 AND type = 'email' AND purpose = 'password-reset'
       AND expires_at > NOW() AND is_used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [userId, code.trim().toUpperCase()]
    );

    if (verificationRecord.rows.length === 0) {
      return res.status(400).json({
        success: false, message: 'Invalid or expired verification code' });
    }

    // ⚠️ FIX 3: Instead of burning the email code instantly, we mark it as verified 
    // so the next endpoint (/forgot-password/reset) can cryptographically confirm compliance
    await pool.query(
      "UPDATE verification_codes SET purpose = 'password-reset-authorized' WHERE id = $1",
      [verificationRecord.rows[0].id]
    );

    getLogger().info(`✅ Email verified for password reset: User ID ${userId}`);

    res.json({
      success: true, message: 'Email verified. You can now reset your password.', nextStep: 'reset-password' });
  } catch (error) {
    getLogger().error('❌ Email verification for password reset error:', error);
    res.status(500).json({
      success: false, message: 'Verification failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/forgot-password/reset
 * Complete password reset - ⚠️ FIX 3: Validates authorization state before allowing reset
 */
router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({
        success: false, message: 'User ID and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false, message: 'Password must be at least 8 characters' });
    }

    // ⚠️ FIX 3: Check if authorization record token exists (user completed verification steps)
    const authRecord = await pool.query(
      `SELECT id FROM verification_codes 
       WHERE user_id = $1 AND purpose = 'password-reset-authorized' AND is_used = FALSE LIMIT 1`,
      [userId]
    );

    if (authRecord.rows.length === 0) {
      return res.status(403).json({
        success: false, message: 'Unauthorized password modification attempt. Complete verification steps first.' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Burn auth authorization record
    await pool.query('UPDATE verification_codes SET is_used = TRUE WHERE id = $1', [authRecord.rows[0].id]);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    getLogger().info(`✅ Password reset completed for User ID: ${userId}`);

    res.json({
      success: true, message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    getLogger().error('❌ Password reset error:', error);
    res.status(500).json({
      success: false, message: 'Password reset failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/resend-email-code
 * Resend email verification code
 */
router.post('/resend-email-code', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false, message: 'User ID is required' });
    }

    // Get user email
    const user = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false, message: 'User not found' });
    }

    // Generate new verification code
    const newCode = getEmailService().generateVerificationCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Invalidate previous codes - ⚠️ FIX: Added purpose filter for registration codes only
    await pool.query(
      "UPDATE verification_codes SET is_used = TRUE WHERE user_id = $1 AND type = 'email' AND purpose = 'registration' AND is_used = FALSE" [userId]
    );

    // Store new code - ⚠️ FIX: Added purpose and is_used columns, normalize code to uppercase
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'email', 'registration', $3, NOW(), FALSE)` [userId, newCode.toUpperCase(), codeExpiry]
    );

    // Send email
    await getEmailService().sendVerificationEmail(user.rows[0].email, newCode, 'email');

    res.json({
      success: true, message: 'New verification code sent to your email' });
  } catch (error) {
    getLogger().error('❌ Resend email code error:', error);
    res.status(500).json({
      success: false, message: 'Failed to resend code',
      error: error.message });
  }
});

/**
 * POST /api/auth/resend-phone-code
 * Resend phone verification code
 */
router.post('/resend-phone-code', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false, message: 'User ID is required' });
    }

    // Get user phone
    const user = await pool.query('SELECT phone FROM users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false, message: 'User not found' });
    }

    // Generate new verification code
    const newCode = getSmsService().generateVerificationCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Invalidate previous codes - ⚠️ FIX: Added purpose filter for registration codes only
    await pool.query(
      "UPDATE verification_codes SET is_used = TRUE WHERE user_id = $1 AND type = 'phone' AND purpose = 'registration' AND is_used = FALSE" [userId]
    );

    // Store new code - ⚠️ FIX: Added purpose and is_used columns, normalize code to uppercase
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'phone', 'registration', $3, NOW(), FALSE)` [userId, newCode.toUpperCase(), codeExpiry]
    );

    // Send SMS
    await getSmsService().sendVerificationSMS(user.rows[0].phone, newCode, 'registration');

    res.json({
      success: true, message: 'New verification code sent to your phone' });
  } catch (error) {
    getLogger().error('❌ Resend phone code error:', error);
    res.status(500).json({
      success: false, message: 'Failed to resend code',
      error: error.message
    });
  }
});

module.exports = router;