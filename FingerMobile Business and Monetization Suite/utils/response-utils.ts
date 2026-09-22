import { Response } from 'express';

export const sendOk = (res: Response, data: unknown) => {
  res.status(200).json({ success: true, data });
};

export const sendCreated = (res: Response, data: unknown) => {
  res.status(201).json({ success: true, data });
};

export const sendNoContent = (res: Response) => {
  res.status(204).send();
};

export const sendError = (res: Response, message: string, statusCode: number = 400) => {
  res.status(statusCode).json({ success: false, error: message });
};

export const sendNotFound = (res: Response, message: string = 'Resource not found') => {
  res.status(404).json({ success: false, error: message });
};

export const sendUnauthorized = (res: Response, message: string = 'Unauthorized') => {
  res.status(401).json({ success: false, error: message });
};

export const sendForbidden = (res: Response, message: string = 'Forbidden') => {
  res.status(403).json({ success: false, error: message });
};