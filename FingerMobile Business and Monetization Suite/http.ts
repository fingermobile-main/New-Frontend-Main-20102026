import type { Response } from 'express'

export function sendOk(res: Response, data: unknown, message = 'ok') {
  return res.status(200).json({
    success: true,
    message,
    data,
  })
}

export function sendCreated(res: Response, data: unknown, message = 'created') {
  return res.status(201).json({
    success: true,
    message,
    data,
  })
}

export function sendError(
  res: Response,
  status: number,
  message: string,
  details?: unknown,
) {
  return res.status(status).json({
    success: false,
    message,
    details,
  })
}
