import type { Request, Response } from 'express'
import { sendError } from './http.js'

export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, 404, 'API not found', {
    path: req.path,
    requestId: req.requestId,
  })
}
