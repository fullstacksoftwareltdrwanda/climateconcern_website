import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export interface AdminPayload {
  id: string;
  email: string;
  isMainAdmin: boolean;
  permissions: Record<string, { view: boolean; edit: boolean; delete: boolean }>;
}

// Extend Express Request to carry admin info
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : (typeof req.query.token === 'string' ? req.query.token : null);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized — no token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: string };

    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
    if (!admin || !admin.isActive) {
      res.status(401).json({ error: 'Unauthorized — account not found or inactive' });
      return;
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
      isMainAdmin: admin.isMainAdmin,
      permissions: (admin.permissions as Record<string, { view: boolean; edit: boolean; delete: boolean }>) ?? {},
    };

    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized — invalid or expired token' });
  }
}
