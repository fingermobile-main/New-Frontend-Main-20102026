import React from 'react';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { logError } from '../../src/utils/errorLogger';

// Database connection
const pool = new Pool({user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "fingermobile_platform_db",
  password: process.env.DB_PASSWORD || "postgres",
  port: parseInt(process.env.DB_PORT || "5432")
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "fingermobile_secret_key";

// Extend the Request type to include member information
interface AuthRequest extends Request {
  member?: {memberId: number;,
  membername: string;
  };
}

// Middleware to authenticate JWT tokens
export const authenticateToken = async (,
req: AuthRequest,
res: Response,
next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {memberId: number;,
  membername: string;
    };
    req.member = decoded;

    // Verify member still exists in database
    const result = await pool.query("SELECT id FROM members WHERE id = $1", [
      decoded.memberId
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({error: "Member no longer exists" });
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({error: "Token expired" });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({error: "Invalid token" });
    }

    return res.status(500).json({error: "Authentication error" });
  }
};

// Middleware to check if member is an admin
export const authorizeAdmin = async (,
req: AuthRequest,
res: Response,
next: NextFunction,
) => {
  if (!req.member) {
    return res.status(401).json({error: "Authentication required" });
  }

  try {
    const result = await pool.query("SELECT role FROM members WHERE id = $1", [
      req.member.memberId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({error: "Member not found" });
    }

    const memberRole = result.rows[0].role;
    if (memberRole !== "admin" && memberRole !== "superadmin") {
      return res.status(403).json({error: "Admin access required" });
    }

    next();
  } catch (error) {
    logError("Authorization,
error:", {context: "auth.ts - verifyToken",
  error
    });
    return res.status(500).json({error: "Authorization error" });
  }
};

// Middleware to check if member owns a resource
export const authorizeOwner = (,
resourceUserIdField: string) => {
  return async (,
req: AuthRequest,
res: Response,
next: NextFunction) => {
    if (!req.member) {
      return res.status(401).json({error: "Authentication required" });
    }

    const resourceUserId = parseInt(
      req.params[resourceUserIdField] || req.body[resourceUserIdField],
    );

    if (req.member.memberId !== resourceUserId) {
      // Check if member is admin
      try {
        const result = await pool.query(
          "SELECT role FROM members WHERE id = $1",
          [req.member.memberId],
        );

        if (result.rows.length === 0) {
          return res.status(404).json({error: "Member not found" });
        }

        const memberRole = result.rows[0].role;
        if (memberRole !== "admin" && memberRole !== "superadmin") {
          return res.status(403).json({error: "Access denied" });
        }
      } catch (error) {
        logError("Authorization,
error:", {context: "auth.ts - checkPermissions",
  error
        });
        return res.status(500).json({error: "Authorization error" });
      }
    }

    next();
  };
};

export default {
  authenticateToken,
  authorizeAdmin,
  authorizeOwner
};
