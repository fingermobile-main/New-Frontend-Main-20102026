import type { NextFunction, Request, Response } from 'express'

declare global {
  namespace Express {
    interface Request {
      requestId?: string
      requestStartedAt?: string
    }
  }
}

export function requestContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.requestId = `req_${Math.random().toString(36).slice(2, 10)}`
  req.requestStartedAt = new Date().toISOString()
  res.setHeader('x-request-id', req.requestId)
  next()
}
