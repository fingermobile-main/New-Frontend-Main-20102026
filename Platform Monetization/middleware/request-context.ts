import { Request, Response, NextFunction } from 'express';

interface RequestContext {
  userId?: string;
  requestId?: string;
  timestamp?: Date;
}

declare global {
  namespace Express {
    interface Request {
      context?: RequestContext;
    }
  }
}

export const requestContext = (req: Request, res: Response, next: NextFunction) => {
  req.context = {
    requestId: generateRequestId(),
    timestamp: new Date()
  };
  
  next();
};

function generateRequestId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}