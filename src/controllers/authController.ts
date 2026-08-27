import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from '../config/database';
import security from '../utils/security';
import { emailService } from '../services/emailService';

// Register a new member
export const register = async (req: Request, res: Response) => {
  try {
    const { name, membername, email, password } = req.body;

    // Validate input
    if (!name || !membername || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Validate email format
    if (!security.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Validate password strength
    const passwordValidation = security.validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Check if member already exists
    const existingMember = await pool.query(
      "SELECT id FROM members WHERE email = $1 OR membername = $2",
      [email, membername]
    );

    if (existingMember.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with these credentials already exists"
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
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
      ]
    );

    const member = result.rows[0];
    const userAgent = req.get("User-Agent") || "";
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;

    // Non-blocking background operations: send single email & record security log
    Promise.allSettled([
      emailService.sendEmail(
        email, 
        "Verify your email address", 
        `Please click on the following link to verify your email address:\n${verificationUrl}`
      ),
      pool.query(
        `INSERT INTO security_events (member_id, event_type, ip_address, member_agent, success)
         VALUES ($1, $2, $3, $4, $5)`,
        [member.id, "REGISTRATION", req.ip, userAgent, true]
      )
    ]).catch((err) => console.error("Background registration tasks error:", err));

    return res.status(201).json({
      success: true,
      message: "Member registered successfully. Please check your email for verification.",
      data: member
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration"
    });
  }
};

// Login member
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find member
    const result = await pool.query(
      `SELECT id, name, membername, email, password_hash, is_active, email_verified, failed_login_attempts, locked_until
       FROM members WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const member = result.rows[0];

    // Check if account is locked
    if (member.locked_until && new Date(member.locked_until) > new Date()) {
      return res.status(403).json({
        success: false,
        message: "Account is temporarily locked. Please try again later."
      });
    }

    // Check if account is active
    if (!member.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated"
      });
    }

    // Check if email is verified
    if (!member.email_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address before logging in"
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, member.password_hash);

    if (!isPasswordValid) {
      const failedAttempts = member.failed_login_attempts + 1;
      let lockedUntil: Date | null = null;

      // Lock account after 5 failed attempts
      if (failedAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      const userAgent = req.get("User-Agent") || "";
      await Promise.all([
        pool.query(
          "UPDATE members SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3",
          [failedAttempts, lockedUntil, member.id]
        ),
        pool.query(
          `INSERT INTO security_events (member_id, event_type, ip_address, member_agent, success)
           VALUES ($1, $2, $3, $4, $5)`,
          [member.id, "FAILED_LOGIN", req.ip, userAgent, false]
        )
      ]);

      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Reset failed login attempts
    await pool.query(
      "UPDATE members SET failed_login_attempts = 0, locked_until = NULL, last_login = $1 WHERE id = $2",
      [new Date(), member.id]
    );

    // Validate JWT_SECRET is set
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }

    // Generate JWT token (Fixed TS2769 error by asserting expiresIn type)
    const token = jwt.sign(
      { memberId: member.id, email: member.email },
      jwtSecret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "24h") as jwt.SignOptions['expiresIn'] }
    );

    // Generate session & CSRF token
    const csrfToken = crypto.randomBytes(32).toString("hex");
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const userAgent = req.get("User-Agent") || "";

    await Promise.all([
      pool.query(
        `INSERT INTO sessions (member_id, session_token, csrf_token, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [member.id, sessionToken, csrfToken, sessionExpires]
      ),
      pool.query(
        `INSERT INTO security_events (member_id, event_type, ip_address, member_agent, success)
         VALUES ($1, $2, $3, $4, $5)`,
        [member.id, "LOGIN", req.ip, userAgent, true]
      )
    ]);

    // Remove sensitive password hash from return object
    const { password_hash, ...safeMember } = member;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      csrfToken,
      data: safeMember
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login"
    });
  }
};