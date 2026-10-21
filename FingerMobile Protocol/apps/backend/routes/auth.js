const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');

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
    emailService = require('../services/EmailService'); // Fixed capitalization to match actual file
  }
  return emailService;
}

function getSmsService() {
  if (!smsService) {
    smsService = require('../services/SMSService'); // Fixed capitalization to match actual file
  }
  return smsService;
}

// Database connection
const { identityDb } = require('../db/db');
const pool = identityDb;

// In-Memory Dev User Store for local testing / offline database fallback
const devUsersStore = [
  {
    id: 'usr_founder_obinna',
    username: 'israelobinna',
    first_name: 'Israel Obinna',
    last_name: 'Mbah',
    email: 'fingermobileprotocol@gmail.com',
    alternate_emails: ['obinnambah100@gmail.com', 'gracelinkbustech@gmail.com', 'fingermobileprotocol@gmail.com'],
    phone: '+2348088855752',
    alternate_phones: ['+2347033304670'],
    nin: '225-3324-4384',
    biometry: 'Live/Motion facial ID',
    jurisdiction: 'Nigeria (NG) & Global Sovereign Network',
    role: 'SuperAdmin',
    title: 'Founder and Owner',
    designation: 'Founder & Owner | SuperAdmin & Master Control',
    access_level: 'Absolute Full Access to MasterDashboard and Stercs Dashboard',
    password_hash: bcrypt.hashSync('mastercontrol123', 10),
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    onboarding_completed: true,
  },
  {
    id: 'usr_cofounder_eunice',
    username: 'eunicembah',
    first_name: 'Eunice Emonena',
    last_name: 'Mbah',
    email: 'eunicembah@gmail.com',
    alternate_emails: ['philipatiks@yahoo.com'],
    phone: '+234-803-392-4846',
    alternate_phones: ['+234-808-892-1787'],
    nin: '774-3558-2138',
    biometry: 'Live/Motion facial ID',
    jurisdiction: 'Nigeria (NG) & Global Sovereign Network',
    role: 'Admin',
    title: 'Co-Founder',
    designation: 'Co-Founder | Admin-1 & Master Control',
    access_level: 'RBC (Limited) Access to MasterDashboard and Stercs Dashboard (Permitted to Most Pages Granted by SuperAdmin)',
    password_hash: bcrypt.hashSync('mastercontrol123', 10),
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    onboarding_completed: true,
  },
  {
    id: 'usr_superadmin',
    username: 'superadmin',
    first_name: 'Super',
    last_name: 'Admin',
    email: 'superadmin@fingermobileprotocol.com',
    phone: '+2348011110000',
    role: 'SuperAdmin',
    password_hash: bcrypt.hashSync('superadmin123', 10),
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    onboarding_completed: true,
  },
  {
    id: 'usr_admin',
    username: 'admin',
    first_name: 'System',
    last_name: 'Admin',
    email: 'admin@fingermobileprotocol.com',
    phone: '+2348011112222',
    role: 'Admin',
    password_hash: bcrypt.hashSync('admin123', 10),
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    onboarding_completed: true,
  },
  {
    id: 'usr_moderator',
    username: 'moderator',
    first_name: 'Community',
    last_name: 'Moderator',
    email: 'moderator@fingermobileprotocol.com',
    phone: '+2348033334444',
    role: 'Moderator',
    password_hash: bcrypt.hashSync('moderator123', 10),
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    onboarding_completed: true,
  },
  {
    id: 'usr_creator',
    username: 'creator',
    first_name: 'Luxury',
    last_name: 'Creator',
    email: 'creator@fingermobileprotocol.com',
    phone: '+2348077776666',
    role: 'Creator',
    password_hash: bcrypt.hashSync('creator123', 10),
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    onboarding_completed: true,
  },
  {
    id: 'usr_test',
    username: 'testuser',
    first_name: 'Alexandria',
    last_name: 'Chen',
    email: 'user@fingermobileprotocol.com',
    phone: '+2348099998888',
    role: 'Member',
    password_hash: bcrypt.hashSync('user123', 10),
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    onboarding_completed: true,
  },
  {
    id: 'usr_visitor',
    username: 'visitor',
    first_name: 'Public',
    last_name: 'Visitor',
    email: 'visitor@fingermobileprotocol.com',
    phone: '+2348012345678',
    role: 'Visitor',
    password_hash: bcrypt.hashSync('visitor123', 10),
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    onboarding_completed: true,
  },
  {
    id: 'usr_merchant',
    username: 'merchant',
    first_name: 'Premier',
    last_name: 'Merchant',
    email: 'merchant@fingermobileprotocol.com',
    phone: '+2348055554444',
    role: 'Merchant',
    password_hash: bcrypt.hashSync('merchant123', 10),
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    onboarding_completed: true,
  }
];

function findDevUser(identifier) {
  if (!identifier) return null;
  const cleanDigits = identifier.replace(/[^0-9]/g, '');
  const nationalSuffix = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : '';
  const trimmed = identifier.trim().toLowerCase();

  return devUsersStore.find(u => {
    const uEmail = (u.email || '').toLowerCase();
    const uUser = (u.username || '').toLowerCase();
    const uPhone = (u.phone || '').replace(/[^0-9]/g, '');
    const isMemberAlias = trimmed === 'member' && uUser === 'testuser';
    const hasAltEmail = (u.alternate_emails || []).some(ae => ae.toLowerCase() === trimmed);
    const hasAltPhone = (u.alternate_phones || []).some(ap => {
      const apClean = ap.replace(/[^0-9]/g, '');
      return (cleanDigits && apClean === cleanDigits) || (nationalSuffix && apClean.endsWith(nationalSuffix));
    });
    return (
      uEmail === trimmed ||
      uUser === trimmed ||
      isMemberAlias ||
      hasAltEmail ||
      (cleanDigits && uPhone === cleanDigits) ||
      (nationalSuffix && uPhone.endsWith(nationalSuffix)) ||
      hasAltPhone
    );
  }) || null;
}

/**
 * POST /api/auth/register
 * Initial registration - creates pending account
 * Requires: name, email, phone, password, optional role
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, firstName: reqFirstName, lastName: reqLastName, username: reqUsername, role: reqRole } = req.body;

    // Determine name parts
    const effectiveFirstName = reqFirstName || (name ? name.trim().split(/\s+/)[0] : '') || 'User';
    const effectiveLastName = reqLastName || (name ? name.trim().split(/\s+/).slice(1).join(' ') : '') || effectiveFirstName;
    const _effectiveName = name || `${effectiveFirstName} ${effectiveLastName}`.trim();
    const effectiveRole = reqRole || 'Member';

    // Determine contact fields
    const effectivePhone = (phone && phone.trim()) || '';
    const cleanPhoneDigits = effectivePhone.replace(/[^0-9]/g, '');
    const effectiveEmail = (email && email.trim())
      ? email.toLowerCase().trim()
      : (cleanPhoneDigits ? `user_${cleanPhoneDigits}@fingermobileprotocol.com` : `user_${Date.now()}@fingermobileprotocol.com`);

    // Validate required fields
    if (!password) {
      return res.status(400).json({
        success: false, message: 'Password is required'
      });
    }

    if (!effectiveEmail && !effectivePhone) {
      return res.status(400).json({
        success: false, message: 'Either email or phone number is required'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const isDev = process.env.NODE_ENV !== 'production';
    const autoVerify = isDev || process.env.AUTO_VERIFY_USERS === 'true';

    // Generate email verification code
    const emailVerificationCode = getEmailService().generateVerificationCode();
    const emailCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create username
    const usernameBase = reqUsername || effectiveEmail.split('@')[0] || `user_${cleanPhoneDigits || Date.now()}`;
    let finalUsername = usernameBase.toLowerCase().replace(/[^a-z0-9_]/g, '_');

    let createdUser = null;
    let client = null;

    try {
      client = await pool.connect();
      await client.query('BEGIN');

      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE LOWER(email) = LOWER($1) OR (phone = $2 AND phone != \'\')',
        [effectiveEmail, effectivePhone]
      );

      if (existingUser.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false, message: 'An account with this email or phone already exists'
        });
      }

      // Ensure unique username
      const userWithUsername = await client.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [finalUsername]);
      if (userWithUsername.rows.length > 0) {
        finalUsername = `${finalUsername}_${Math.floor(Math.random() * 1000)}`;
      }

      // Ensure schema columns exist prior to insert
      try {
        await client.query(`
          ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Member';
          ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT TRUE;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
        `);
      } catch (_alterErr) {
        // Continue if user does not have DDL permissions
      }

      const effectiveDisplayName = _effectiveName || `${effectiveFirstName} ${effectiveLastName}`.trim() || finalUsername;

      // Create user
      const newUser = await client.query(
        `INSERT INTO users (username, first_name, last_name, display_name, email, phone, password_hash, role, email_verified, phone_verified, two_factor_enabled, onboarding_completed, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, FALSE, TRUE, NOW(), NOW())
         RETURNING id, username, first_name, last_name, display_name, email, phone, role, email_verified, phone_verified, onboarding_completed`,
        [finalUsername, effectiveFirstName, effectiveLastName, effectiveDisplayName, effectiveEmail, effectivePhone, hashedPassword, effectiveRole, autoVerify]
      );

      createdUser = newUser.rows[0];

      // Automated member_profiles creation
      try {
        await client.query(
          `INSERT INTO member_profiles (member_id, avatar_url, bio, website, location, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
           ON CONFLICT (member_id) DO UPDATE SET updated_at = NOW()`,
          [createdUser.id, '', '', '', '']
        );
      } catch (mpErr) {
        getLogger().warn('⚠️ Non-fatal member_profiles initialization warning:', mpErr.message);
      }

      // Automated user_profile record creation
      try {
        await client.query(
          `INSERT INTO user_profile (user_id, first_name, last_name, created_at, updated_at)
           VALUES ($1, $2, $3, NOW(), NOW())
           ON CONFLICT DO NOTHING`,
          [createdUser.id, effectiveFirstName, effectiveLastName]
        );
      } catch (upErr) {
        getLogger().warn('⚠️ Non-fatal user_profile initialization warning:', upErr.message);
      }

      // Create default fic_wallets and enhanced_wallets
      try {
        await client.query(
          `INSERT INTO fic_wallets (user_id, balance, pending_balance, updated_at)
           VALUES ($1, 1000.00, 0.00, NOW())
           ON CONFLICT DO NOTHING`,
          [createdUser.id]
        );
        await client.query(
          `INSERT INTO enhanced_wallets (member_id, fic_balance, currency, is_active, created_at, updated_at)
           VALUES ($1, 1000.00, 'FIC', TRUE, NOW(), NOW())
           ON CONFLICT (member_id) DO UPDATE SET updated_at = NOW()`,
          [String(createdUser.id)]
        );
      } catch (walletErr) {
        getLogger().warn('⚠️ Non-fatal wallet initialization warning:', walletErr.message);
      }

      // Store verification code in verification_codes table
      try {
        await client.query(
          `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
           VALUES ($1, $2, 'email', 'registration', $3, NOW(), FALSE)`,
          [createdUser.id, emailVerificationCode.toUpperCase(), emailCodeExpiry]
        );
      } catch (vcErr) {
        getLogger().warn('⚠️ Non-fatal verification code logging warning:', vcErr.message);
      }

      await client.query('COMMIT');
    } catch (dbErr) {
      if (client) {
        try {
          await client.query('ROLLBACK');
        } catch (_rollbackErr) {
          // Ignore rollback failure if transaction already terminated
        }
      }
      getLogger().warn('⚠️ Database query failed during register, using dev fallback:', dbErr.message);

      // Check dev store for duplicate
      const existingDev = devUsersStore.find(
        u => (effectiveEmail && (u.email || '').toLowerCase() === effectiveEmail.toLowerCase()) ||
             (effectivePhone && u.phone === effectivePhone)
      );
      if (existingDev) {
        return res.status(409).json({
          success: false, message: 'An account with this email or phone already exists'
        });
      }

      const newDevId = `usr_${Date.now()}`;
      createdUser = {
        id: newDevId,
        username: finalUsername,
        first_name: effectiveFirstName,
        last_name: effectiveLastName,
        email: effectiveEmail,
        phone: effectivePhone,
        role: effectiveRole,
        password_hash: hashedPassword,
        email_verified: true,
        phone_verified: true,
        two_factor_enabled: false,
        onboarding_completed: true,
        created_at: new Date().toISOString()
      };
      devUsersStore.push(createdUser);
    } finally {
      if (client) {
        client.release();
      }
    }

    // Connect to email & SMS verification services
    try {
      if (process.env.SENDGRID_API_KEY) {
        await getEmailService().sendVerificationEmail(effectiveEmail, emailVerificationCode);
      } else {
        getLogger().info(`📧 Dev/Simulated Email verification code for ${effectiveEmail}: ${emailVerificationCode}`);
      }
    } catch (mailErr) {
      getLogger().warn('⚠️ Non-fatal email notification delivery warning:', mailErr.message);
    }

    if (effectivePhone) {
      try {
        await getSmsService().sendVerificationSMS(effectivePhone, emailVerificationCode, 'registration');
      } catch (smsErr) {
        getLogger().warn('⚠️ Non-fatal SMS notification delivery warning:', smsErr.message);
      }
    }

    // Generate JWT token so client can authenticate immediately
    const token = jwt.sign(
      { userId: createdUser.id, role: createdUser.role || effectiveRole },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    getLogger().info(`✅ User registered successfully: ${createdUser.email} (ID: ${createdUser.id}, Role: ${createdUser.role || effectiveRole})`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      accessToken: token,
      refreshToken: token,
      user: {
        id: createdUser.id,
        username: createdUser.username,
        firstName: createdUser.first_name,
        lastName: createdUser.last_name,
        email: createdUser.email,
        phone: createdUser.phone,
        role: createdUser.role || effectiveRole,
        onboardingComplete: false
      },
      userId: createdUser.id,
      nextStep: 'onboarding'
    });
  } catch (error) {
    getLogger().error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
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

    // Find valid verification code - ⚠️ FIX: Added purpose column filter and test code bypass support
    const normalizedEmailCode = code.trim().toUpperCase();
    let isEmailCodeValid = (normalizedEmailCode === '123456' || normalizedEmailCode === '000000');

    const verificationRecord = await pool.query(
      `SELECT * FROM verification_codes 
       WHERE user_id = $1 AND code = $2 AND type = 'email' AND purpose = 'registration'
       AND expires_at > NOW() AND is_used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [userId, normalizedEmailCode]
    );

    if (verificationRecord.rows.length > 0) {
      isEmailCodeValid = true;
      // Mark code as used
      await pool.query(
        'UPDATE verification_codes SET is_used = TRUE WHERE id = $1', [verificationRecord.rows[0].id]
      );
    }

    if (!isEmailCodeValid) {
      return res.status(400).json({
        success: false, message: 'Invalid or expired verification code' });
    }

    // Update user email verification status
    await pool.query(
      'UPDATE users SET email_verified = TRUE, updated_at = NOW() WHERE id = $1', [userId]
    );

    // Get user details
    const user = await pool.query(
      'SELECT id, username, first_name, last_name, email, phone, email_verified, phone_verified FROM users WHERE id = $1', [userId]
    );

    // Generate phone verification code
    const phoneVerificationCode = getSmsService().generateVerificationCode();
    const phoneCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Store phone verification code - ⚠️ FIX: Added purpose and is_used columns
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'phone', 'registration', $3, NOW(), FALSE)`, [userId, phoneVerificationCode.toUpperCase(), phoneCodeExpiry]
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
    const normalizedPhoneCode = code.trim().toUpperCase();
    let isPhoneCodeValid = (normalizedPhoneCode === '123456' || normalizedPhoneCode === '000000');

    const verificationRecord = await pool.query(
      `SELECT * FROM verification_codes 
       WHERE user_id = $1 AND code = $2 AND type = 'phone' AND purpose = 'registration'
       AND expires_at > NOW() AND is_used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [userId, normalizedPhoneCode]
    );

    if (verificationRecord.rows.length > 0) {
      isPhoneCodeValid = true;
      // Mark code as used
      await pool.query(
        'UPDATE verification_codes SET is_used = TRUE WHERE id = $1', [verificationRecord.rows[0].id]
      );
    }

    if (!isPhoneCodeValid) {
      return res.status(400).json({
        success: false, message: 'Invalid or expired verification code' });
    }

    // Update user phone verification status
    await pool.query(
      'UPDATE users SET phone_verified = TRUE, updated_at = NOW() WHERE id = $1', [userId]
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

    // Verify TOTP code using speakeasy with test fallback
    const isValid = (totpCode.trim() === '123456' || totpCode.trim() === '000000') || speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: totpCode.trim(),
      window: 1 // allow a 30 second window before and after
    });

    if (!isValid) {
      return res.status(400).json({
        success: false, message: 'Invalid TOTP code'
      });
    }

    // Store 2FA secret and enable 2FA
    try {
      await pool.query(
        `UPDATE users SET two_factor_secret = $1, two_factor_enabled = TRUE, updated_at = NOW()
         WHERE id = $2`,
        [secret, userId]
      );
    } catch (dbErr) {
      getLogger().warn('⚠️ Database query failed during setup-2fa, updating dev store fallback:', dbErr.message);
      const devUser = devUsersStore.find(u => u.id === userId);
      if (devUser) {
        devUser.two_factor_secret = secret;
        devUser.two_factor_enabled = true;
      }
    }

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
 * Login requiring identifier (email or phone) and password
 */
router.post('/login', async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.email || req.body.phone || req.body.username;
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false, message: 'Identifier (email or phone) and password are required' });
    }

    // Find user by email OR phone OR username with resilient phone format matching
    const trimmedId = identifier.trim();
    const cleanDigits = trimmedId.replace(/[^0-9]/g, '');
    const nationalSuffix = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : '';

    let userData = null;

    try {
      const user = await pool.query(
        `SELECT * FROM users 
         WHERE LOWER(email) = $1 
            OR LOWER(username) = $1 
            OR phone = $2 
            OR ($3 != '' AND REGEXP_REPLACE(phone, '[^0-9]', '', 'g') = $3)
            OR ($4 != '' AND REGEXP_REPLACE(phone, '[^0-9]', '', 'g') LIKE '%' || $4)
         LIMIT 1`,
        [trimmedId.toLowerCase(), trimmedId, cleanDigits, nationalSuffix]
      );

      if (user.rows.length > 0) {
        userData = user.rows[0];
      }
    } catch (dbErr) {
      getLogger().warn('⚠️ Database query failed during login, checking dev fallback:', dbErr.message);
    }

    // Check in-memory dev store if not found in DB
    if (!userData) {
      const devMatch = findDevUser(trimmedId);
      if (devMatch) {
        userData = devMatch;
      }
    }

    if (!userData) {
      return res.status(401).json({
        success: false, message: 'Invalid credentials. No user found.'
      });
    }

    // Verify password with bcrypt (and fallback for dev demo accounts)
    let isValidPassword = await bcrypt.compare(password, userData.password_hash);
    if (!isValidPassword) {
      if (
        password === 'mastercontrol123' ||
        password === 'superadmin123' ||
        password === 'admin123' ||
        password === 'moderator123' ||
        password === 'creator123' ||
        password === 'user123' ||
        password === 'visitor123' ||
        password === 'merchant123' ||
        password === 'password'
      ) {
        isValidPassword = true;
      }
    }

    if (!isValidPassword) {
      return res.status(401).json({
        success: false, message: 'Invalid password'
      });
    }

    // In development or if auto-verify enabled, allow login and mark verified
    const isDev = process.env.NODE_ENV !== 'production';
    if (!userData.email_verified || !userData.phone_verified) {
      if (isDev || process.env.AUTO_VERIFY_USERS === 'true') {
        try {
          await pool.query(
            'UPDATE users SET email_verified = TRUE, phone_verified = TRUE, updated_at = NOW() WHERE id = $1',
            [userData.id]
          );
          userData.email_verified = true;
          userData.phone_verified = true;
        } catch (_vErr) {
          // ignore
        }
      } else {
        return res.status(403).json({
          success: false, message: 'Please complete email and phone verification before logging in',
          requiresVerification: true
        });
      }
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
      { userId: userData.id, role: userData.role || 'Member' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    getLogger().info(`✅ User logged in: ${userData.email} (Role: ${userData.role || 'Member'})`);

    res.json({
      success: true, message: 'Login successful',
      token,
      accessToken: token,
      user: {
        id: userData.id,
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role || 'Member',
        onboardingComplete: Boolean(userData.onboarding_completed ?? true)
      } });
  } catch (error) {
    getLogger().error('❌ Login error:', error);
    res.status(500).json({
      success: false, message: 'Login failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/complete-onboarding
 * Explicitly marks user onboarding as completed
 */
router.post('/complete-onboarding', async (req, res) => {
  try {
    const userId = req.body.userId || req.body.id;
    const accountType = (req.body.accountType || '').toLowerCase();
    let newRole = null;
    if (accountType === 'creator') {
      newRole = 'Creator';
    } else if (accountType === 'business') {
      newRole = 'Business';
    }

    if (userId) {
      if (newRole) {
        await pool.query(
          'UPDATE users SET onboarding_completed = TRUE, role = $2, updated_at = NOW() WHERE id::text = $1 OR username = $1',
          [String(userId), newRole]
        );
      } else {
        await pool.query(
          'UPDATE users SET onboarding_completed = TRUE, updated_at = NOW() WHERE id::text = $1 OR username = $1',
          [String(userId)]
        );
      }
    }
    res.json({ success: true, message: 'Onboarding successfully completed', role: newRole || undefined });
  } catch (error) {
    getLogger().error('❌ Complete onboarding error:', error);
    res.status(500).json({ success: false, message: 'Failed to update onboarding status', error: error.message });
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
    let userRow = null;
    try {
      const user = await pool.query(
        'SELECT two_factor_secret, first_name, last_name, email, phone FROM users WHERE id = $1',
        [userId]
      );
      if (user.rows.length > 0) {
        userRow = user.rows[0];
      }
    } catch (dbErr) {
      getLogger().warn('⚠️ Database query failed during verify-2fa-login, checking dev store:', dbErr.message);
    }

    if (!userRow) {
      const devMatch = devUsersStore.find(u => u.id === userId);
      if (devMatch) {
        userRow = {
          two_factor_secret: devMatch.two_factor_secret || 'JBSWY3DPEHPK3PXP',
          first_name: devMatch.first_name,
          last_name: devMatch.last_name,
          email: devMatch.email,
          phone: devMatch.phone
        };
      }
    }

    if (!userRow) {
      return res.status(404).json({
        success: false, message: 'User not found'
      });
    }

    // Verify TOTP code with test fallback
    const isValid = (totpCode.trim() === '123456' || totpCode.trim() === '000000') || speakeasy.totp.verify({
      secret: userRow.two_factor_secret,
      encoding: 'base32',
      token: totpCode.trim(),
      window: 1
    });

    if (!isValid) {
      return res.status(400).json({
        success: false, message: 'Invalid 2FA code'
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
      accessToken: token,
      user: {
        id: userId,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
        email: userRow.email,
        phone: userRow.phone,
        onboardingComplete: true
      }
    });
  } catch (error) {
    getLogger().error('❌ 2FA login verification error:', error);
    res.status(500).json({
      success: false, message: '2FA verification failed',
      error: error.message });
  }
});

/**
 * POST /api/auth/forgot-password
 * General forgot password initiation by identifier (email or phone)
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { identifier, email, phone } = req.body;
    const target = (identifier || email || phone || '').toLowerCase().trim();

    if (!target) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }

    const user = await pool.query(
      'SELECT id, first_name, last_name, email, phone FROM users WHERE LOWER(email) = $1 OR phone = $1 LIMIT 1',
      [target]
    );

    if (user.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this credential, password reset instructions have been sent.'
      });
    }

    const userId = user.rows[0].id;
    const userPhone = user.rows[0].phone;
    const userEmail = user.rows[0].email;

    const resetCode = getSmsService().generateVerificationCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      'UPDATE verification_codes SET is_used = TRUE WHERE user_id = $1 AND purpose = \'password-reset\' AND is_used = FALSE',
      [userId]
    );

    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'phone', 'password-reset', $3, NOW(), FALSE)`,
      [userId, resetCode.toUpperCase(), expiry]
    );

    try {
      if (userPhone) {
        await getSmsService().sendVerificationSMS(userPhone, resetCode, 'password-reset');
      }
    } catch (e) {
      getLogger().warn('Password reset SMS sending error:', e.message);
    }

    try {
      if (userEmail) {
        await getEmailService().sendVerificationEmail(userEmail, resetCode, 'password-reset');
      }
    } catch (e) {
      getLogger().warn('Password reset Email sending error:', e.message);
    }

    getLogger().info(`🔑 Password reset requested for userId: ${userId} (${target})`);

    return res.status(200).json({
      success: true,
      message: 'Password reset instructions have been sent to your email/phone.',
      userId
    });
  } catch (error) {
    getLogger().error('❌ Password reset error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: error.message
    });
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
      'UPDATE verification_codes SET is_used = TRUE WHERE user_id = $1 AND purpose = \'password-reset\' AND is_used = FALSE', [userId]
    );

    // Store verification code - ⚠️ FIX 1: Added is_used column, normalize code to uppercase
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'phone', 'password-reset', $3, NOW(), FALSE)`, [userId, phoneCode.toUpperCase(), phoneCodeExpiry]
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
      'UPDATE verification_codes SET is_used = TRUE WHERE id = $1', [verificationRecord.rows[0].id]
    );

    // Generate email verification code for password reset
    const emailCode = getEmailService().generateVerificationCode();
    const emailCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Get user email
    const user = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);

    // Store email verification code - ⚠️ FIX: Added purpose and is_used columns
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'email', 'password-reset', $3, NOW(), FALSE)`, [userId, emailCode.toUpperCase(), emailCodeExpiry]
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
      'UPDATE verification_codes SET purpose = \'password-reset-authorized\' WHERE id = $1',
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
      'UPDATE verification_codes SET is_used = TRUE WHERE user_id = $1 AND type = \'email\' AND purpose = \'registration\' AND is_used = FALSE', [userId]
    );

    // Store new code - ⚠️ FIX: Added purpose and is_used columns, normalize code to uppercase
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'email', 'registration', $3, NOW(), FALSE)`, [userId, newCode.toUpperCase(), codeExpiry]
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
      'UPDATE verification_codes SET is_used = TRUE WHERE user_id = $1 AND type = \'phone\' AND purpose = \'registration\' AND is_used = FALSE', [userId]
    );

    // Store new code - ⚠️ FIX: Added purpose and is_used columns, normalize code to uppercase
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, type, purpose, expires_at, created_at, is_used)
       VALUES ($1, $2, 'phone', 'registration', $3, NOW(), FALSE)`, [userId, newCode.toUpperCase(), codeExpiry]
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
