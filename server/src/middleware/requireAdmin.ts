import { Request, Response, NextFunction } from 'express'

export default function requireAdmin(
  req: Request & { user?: { id: number; email: string; role: string } },
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admin only' })
  }
  next()
}