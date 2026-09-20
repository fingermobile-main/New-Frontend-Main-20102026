import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Define the structure for request context
interface RequestContext {
  startTime: number;
  userAgent?: string;
  ip?: string;
  url: string;
  method: string;
}

// Module augmentation to extend Express Request type
declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;
  }
}

// Request context storage
const requestContext = new Map<string, RequestContext>();

// Middleware to set up request context
export const requestContextMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  requestContext.set(requestId, {
    startTime: Date.now(),
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    url: req.url,
    method: req.method
  });

  // Store request ID in the request object
  req.requestId = requestId;

  next();
};

// Get request context
export const getRequestContext = (requestId?: string) => {
  if (!requestId) {
    return null;
  }
  return requestContext.get(requestId) || null;
};

// Remove request context when done
export const cleanupRequestContext = (requestId: string) => {
  requestContext.delete(requestId);
};

// Alternative implementation using interface instead of namespace
export interface RequestContextManagerInterface {
  get: (requestId?: string) => RequestContext | null;
  set: (requestId: string, context: RequestContext) => void;
  remove: (requestId: string) => void;
  middleware: (req: Request, res: Response, next: NextFunction) => void;
}

export const RequestContextManager: RequestContextManagerInterface = {
  get: (requestId?: string) => getRequestContext(requestId),
  set: (requestId: string, context: RequestContext) => requestContext.set(requestId, context),
  remove: (requestId: string) => cleanupRequestContext(requestId),
  middleware: requestContextMiddleware
};