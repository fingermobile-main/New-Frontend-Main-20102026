import crypto from 'crypto'
import type { Request, Response, NextFunction } from 'express'

export const verifyWebhookSignature = (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-webhook-signature'] || req.headers['x-signature']
    
    if (!signature) {
      return res.status(401).json({
        success: false,
        error: 'Missing webhook signature header',
      })
    }

    const secret = process.env.WEBHOOK_SECRET
    
    if (!secret) {
      console.error('WEBHOOK_SECRET environment variable is not configured')
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
      })
    }

    const payload = JSON.stringify(req.body)
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    const signatureString = String(signature)
    
    if (!crypto.timingSafeEqual(
      Buffer.from(signatureString),
      Buffer.from(expectedSignature)
    )) {
      return res.status(401).json({
        success: false,
        error: 'Invalid webhook signature',
      })
    }

    next()
  } catch (error) {
    console.error('Webhook signature verification error:', error)
    return res.status(500).json({
      success: false,
      error: 'Error verifying webhook signature',
    })
  }
}

export const generateWebhookSignature = (payload: any): string => {
  const secret = process.env.WEBHOOK_SECRET
  
  if (!secret) {
    throw new Error('WEBHOOK_SECRET environment variable is not configured')
  }

  const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload)
  
  return crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex')
}
