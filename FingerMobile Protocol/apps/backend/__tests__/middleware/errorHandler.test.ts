import { errorHandler, notFoundHandler, ApiError } from '../../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('Error Handler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      user: {
        id: 'user-123'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any
    };
    nextFunction = jest.fn();
  });

  describe('errorHandler', () => {
    it('should handle generic error', () => {
      const error = new Error('Test error');
      
      errorHandler(error, mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should handle ApiError with custom status', () => {
      const error = new ApiError(404, 'Not found');
      
      errorHandler(error, mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should include stack trace in development', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Test error');
      
      errorHandler(error, mockReq as Request, mockRes as Response, nextFunction);

      const jsonResponse = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(jsonResponse.error.stack).toBeDefined();
    });
  });

  describe('notFoundHandler', () => {
    it('should return 404 for undefined routes', () => {
      notFoundHandler(mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Route not found',
            statusCode: 404
          })
        })
      );
    });
  });

  describe('ApiError class', () => {
    it('should create error with status code and message', () => {
      const error = new ApiError(400, 'Bad request');
      
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad request');
      expect(error.isOperational).toBe(true);
    });

    it('should default to operational error', () => {
      const error = new ApiError(500, 'Internal error');
      expect(error.isOperational).toBe(true);
    });
  });
});
