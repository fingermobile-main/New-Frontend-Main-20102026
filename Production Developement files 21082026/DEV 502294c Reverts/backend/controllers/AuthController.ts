import { Request, Response } from "express";
import logger from '../utils/logger';
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/UserModel";
import Wallet from "../models/WalletModel";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

interface JwtPayload {
  id: string;
  email: string;
  role?: string;
}

class AuthController {
  /**
   * Register new user
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName, username, phone } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(409).json({ error: "User with this email already exists" });
        return;
      }

      // Check if username is taken
      if (username) {
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
          res.status(409).json({ error: "Username is already taken" });
          return;
        }
      }

      // Create user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        username,
        phone
      });

      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();

      // Create wallet for new user
      await Wallet.create({
        userId: user.id,
        balance: 0,
        currency: "USD",
        status: "active"
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          role: user.role
        },
        token,
        verificationToken, // In production, send via email instead
      });
    } catch (error) {
      logger.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Check if account is locked
      if (user.isLocked()) {
        res.status(423).json({
          error: "Account is temporarily locked due to too many failed attempts",
          lockedUntil: user.lockedUntil
        });
        return;
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        user.incrementFailedAttempts();
        await user.save();
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Reset failed attempts on successful login
      user.resetFailedAttempts();
      user.lastLoginAt = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          role: user.role,
          lastLoginAt: user.lastLoginAt
        },
        token
      });
    } catch (error) {
      logger.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Logout user (client-side token removal)
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // In a stateless JWT system, logout is handled client-side by removing the token
      // For enhanced security, you could maintain a blacklist of tokens
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      logger.error("Logout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Refresh JWT token
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const user = await User.findByPk(req.user.id);
      if (!user || user.status !== "active") {
        res.status(401).json({ error: "Invalid or inactive user" });
        return;
      }

      // Generate new token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      res.status(200).json({
        message: "Token refreshed successfully",
        token
      });
    } catch (error) {
      logger.error("Token refresh error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Request password reset
   */
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Don't reveal if user exists or not for security
        res.status(200).json({ message: "If the email exists, a reset link has been sent" });
        return;
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetToken = resetToken;
      user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      // In production, send email with reset link
      // For now, return the token for testing purposes
      res.status(200).json({
        message: "Password reset link sent",
        resetToken, // Remove in production, send via email
      });
    } catch (error) {
      logger.error("Forgot password error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Reset password with token
   */
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({ error: "Token and new password are required" });
        return;
      }

      // Validate password strength
      if (newPassword.length < 8) {
        res.status(400).json({ error: "Password must be at least 8 characters long" });
        return;
      }

      const user = await User.findOne({
        where: {
          passwordResetToken: token
        }
      });

      if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
        res.status(400).json({ error: "Invalid or expired reset token" });
        return;
      }

      // Update password
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpiresAt = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      logger.error("Reset password error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Verify email address
   */
  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        where: {
          emailVerificationToken: token
        }
      });

      if (!user || !user.emailVerificationExpiresAt || user.emailVerificationExpiresAt < new Date()) {
        res.status(400).json({ error: "Invalid or expired verification token" });
        return;
      }

      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpiresAt = undefined;
      await user.save();

      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      logger.error("Email verification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Get current user profile
   */
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] }
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      logger.error("Get profile error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Update user profile
   */
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const { firstName, lastName, username, phone } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Check if username is taken by another user
      if (username && username !== user.username) {
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
          res.status(409).json({ error: "Username is already taken" });
          return;
        }
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.username = username || user.username;
      user.phone = phone || user.phone;
      await user.save();

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          phone: user.phone
        }
      });
    } catch (error) {
      logger.error("Update profile error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Change password
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: "Current password and new password are required" });
        return;
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }

      // Validate new password
      if (newPassword.length < 8) {
        res.status(400).json({ error: "New password must be at least 8 characters long" });
        return;
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      logger.error("Change password error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default new AuthController();
