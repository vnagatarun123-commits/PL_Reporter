import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  reporterId?: string;
  mobile?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = verifyToken(token);
    req.reporterId = payload.reporterId;
    req.mobile = payload.mobile;
    next();
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
}
