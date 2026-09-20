import type { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export function sendOk<T>(res: Response, data: T, message?: string) {
  return res.status(200).json({
    success: true,
    data,
    message,
  });
}

export function sendCreated<T>(res: Response, data: T, message?: string) {
  return res.status(201).json({
    success: true,
    data,
    message,
  });
}

export function sendError(res: Response, message: string, status = 400) {
  return res.status(status).json({
    success: false,
    message,
  });
}