import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
      return;
    }

    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Find user and check if they have admin privileges
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
      return;
    }

    // Check if user has admin role
    if (user.role !== 'admin' && user.role !== 'moderator') {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin or moderator privileges required.' 
      });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};