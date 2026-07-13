import { Request, Response, NextFunction } from 'express';

export function validateRequest() {  // Removed schema parameter as it's not used
  return (_req: Request, res: Response, next: NextFunction) => {
    // Basic validation - can be enhanced with a proper validation library like Joi or Zod
    if (!_req.body || Object.keys(_req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Request body is required',
      });
    }
    next();
  };
}

export function validateParams() {  // Removed paramSchema parameter as it's not used
  return (_req: Request, res: Response, next: NextFunction) => {
    // Basic parameter validation
    if (!_req.params || Object.keys(_req.params).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Request parameters are required',
      });
    }
    next();
  };
}