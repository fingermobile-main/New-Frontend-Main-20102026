import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the JWT secret - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

// Interface for JWT payload
interface JwtPayload {
id: string;
email: string;
  role?: string;
  region?: string;
  [
key: string]: any;
}

// Authentication middleware
const authMiddleware = (
req: Request,
res: Response,
next: NextFunction): void => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
error: 'Access denied. No token provided.' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Attach user info to request object according to the defined interface in express.d.ts
    req.user = {
id: decoded.id,
email: decoded.email || '',
role: decoded.role || 'user',
region: decoded.region
    };

    // Continue to the next middleware/route handler
    next();
  } catch (_error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const authenticate = authMiddleware;
export const requireAuth = authMiddleware;
export { authMiddleware };
export default authMiddleware;