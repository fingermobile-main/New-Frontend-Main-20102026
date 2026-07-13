import { Request, Response, NextFunction } from 'express';

// Define the context interface
export interface RequestContext {
  userId: string;
  permissions: string[];
  // Add other context properties as needed
}


// Define the BusinessSuiteRequest type
export interface BusinessSuiteRequest extends Request {
  context?: RequestContext;
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

// Export a default function to initialize context (if needed)
export const initializeContext = (req: Request, res: Response, next: NextFunction) => {
  req.context = {
    userId: req.headers['x-user-id'] as string || 'anonymous',
    permissions: req.headers['x-permissions'] ? (req.headers['x-permissions'] as string).split(',') : [],
  };
  next();
};