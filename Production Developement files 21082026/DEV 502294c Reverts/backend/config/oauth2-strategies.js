/**
 * OAuth2 Authentication Strategies
 * Google and Facebook OAuth2 integration using Passport
 * Date: June 10, 2026 - Phase 1 Week 1 Days 3-4
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');

// Load User model
const User = require('../models/user');

/**
 * Generate JWT token for authenticated user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || 'user'
    },
    process.env.JWT_SECRET || 'dev-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Serialize user for session
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserialize user from session
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

/**
 * Google OAuth2 Strategy
 */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({
        where: {
          email: profile.emails[0].value
        }
      });

      if (user) {
        // User exists, link Google account if not already linked
        if (!user.googleId) {
          await user.update({
            googleId: profile.id,
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken
          });
        }
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        username: profile.displayName.replace(/\s+/g, '_').toLowerCase(),
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        googleId: profile.id,
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken,
        avatarUrl: profile.photos?.[0]?.value,
        emailVerified: true,
        authProvider: 'google'
      });

      return done(null, user);
    } catch (error) {
      logger.error('Google OAuth2 error:', error);
      return done(error, null);
    }
  }));
} else {
  logger.warn('⚠️  Google OAuth2 credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
}

/**
 * Facebook OAuth2 Strategy
 */
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3001/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'name', 'email', 'photos'],
    enableProof: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({
        where: {
          email: profile.emails?.[0]?.value
        }
      });

      if (user) {
        // User exists, link Facebook account if not already linked
        if (!user.facebookId) {
          await user.update({
            facebookId: profile.id,
            facebookAccessToken: accessToken
          });
        }
        return done(null, user);
      }

      // Create new user
      const nameParts = profile.displayName.split(' ');
      user = await User.create({
        username: profile.displayName.replace(/\s+/g, '_').toLowerCase(),
        email: profile.emails?.[0]?.value || `${profile.id}@facebook.temp`,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ') || '',
        facebookId: profile.id,
        facebookAccessToken: accessToken,
        avatarUrl: profile.photos?.[0]?.value,
        emailVerified: true,
        authProvider: 'facebook'
      });

      return done(null, user);
    } catch (error) {
      logger.error('Facebook OAuth2 error:', error);
      return done(error, null);
    }
  }));
} else {
  logger.warn('⚠️  Facebook OAuth2 credentials not configured. Set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in .env');
}

module.exports = { passport, generateToken };
