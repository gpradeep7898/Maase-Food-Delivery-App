import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: 'customer' | 'cook' | 'admin';
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing auth token' });

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid or expired token' });

  req.userId = user.id;
  // Check role from user metadata or DB
  req.userRole = (user.user_metadata?.role as 'customer' | 'cook' | 'admin') ?? 'customer';
  next();
}

export async function requireCook(req: AuthRequest, res: Response, next: NextFunction) {
  await requireAuth(req, res, async () => {
    if (req.userRole !== 'cook' && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Cook access required' });
    }
    next();
  });
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  await requireAuth(req, res, async () => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}
