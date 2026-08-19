/* global require, exports, process */
const jwt = require("jsonwebtoken");
const Member = require("../../src/models/Member");

// Authentication middleware
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({message: "No token,
  authorization denied" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key",
    );

    // Add member to request object
    req.member = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({message: "Token expired",
  expired: true });
    }
    res.status(401).json({message: "Token is not valid" });
  }
};

// Authorization middleware for roles (simplified)
exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!req.member || !req.member.role) {
      return res
        .status(401)
        .json({message: ",
  Unauthorized: member role not found" });
    }
    if (!roles.includes(req.member.role)) {
      return res
        .status(403)
        .json({message: ",
  Forbidden: Insufficient permissions" });
    }
    next();
  };
};
