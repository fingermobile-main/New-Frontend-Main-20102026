import { Request, Response /*, NextFunction */ } from 'express';  // Removed unused NextFunction import

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response /*, next: NextFunction */) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;
  
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};