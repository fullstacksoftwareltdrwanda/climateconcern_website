import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !admin.isActive) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET ?? '', { expiresIn: '7d' });

  res.json({
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      isMainAdmin: admin.isMainAdmin,
      permissions: admin.permissions,
    },
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin!.id },
    select: { id: true, name: true, email: true, isMainAdmin: true, permissions: true, createdAt: true },
  });
  if (!admin) {
    res.status(404).json({ error: 'Admin not found' });
    return;
  }
  res.json(admin);
});

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().min(1).optional(),
  newPassword: z.string().min(6).optional(),
});

// PATCH /api/auth/profile — change own name, email, or password
router.patch('/profile', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { name, email, currentPassword, newPassword } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { id: req.admin!.id } });
  if (!admin) { res.status(404).json({ error: 'Admin not found' }); return; }

  const updateData: Record<string, unknown> = {};
  if (name) updateData.name = name;
  if (email && email !== admin.email) {
    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) { res.status(400).json({ error: 'Email already in use' }); return; }
    updateData.email = email;
  }

  if (newPassword) {
    if (!currentPassword) { res.status(400).json({ error: 'Current password is required to set a new password' }); return; }
    const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!valid) { res.status(401).json({ error: 'Current password is incorrect' }); return; }
    updateData.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No changes provided' }); return;
  }

  const updated = await prisma.admin.update({
    where: { id: req.admin!.id },
    data: updateData,
    select: { id: true, name: true, email: true, isMainAdmin: true, permissions: true },
  });
  res.json(updated);
});

export default router;
