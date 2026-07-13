import winston from 'winston'
import path from 'path'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'

// 扩展 Express 的 Request 接口以包含用户属性
interface RequestWithUser extends Request {
  user?: {
    id?: string | number
  }
}

const logDir = process.env.LOG_DIR || './logs'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
)

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
    return `${timestamp} [${level}]: ${message}${metaStr}`
  })
)

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  )
}

export const requestLogger = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info({
      type: 'http_request',
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration_ms: duration,
      ip: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent'),
      user_id: req.user?.id || 'anonymous',
    })
  })
  
  next()
}

export const errorLogger = (err: Error, req: RequestWithUser, res: Response, next: NextFunction) => {
  logger.error({
    type: 'http_error',
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl || req.url,
    user_id: req.user?.id || 'anonymous',
  })
  
  next(err)
}