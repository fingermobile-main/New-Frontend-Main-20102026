import { Request, Response, NextFunction } from 'express';

export const sendSuccess = (res: Response, data: any, message: string = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res: Response, message: string, statusCode: number = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(statusCode >= 500 && { error: message })
  });
};

export const handleAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};