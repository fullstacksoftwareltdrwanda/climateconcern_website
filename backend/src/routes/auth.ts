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

// Profile update handler (supports both PUT and PATCH)
const handleProfileUpdate = async (req: Request, res: Response): Promise<void> => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { name, email, currentPassword, newPassword } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { id: req.admin!.id } });
  if (!admin) {
    res.status(404).json({ error: 'Admin not found' });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (name && name.trim()) updateData.name = name.trim();
  if (email && email.trim() && email.trim().toLowerCase() !== admin.email.toLowerCase()) {
    const exists = await prisma.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (exists && exists.id !== admin.id) {
      res.status(400).json({ error: 'Email is already in use by another account' });
      return;
    }
    updateData.email = email.trim().toLowerCase();
  }

  if (newPassword) {
    if (!currentPassword) {
      res.status(400).json({ error: 'Current password is required to change password' });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }
    updateData.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'No changes provided' });
    return;
  }

  const updated = await prisma.admin.update({
    where: { id: req.admin!.id },
    data: updateData,
    select: { id: true, name: true, email: true, isMainAdmin: true, permissions: true },
  });

  // Re-issue JWT token with the new details
  const token = jwt.sign({ id: updated.id }, process.env.JWT_SECRET ?? '', { expiresIn: '7d' });

  res.json({
    message: 'Profile updated successfully',
    admin: updated,
    token,
  });
};

router.put('/profile', requireAuth, handleProfileUpdate);
router.patch('/profile', requireAuth, handleProfileUpdate);

// POST /api/auth/test-email — test SMTP sending
router.post('/test-email', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const targetEmail = req.body?.email || req.admin?.email;
  if (!targetEmail) {
    res.status(400).json({ error: 'Target email is required' });
    return;
  }

  try {
    const { sendMail } = await import('../lib/mailer');
    await sendMail(
      targetEmail,
      'Climate Concern — SMTP Test Email',
      `
        <div style="font-family:sans-serif;padding:20px;max-width:500px;border:1px solid #ccebd7;border-radius:12px;">
          <h2 style="color:#00652c;margin-top:0;">✅ SMTP Mailer is Working!</h2>
          <p>This is a test email sent from the Climate Concern Rwanda backend system.</p>
          <p style="font-size:13px;color:#666;">Triggered by: <strong>${req.admin?.name} (${req.admin?.email})</strong></p>
          <p style="font-size:12px;color:#999;">Sent at: ${new Date().toISOString()}</p>
        </div>
      `
    );
    res.json({ success: true, message: `Test email successfully dispatched to ${targetEmail}` });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to send test email',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

export default router;
