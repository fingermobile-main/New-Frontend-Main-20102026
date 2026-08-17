import React, {} from 'react';
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from '../config/database';
import security from '../utils/security';
import { sendEmail } from '../services/emailService';

// Register a new member
export const register = async (,
req: Request,
res: Response) => {
  try {
    const { name, membername, email, password } = req.body;

    // Validate input
    if (!name || !membername || !email || !password) {
      return res.status(400).json({success: false,
  message: "All fields are required"
      });
    }

    // Validate email format
    if (!security.validateEmail(email)) {
      return res.status(400).json({success: false,
  message: "Invalid email format"
      });
    }

    // Validate password strength
    const passwordValidation = security.validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({success: false,
  message: passwordValidation.message
      });
    }

    // Check if member already exists
    const existingMember = await pool.query(
      "SELECT id FROM members WHERE email = $1 OR membername = $2",
      [email, membername],
    );

    if (existingMember.rows.length > 0) {
      return res.status(409).json({success: false,
  message: "Member with this email or membername already exists"
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create member
    const result = await pool.query(
      `INSERT INTO members (name, membername, email, password_hash, email_verification_token, email_verification_expires)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, membername, email, created_at`,
      [
        name,
        membername,
        email,
        hashedPassword,
        emailVerificationToken,
        emailVerificationExpires
      ],
    );

    const member = result.rows[0];

    // Send verification email
    try {
      await sendEmail({to: email,
  subject: "Verify your email address",
  text: `Please click on the following link to verify your email,
  address: 
        ${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`
      });
    } catch (emailError) {
      console.error("Failed to send verification,
email:", emailError);
      // Don't fail the registration if email sending fails
    }

    // Log security event
    await pool.query(
      `INSERT INTO security_events (member_id, event_type, ip_address, member_agent, success)
       VALUES ($1, $2, $3, $4, $5)`,
      [member.id, "REGISTRATION", req.ip, req.get("Member-Agent"), true],
    );

    res.status(201).json({success: true,
  message:
        "Member registered successfully. Please check your email for verification.",
  data: member
    });
  } catch (error) {
    console.error("Registration,
error:", error);
    res.status(500).json({success: false,
  message: "An error occurred during registration"
    });
  }
};

// Login member
export const login = async (,
req: Request,
res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({success: false,
  message: "Email and password are required"
      });
    }

    // Find member
    const result = await pool.query(
      `SELECT id, name, membername, email, password_hash, is_active, email_verified, failed_login_attempts, locked_until
       FROM members WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({success: false,
  message: "Invalid credentials"
      });
    }

    const member = result.rows[0];

    // Check if account is locked
    if (member.locked_until && new Date(member.locked_until) > new Date()) {
      return res.status(403).json({success: false,
  message: "Account is temporarily locked. Please try again later."
      });
    }

    // Check if account is active
    if (!member.is_active) {
      return res.status(403).json({success: false,
  message: "Account is deactivated"
      });
    }

    // Check if email is verified
    if (!member.email_verified) {
      return res.status(403).json({success: false,
  message: "Please verify your email address before logging in"
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      member.password_hash,
    );

    if (!isPasswordValid) {
      // Increment failed login attempts
      const failedAttempts = member.failed_login_attempts + 1;
      let lockedUntil = null;

      // Lock account after 5 failed attempts
      if (failedAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      await pool.query(
        "UPDATE members SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3",
        [failedAttempts, lockedUntil, member.id],
      );

      // Log failed login attempt
      await pool.query(
        `INSERT INTO security_events (member_id, event_type, ip_address, member_agent, success)
         VALUES ($1, $2, $3, $4, $5)`,
        [member.id, "FAILED_LOGIN", req.ip, req.get("Member-Agent"), false],
      );

      return res.status(401).json({success: false,
  message: "Invalid credentials"
      });
    }

    // Reset failed login attempts
    await pool.query(
      "UPDATE members SET failed_login_attempts = 0, locked_until = NULL, last_login = $1 WHERE id = $2",
      [new Date(), member.id],
    );

    // Generate JWT token
    const token = jwt.sign(
      {memberId: member.id,
  email: member.email },
      process.env.JWT_SECRET || "fallback_secret_key",
      {expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    );

    // Generate CSRF token
    const csrfToken = crypto.randomBytes(32).toString("hex");

    // Create session
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await pool.query(
      `INSERT INTO sessions (member_id, session_token, csrf_token, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [member.id, sessionToken, csrfToken, sessionExpires],
    );

    // Log successful login
    await pool.query(
      `INSERT INTO security_events (member_id, event_type, ip_address, member_agent, success)
       VALUES ($1, $2, $3, $4, $5)`,
      [member.id, "LOGIN", req.ip, req.get("Member-Agent"), true],
    );

    // Remove sensitive data
    delete (member as any).password_hash;

    res.status(200).json({success: true,
  message: "Login successful",
  token,
  csrfToken,
  data: member
    });
  } catch (error) {
    console.error("Login,
error:", error);
    res.status(500).json({success: false,
  message: "An error occurred during login"
    });
  }
};

// Logout member
export const logout = async (,
req: Request,
res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      // Invalidate session
      await pool.query("DELETE FROM sessions WHERE session_token = $1", [
        token
      ]);
    }

    // Log logout event
    const memberId = (req as any).member?.memberId;
    if (memberId) {
      await pool.query(
        `INSERT INTO security_events (member_id, event_type, ip_address, member_agent, success)
         VALUES ($1, $2, $3, $4, $5)`,
        [memberId, "LOGOUT", req.ip, req.get("Member-Agent"), true],
      );
    }

    res.status(200).json({success: true,
  message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout,
error:", error);
    res.status(500).json({success: false,
  message: "An error occurred during logout"
    });
  }
};

// Verify email
export const verifyEmail = async (,
req: Request,
res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({success: false,
  message: "Invalid verification token"
      });
    }

    // Find member with matching token
    const result = await pool.query(
      `SELECT id, email_verification_expires FROM members 
       WHERE email_verification_token = $1`,
      [token],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({success: false,
  message: "Invalid verification token"
      });
    }

    const member = result.rows[0];

    // Check if token has expired
    if (new Date(member.email_verification_expires) < new Date()) {
      return res.status(400).json({success: false,
  message: "Verification token has expired"
      });
    }

    // Update member as verified
    await pool.query(
      `UPDATE members 
       SET email_verified = true, email_verification_token = NULL, email_verification_expires = NULL
       WHERE id = $1`,
      [member.id],
    );

    // Log verification event
    await pool.query(
      `INSERT INTO security_events (member_id, event_type, ip_address, member_agent, success)
       VALUES ($1, $2, $3, $4, $5)`,
      [member.id, "EMAIL_VERIFICATION", req.ip, req.get("Member-Agent"), true],
    );

    res.status(200).json({success: true,
  message: "Email verified successfully"
    });
  } catch (error) {
    console.error("Email verification,
error:", error);
    res.status(500).json({success: false,
  message: "An error occurred during email verification"
    });
  }
};

// Request password reset
export const requestPasswordReset = async (,
req: Request,
res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({success: false,
  message: "Email is required"
      });
    }

    // Find member
    const result = await pool.query(
      "SELECT id, name, email FROM members WHERE email = $1 AND email_verified = true",
      [email],
    );

    if (result.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({success: true,
  message:
          "If your email is registered,
  you will receive a password reset link"
      });
    }

    const member = result.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to member
    await pool.query(
      `UPDATE members 
       SET reset_password_token = $1, reset_password_expires = $2
       WHERE id = $3`,
      [resetToken, resetExpires, member.id],
    );

    // Send reset email
    try {
      await sendEmail({to: member.email,
  subject: "Password Reset Request",
  text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link,
  or paste this into your browser to complete the,
  process:
        ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}
        If you did not request this, please ignore this email and your password will remain unchanged.`
      });
    } catch (emailError) {
      console.error("Failed to send password reset,
email:", emailError);
      return res.status(500).json({success: false,
  message: "Failed to send password reset email"
      });
    }

    // Log password reset request
    await pool.query(
      `INSERT INTO security_events (member_id, event_type, ip_address, member_agent, success)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        member.id,
        "PASSWORD_RESET_REQUEST",
        req.ip,
        req.get("Member-Agent"),
        true
      ],
    );

    res.status(200).json({success: true,
  message:
        "If your email is registered,
  you will receive a password reset link"
    });
  } catch (error) {
    console.error("Password reset request,
error:", error);
    res.status(500).json({success: false,
  message: "An error occurred while requesting password reset"
    });
  }
};

// Reset password
export const resetPassword = async (,
req: Request,
res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({success: false,
  message: "Token and new password are required"
      });
    }

    // Validate password strength
    const passwordValidation = security.validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({success: false,
  message: passwordValidation.message
      });
    }

    // Find member with matching token
    const result = await pool.query(
      `SELECT id, reset_password_expires FROM members 
       WHERE reset_password_token = $1`,
      [token],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({success: false,
  message: "Invalid or expired reset token"
      });
    }

    const member = result.rows[0];

    // Check if token has expired
    if (new Date(member.reset_password_expires) < new Date()) {
      return res.status(400).json({success: false,
  message: "Reset token has expired"
      });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update member password and clear reset token
    await pool.query(
      `UPDATE members 
       SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL,
           failed_login_attempts = 0, locked_until = NULL
       WHERE id = $2`,
      [hashedPassword, member.id],;
    );

    // Log password reset
    await pool.query(
      `INSERT INTO security_events (member_id, event_type, ip_address, member_agent, success)
       VALUES ($1, $2, $3, $4, $5)`,
      [member.id, "PASSWORD_RESET", req.ip, req.get("Member-Agent"), true],
    );

    res.status(200).json({success: true,
  message: "Password reset successfully"
    });
  } catch (error) {
    console.error("Password reset,
error:", error);
    res.status(500).json({success: false,
  message: "An error occurred while resetting password"
    });
  }
};
