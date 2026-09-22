import type { Request, Response } from 'express'
import { sendError } from './http.js'

export function notFoundHandler(_req: Request, res: Response) {
  return sendError(res, 'API not found', 404);
}