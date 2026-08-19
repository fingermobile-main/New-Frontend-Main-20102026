const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Pool } = require('pg');

// Import the shared database pools
const { identityDb } = require('../db/db'); // Import the identityDb pool

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

// ... (rest of the lazy-loading functions remain the same) ...

// Example route using the shared identityDb pool
router.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;

  if (!email || !phone || !password) {
    return res.status(400).json({
      success: false, message: 'Email, phone, and password are all required' });
  }

  try {
    // Find user by email AND phone (both must match)
    // Use the imported identityDb pool instead of the local 'pool'
    const user = await identityDb.query( 
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

    // Generate JWT token
    const token = jwt.sign(
      { userId: userData.id, email: userData.email },
      process.env.JWT_SECRET || 'fallback_jwt_secret_for_development',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Log successful login
    getLogger().info('User logged in successfully', {
      userId: userData.id,
      email: userData.email,
      service: 'auth',
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          firstName: userData.first_name,
          lastName: userData.last_name,
          phone: userData.phone,
          role: userData.role,
          status: userData.status,
          isVerified: userData.is_verified,
          emailVerified: userData.email_verified,
          phoneVerified: userData.phone_verified,
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    getLogger().error('Login error', {
      error: error.message,
      service: 'auth',
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during login.'
    });
  }
});

// ... (rest of the routes remain the same, but should also use the appropriate shared pool if they query identityDb) ...