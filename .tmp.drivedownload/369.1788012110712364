import type { NextFunction, Request, Response } from 'express'
import { sendError } from './http.js'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(`[${req.requestId}]`, error)
  return sendError(res, 500, 'Server internal error', {
    requestId: req.requestId,
  })
}
