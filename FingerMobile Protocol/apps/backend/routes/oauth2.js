/**
 * OAuth2 Authentication Routes
 * Google and Facebook login/callback endpoints
 * Date: June 10, 2026 - Phase 1 Week 1 Days 3-4
 */

const express = require('express');
const logger = require('../utils/logger');
const passport = require('passport');
const { generateToken } = require('../config/oauth2-strategies');
const router = express.Router();

/**
 * GET /auth/google
 * Initiate Google OAuth2 authentication
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));

/**
 * GET /auth/google/callback
 * Google OAuth2 callback handler
 */
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login?error=google_failed',
  session: false
}), (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect('/login?error=authentication_failed');
    }

    // Generate JWT token
    const token = generateToken(user);

    // Redirect to frontend with token
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    res.redirect(`${redirectUrl}/auth/callback?token=${token}&provider=google`);
  } catch (error) {
    logger.error('Google callback error:', error);
    res.redirect('/login?error=server_error');
  }
}
);

/**
 * GET /auth/facebook
 * Initiate Facebook OAuth2 authentication
 */
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile'],
  session: false
}));

/**
 * GET /auth/facebook/callback
 * Facebook OAuth2 callback handler
 */
router.get('/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/login?error=facebook_failed',
  session: false
}), (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect('/login?error=authentication_failed');
    }

    // Generate JWT token
    const token = generateToken(user);

    // Redirect to frontend with token
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    res.redirect(`${redirectUrl}/auth/callback?token=${token}&provider=facebook`);
  } catch (error) {
    logger.error('Facebook callback error:', error);
    res.redirect('/login?error=server_error');
  }
}
);

/**
 * GET /auth/link/google
 * Link Google account to existing user
 */
router.get('/link/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));

/**
 * GET /auth/link/google/callback
 * Link Google account callback
 */
router.get('/link/google/callback', passport.authenticate('google', {
  failureRedirect: '/settings?error=link_failed',
  session: false
}), async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.redirect('/settings?error=not_authenticated');
    }

    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    res.redirect(`${redirectUrl}/settings?success=google_linked`);
  } catch (error) {
    logger.error('Google link error:', error);
    res.redirect('/settings?error=link_failed');
  }
}
);

/**
 * GET /auth/link/facebook
 * Link Facebook account to existing user
 */
router.get('/link/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile'],
  session: false
}));

/**
 * GET /auth/link/facebook/callback
 * Link Facebook account callback
 */
router.get('/link/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/settings?error=link_failed',
  session: false
}), async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.redirect('/settings?error=not_authenticated');
    }

    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    res.redirect(`${redirectUrl}/settings?success=facebook_linked`);
  } catch (error) {
    logger.error('Facebook link error:', error);
    res.redirect('/settings?error=link_failed');
  }
}
);

module.exports = router;
