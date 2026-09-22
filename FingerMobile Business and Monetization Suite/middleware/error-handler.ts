import { Request, Response } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}

export const errorHandler = (err: CustomError, _req: Request, res: Response /*, next: NextFunction */) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: err.status || 'error',
    statusCode,
    message,
  });
};