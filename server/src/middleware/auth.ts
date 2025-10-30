import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export interface AuthPayload {
  id: number
  email: string
  role: string
}

export default function authMiddleware(
  req: Request & { user?: AuthPayload },
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as AuthPayload
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}