import rateLimit from 'express-rate-limit'
import type { Request, Response } from 'express'

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10) // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)

export const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  standardHeaders: true,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
    retryAfter: Math.ceil(WINDOW_MS / 1000),
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please slow down.',
      retryAfter: Math.ceil(WINDOW_MS / 1000),
    })
  },
})

export const strictLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // 10 requests per minute
  standardHeaders: true,
  message: {
    success: false,
    error: 'Too many sensitive operations. Please wait before trying again.',
  },
})

export const webhookLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 100, // 100 webhooks per minute
  standardHeaders: true,
  message: {
    success: false,
    error: 'Webhook rate limit exceeded.',
  },
})
